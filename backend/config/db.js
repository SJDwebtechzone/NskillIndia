const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "Nskill",
    password: "Gautham@123",
    port: 5432,
});

pool.connect()
    .then(() => console.log("✅ PostgreSQL Connected"))
    .catch(err => console.error("❌ DB Connection Error:", err));

module.exports = pool;