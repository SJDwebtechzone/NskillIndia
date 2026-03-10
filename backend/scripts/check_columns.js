const pool = require('./config/db');

async function check() {
    try {
        const res = await pool.query("SELECT * FROM popups LIMIT 1;");
        console.log("Columns:", Object.keys(res.rows[0] || {}).join(", "));
    } catch (err) {
        console.error("Query Error:", err.message);
    } finally {
        await pool.end();
    }
}

check();
