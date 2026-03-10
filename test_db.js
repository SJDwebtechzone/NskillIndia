const pool = require('./backend/config/db');

async function test() {
    try {
        console.log("Starting test...");
        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'popups'
        `);
        console.log("Success! Columns:", JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error("FAILED to query database:", err.message);
    } finally {
        await pool.end();
    }
}

test();
