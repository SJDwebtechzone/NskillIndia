const fs = require('fs');
const pool = require('./backend/config/db');

async function debugPopups() {
    try {
        const res = await pool.query("SELECT id, title, is_active, course_id, video_url FROM popups;");
        const output = {
            rows: res.rows,
            count: res.rowCount
        };
        fs.writeFileSync('db_debug_output.json', JSON.stringify(output, null, 2));
    } catch (err) {
        fs.writeFileSync('db_debug_error.txt', err.message);
    } finally {
        await pool.end();
    }
}

debugPopups();
