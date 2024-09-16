// create table
exports.up = function (knex) {
	return knex.schema.createTable('user', (table) => {
		table.specificType('id', 'char(36) primary key');
		table.string('email').notNullable();
		table.string('password').notNullable();
		table.timestamp('date_created').defaultTo(knex.fn.now());
		table.timestamp('last_active').defaultTo(knex.fn.now());
		table.string('disabled').notNullable().defaultTo(0);
		table.string('default_account', 36).notNullable();
	});
};

// drop table
exports.down = function (knex) {
	return knex.schema.dropTable('user');
};
