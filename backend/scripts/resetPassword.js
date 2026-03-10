require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const bcrypt = require("bcrypt");
const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
});

async function resetPassword() {
    const hash = await bcrypt.hash("Admin@123", 10);
    const result = await pool.query(
        "UPDATE users SET password=$1 WHERE email=$2",
        [hash, "admin@example.com"]
    );
    console.log("✅ Password reset to Admin@123! Rows affected:", result.rowCount);
    pool.end();
}

resetPassword().catch((err) => {
    console.error("❌ Error:", err.message);
    pool.end();
});
