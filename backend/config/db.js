// const { Pool } = require('pg');
// const dotenv = require('dotenv');

// dotenv.config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// module.exports = pool;

// db.js
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "Nskill",
  password: process.env.DB_PASSWORD || "root3",
  port: parseInt(process.env.DB_PORT) || 5432,
});

module.exports = pool;
