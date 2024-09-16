// create table
exports.up = function (knex) {
	return knex.schema.createTable('account_user', (table) => {
		table.increments('key').primary().unsigned();
		table.string('username').notNullable();
		table.string('permission', 64).notNullable();
		table.string('bio');
		table.string('avatar');
		table.string('account_id', 36).references('id').inTable('account').onDelete('cascade');
		table.string('user_id', 36).references('id').inTable('user').onDelete('cascade');
	});
};

// drop table
exports.down = function (knex) {
	return knex.schema.dropTable('account_user');
};
