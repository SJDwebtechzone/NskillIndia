const pool = require('./backend/config/db');
const fs = require('fs');

async function check() {
    try {
        console.log("Checking columns...");
        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'popups'
        `);
        fs.writeFileSync('db_check.json', JSON.stringify(res.rows, null, 2));
        console.log("Done. Check db_check.json");
    } catch (err) {
        fs.writeFileSync('db_error.txt', err.message);
        console.error("FAILED to query database:", err.message);
    } finally {
        await pool.end();
    }
}

check();
