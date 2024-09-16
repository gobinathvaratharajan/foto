// create table
exports.up = function (knex) {
	return knex.schema.createTable('account', (table) => {
		table.specificType('id', 'char(36) primary key');
		table.timestamp('date_created').defaultTo(knex.fn.now());
		table.string('stripe_customer_id', 32);
		table.string('stripe_subscription_id', 32);
		table.string('plan', 64);
		table.boolean('active').notNullable();
	});
};

// drop table
exports.down = function (knex) {
	return knex.schema.dropTable('account');
};
