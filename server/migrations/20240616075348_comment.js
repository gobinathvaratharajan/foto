// create table
exports.up = function (knex) {
	return knex.schema.createTable('comment', (table) => {
		table.specificType('id', 'char(36) primary key');
		table.string('text').notNullable();
		table.timestamp('date_created').notNullable().defaultTo(knex.fn.now());
		table.string('photo_id', 36).references('id').inTable('photo').onDelete('cascade'); // cascade delete the associated item also
		table.string('account_id', 36).references('id').inTable('account').onDelete('cascade');
		table.string('user_id', 36).references('id').inTable('user').onDelete('cascade');
	});
};

// drop table
exports.down = function (knex) {
	return knex.schema.dropTable('comment');
};
