// create table
exports.up = function (knex) {
	return knex.schema.createTable('invite', (table) => {
		table.specificType('id', 'char(16) primary key');
		table.string('email').notNullable();
		table.string('permission', 32);
		table.timestamp('date_sent').defaultTo(knex.fn.now());
		table.bool('user').defaultTo(false);
		table.string('account_id', 36).references('id').inTable('account').onDelete('cascade');
	});
};

// drop table
exports.down = function (knex) {
	return knex.schema.dropTable('invite');
};
