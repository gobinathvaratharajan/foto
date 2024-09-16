const db = require('./knex')();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

exports.create = async function (user, account) {
	const data = {
		id: uuidv4(),
		email: user.email,
		default_account: account,
	};

	// security password with hash
	const salt = await bcrypt.genSalt(10);
	data.password = await bcrypt.hash(user.password, salt);

	await db('user').insert(data);

	delete data.password;
	data.account_id = account;
	return data;
};

exports.get = async function (id, email, account, permission, username) {
	const cols = [
		'id',
		'username',
		'email',
		'date_created',
		'avatar',
		'bio',
		'last_active',
		'disabled',
		'account_id',
		'permission',
		'default_account',
	];
	const data = await db('user')
		.select(cols)
		.join('account_user', 'account_user.user_id', 'user.id')
		.where({
			...id && { id: id },
			...email && { email: email },
			...permission && { 'account_user.permission': permission },
			...username && { username: username },
			...account && { account_id: account },
        })
        .modify((query) => {
        !account && (id || email) && query.where('account_id', db.raw('default_account'))
    })

    return (id || email || username) ? data[0] : data;
};

exports.public = async function (username) {
    return await username ? db('user').select('id', 'username', 'avatar', 'bio')
    .join('account_user', 'account_user.user_id', 'user.id')
    .where('username', username) : false
}

exports.account = async function (id) {
    return await db('account_user')
        .select('account_id as id', 'permission', 'username')
        .join('account', 'account.id', 'account_user.account_id')
        .where('user_id', id)
        .orderBy('account.date_created', 'asc');
}

exports.account.add = async function (id, account, data) {
    data.username = data.username.replace(' ', '-').toLowerCase().replace('/[^a-zA-Z0-9]/g', '')

    return await db('account_user')
        .insert({
            user_id: id,
            account_id: account,
            permission: data.permission,
            username: data.username,
            avatar:` ${process.env.AVATAR_API}?name=${data.username}&background=random&size=100&length=1&color=ffffff&rounded=true`
        })
}

exports.account.delete = async function (id, account) {
    return await db('account_user').del()
    .where({ user_id: id, account_id: account })
}

exports.update = async function (id, account, data) {
    const user = {...data};

    if (user.permission || user.bio || user.avatar) {
        await db('account_user').update({
            ...user.avatar && { avatar: user.avatar },
            ...user.permission && { permission: user.permission },
            ...user.bio && { bio: user.bio }
        })
        .where('user_id', id);
        delete user.avatar;
        delete user.permission;
        delete user.bio;
    }

    // update user table
    if(Object.keys(user).length) {
        await db('user').update(user)
            .where('id', function() {
                this.select('user_id').from('account_user')
                .where({ account_id: account, user_id: id })
            })
    }

    return data;
}

exports.password = async function (id, account) {
    const data = await db('user').select('password').join('account_user', 'account_user.user_id', 'user.id').where({ id : id, 'account_user.account.id': account });

    return data.length ? data[0] : null;
 }

 exports.password.verify = async function (id, account, password) {
    const data = await db('user').select('username', 'email', 'password').join('account_user', 'account_user.user_id', 'user.id').where({ id: id, 'account_user.account_id': account });
    const verified = data[0].password ? await bcrypt.compare(password, data[0].password) : false;

    delete data[0].password;
    return verified ? data[0] : false;
 }

exports.delete = async function (id, account) {
    return (id && account) ? await db('user').del()
        .where('id', function () {
            this.select('user_id').from('account_user')
            .where({ account_id: account, user_id: id })
        }) : false;
}