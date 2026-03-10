const pool = require('./backend/config/db');

async function check() {
    try {
        console.log("Checking DB connection...");
        const res = await pool.query('SELECT current_database(), current_user');
        console.log("DB Context:", res.rows[0]);

        console.log("Checking popups table columns...");
        const cols = await pool.query(`
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'popups'
        `);
        console.log("Columns:", JSON.stringify(cols.rows, null, 2));

        const data = await pool.query('SELECT * FROM popups LIMIT 5');
        console.log("Sample Data:", JSON.stringify(data.rows, null, 2));

    } catch (err) {
        console.error("ERROR:", err.message);
    } finally {
        await pool.end();
    }
}

check();
