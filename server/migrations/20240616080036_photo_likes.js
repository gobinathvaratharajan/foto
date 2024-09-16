// create table
exports.up = function (knex) {
	return knex.schema.createTable('photo_likes', (table) => {
		table.specificType('id', 'char(36) primary key');
		table.string('photo_id', 36).references('id').inTable('photo').onDelete('cascade'); // cascade delete the associated item also
		table.string('user_id', 36).references('id').inTable('user').onDelete('cascade');
	});
};

// drop table
exports.down = function (knex) {
	return knex.schema.dropTable('photo_likes');
};
