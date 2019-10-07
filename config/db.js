var pg = require('pg');

const dbConfig = {
	user: 'postgres',
	database: 'postgres',
	host: process.env.POSTGRES_HOST || 'localhost',
	port: process.env.POSTGRES_PORT || 5432,
};
  
const pool = new pg.Pool(dbConfig);

module.exports = {
	query: (text, params, callback) => {
		return pool.query(text, params, callback);
	},
	pool
};