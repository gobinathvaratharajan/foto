const knex = require('knex');
const knexFile = require('../knexfile')[process.env.NODE_ENV || 'development'];

module.exports = (settings) => {
	if (!settings) settings = knexFile;
	return new knex(settings);
};

// I have organized the table design
// use query builder for writing the migration
