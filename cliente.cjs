require('dotenv').config({ path: `${__dirname}/env/.env` });

const { Client } = require("pg");

const client = new Client({
  user: process.env.PGUSER,        // PostgreSQL username
  host: process.env.PGHOST,        // PostgreSQL server host
  database: process.env.PGDATABASE,// PostgreSQL database
  password: process.env.PGPASSWORD,// PostgreSQL password
  port: process.env.PGPORT         // PostgreSQL port   
});


module.exports = client;
