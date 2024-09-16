// create table
exports.up = function (knex) {
	return knex.schema.createTable('token', (table) => {
		table.specificType('id', 'char(36) primary key');
		table.string('access');
		table.string('refresh');
		table.string('user_id', 36).notNullable().references('id').inTable('user').onDelete('cascade');
	});
};

// drop table
exports.down = function (knex) {
	return knex.schema.dropTable('token');
};
