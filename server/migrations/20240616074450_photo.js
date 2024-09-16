// create table
exports.up = function (knex) {
	return knex.schema.createTable('photo', (table) => {
		table.specificType('id', 'char(36) primary key');
		table.string('text').notNullable();
		table.string('description');
		table.timestamps(true, true);
		table.string('account_id', 36).references('id').inTable('account').onDelete('cascade');
		table.string('user_id', 36).references('id').inTable('user').onDelete('cascade');
	});
};

// drop table
exports.down = function (knex) {
	return knex.schema.dropTable('photo');
};
