const db = require('./knex')();
const { v4: uuidv4 } = require('uuid');

exports.create = async function (plan) {
	const data = {
		id: uuidv4(),
		active: true,
		plan: plan,
	};

	await db('account').insert(data);
	return data;
};

exports.get = async function (id) {
	const data = await db('account')
		.select(
			'account.id',
			'account.date_created',
			'stripe_customer_id',
			'stripe_subscription_id',
			'plan',
			'active',
			'user.email as owner_email',
			'account_user.username'
		)
		.join('account_user', 'account_user.account_id', 'account_id')
		.join('user', 'account_user.user_id', 'user.id')
		.where({ 'account.id': id, permission: 'owner' });
	return id ? data[0] : null;
};

exports.users = async function (id) {
	return id ? await db('account_user').select('user_id').where({ account_id: id }) : false;
};

exports.update = async function (id, data) {
	return await db('account').update(data).where('id', id);
};

exports.delete = async function (id) {
	return id ? await db('account').del().where('id', id) : false;
};
