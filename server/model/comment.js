const db = require('./knex')();
const { v4: uuidv4 } = require('uuid');

exports.create = async function (photo, data, user, account) {
	data.id =  uuidv4();
    data.photo_id = photo;
    data.user_id = user;
    data.account_id = account;
    console.log('Data to be inserted:', {data}, photo, user, account); // Add this line to debug
	await db('comment').insert(data);
	return data;
};

exports.get = async function (id, photo) {
    return await db('comment')
    .select('comment.id', 'text', 'username', 'avatar', 'comment.user_id', 'photo_id')
    .join('account_user', function () {
        this
        .on('account_user.user_id', 'comment.user_id')
        .on('account_user.account_id', 'account_user.account_id')
    })
    .orderBy('date_created', 'asc')
    .where({
        ...id && { 'comment.id': id },
        ...photo && { 'photo_id': photo }
    })
}


exports.total =  async function (user, account) {
    const data = await db('comment')
    .count('comment.id as total')
    .join('photo', 'comment.photo_id', 'photo.id')
    .where({ 'photo.user_id': user, 'photo.account_id': account });

    return data[0].total;
}

exports.delete = async function (id, user) {
    return (id && user) ? await db('comment').del()
    .where({ id: id, user_id: user }) : false
}