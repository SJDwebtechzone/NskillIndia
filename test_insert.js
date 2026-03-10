const pool = require('./backend/config/db');

async function testInsert() {
    try {
        console.log("Trying to insert a test popup...");
        const result = await pool.query(
            "INSERT INTO popups (title, description, course_id, video_url, video_placement, image_url, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            ["test_title", "test_desc", "test_course", "test_url", "intro", "", true]
        );
        console.log("SUCCESS! Created ID:", result.rows[0].id);
    } catch (err) {
        console.error("INSERT FAILED:", err.message);
        if (err.detail) console.error("Detail:", err.detail);
    } finally {
        await pool.end();
    }
}

testInsert();
