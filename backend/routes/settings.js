const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// --- Multer Configuration for Banners ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = "uploads/banners/";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// --- Multer Configuration for Videos ---
const videoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = "uploads/videos/";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, "video-" + Date.now() + path.extname(file.originalname));
    },
});

const uploadBanner = multer({ storage: storage });
const uploadVideo = multer({ storage: videoStorage });

// --- Banners ---

// Get all banners
router.get("/banners", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM banners ORDER BY order_index ASC");
        res.json(result.rows);
    } catch (err) {
        console.error("[banners] DB error:", err.message);
        res.json([]); // Return empty array so frontend degrades gracefully
    }
});

// Add a banner with image upload
router.post("/banners", uploadBanner.single("image"), async (req, res) => {
    try {
        const { title, order_index } = req.body;
        const image_url = req.file ? `http://localhost:5000/uploads/banners/${req.file.filename}` : "";

        const result = await pool.query(
            "INSERT INTO banners (image_url, title, order_index) VALUES ($1, $2, $3) RETURNING *",
            [image_url, title, order_index || 0]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Delete a banner
router.delete("/banners/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Optional: Delete file from disk
        const banner = await pool.query("SELECT image_url FROM banners WHERE id = $1", [id]);
        if (banner.rows.length > 0 && banner.rows[0].image_url) {
            const filename = banner.rows[0].image_url.split('/').pop();
            const filepath = path.join(__dirname, '../uploads/banners', filename);
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        }

        await pool.query("DELETE FROM banners WHERE id = $1", [id]);
        res.json({ message: "Banner deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Update banner status
router.put("/banners/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;
        const result = await pool.query(
            "UPDATE banners SET is_active = $1 WHERE id = $2 RETURNING *",
            [is_active, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// --- Popups (Keep as URL for now or can also convert if needed, but the user specifically asked for Banner) ---

// Get all popups
router.get("/popups", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM popups ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        console.error("[popups] DB error:", err.message);
        res.json([]); // Return empty array so frontend degrades gracefully
    }
});

// Add a popup with video upload
router.post("/popups", uploadVideo.single("video"), async (req, res) => {
    try {
        console.log("Receive popup upload request:", req.body);
        const { title, description, course_id, video_placement } = req.body;
        const video_url = req.file ? `http://localhost:5000/uploads/videos/${req.file.filename}` : "";

        console.log("Inserting into database...");
        // Provide defaults for all columns that might be mandatory
        const query = `
            INSERT INTO popups 
            (title, description, course_id, video_url, video_placement, position, image_url, is_active) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *
        `;
        const values = [
            title || "",
            description || "",
            course_id || "",
            video_url,
            video_placement || 'intro',
            video_placement || 'intro', // Use both just in case
            "", // image_url
            true // is_active
        ];

        const result = await pool.query(query, values);
        console.log("Successfully created popup:", result.rows[0].id);
        res.json(result.rows[0]);
    } catch (err) {
        console.error("CRITICAL Popup upload error:");
        console.error("Message:", err.message);
        if (err.detail) console.error("Detail:", err.detail);
        if (err.hint) console.error("Hint:", err.hint);
        if (err.where) console.error("Where:", err.where);

        res.status(500).json({
            error: "Server Error during popup upload",
            message: err.message,
            detail: err.detail
        });
    }
});

// Delete a popup
router.delete("/popups/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM popups WHERE id = $1", [id]);
        res.json({ message: "Popup deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Update popup status (only one active at a time)
router.put("/popups/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        if (is_active) {
            await pool.query("UPDATE popups SET is_active = FALSE");
        }

        const result = await pool.query(
            "UPDATE popups SET is_active = $1 WHERE id = $2 RETURNING *",
            [is_active, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// --- Latest News ---

// Multer for news images
const newsStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = "uploads/news/";
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const uploadNews = multer({ storage: newsStorage });

// Get all news
router.get("/news", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM latest_news ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        console.error("[news] DB error:", err.message);
        res.json([]); // Return empty array so frontend degrades gracefully
    }
});

// Add a news item
router.post("/news", uploadNews.single("image"), async (req, res) => {
    try {
        const { title, content } = req.body;
        const image_url = req.file ? `http://localhost:5000/uploads/news/${req.file.filename}` : "";
        const result = await pool.query(
            "INSERT INTO latest_news (title, content, image_url) VALUES ($1, $2, $3) RETURNING *",
            [title, content, image_url]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Delete a news item
router.delete("/news/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const news = await pool.query("SELECT image_url FROM latest_news WHERE id = $1", [id]);
        if (news.rows.length > 0 && news.rows[0].image_url) {
            const filename = news.rows[0].image_url.split('/').pop();
            const filepath = path.join(__dirname, '../uploads/news', filename);
            if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        }
        await pool.query("DELETE FROM latest_news WHERE id = $1", [id]);
        res.json({ message: "News deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// --- Accreditations ---
const accreditationsStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = "uploads/accreditations/";
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const uploadAccreditations = multer({ storage: accreditationsStorage });

router.get("/accreditations", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM accreditations ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        console.error("[accreditations] DB error:", err.message);
        res.json([]); // Return empty array so frontend degrades gracefully
    }
});

router.post("/accreditations", uploadAccreditations.single("image"), async (req, res) => {
    try {
        const { title } = req.body;
        const image_url = req.file ? `http://localhost:5000/uploads/accreditations/${req.file.filename}` : "";
        const result = await pool.query(
            "INSERT INTO accreditations (title, image_url) VALUES ($1, $2) RETURNING *",
            [title, image_url]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.delete("/accreditations/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const item = await pool.query("SELECT image_url FROM accreditations WHERE id = $1", [id]);
        if (item.rows.length > 0 && item.rows[0].image_url) {
            const filename = item.rows[0].image_url.split('/').pop();
            const filepath = path.join(__dirname, '../uploads/accreditations', filename);
            if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        }
        await pool.query("DELETE FROM accreditations WHERE id = $1", [id]);
        res.json({ message: "Deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// --- Courses Management ---

// Get all courses
router.get("/courses", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM courses ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        console.error("[courses] DB error:", err.message);
        res.status(500).json({ error: "Server Error", message: err.message });
    }
});

// Get single course by ID or slug
router.get("/courses/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "SELECT * FROM courses WHERE id = $1 OR slug = $2",
            [parseInt(id) || -1, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("[courses/:id] DB error:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

// Add a new course
router.post("/courses", async (req, res) => {
    try {
        const {
            title,
            slug,
            category,
            eligibility,
            duration,
            certification,
            detailed_syllabus,
            admissions,
            json_data
        } = req.body;

        const result = await pool.query(
            `INSERT INTO courses 
            (title, slug, category, eligibility, duration, certification, detailed_syllabus, admissions, json_data) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *`,
            [
                title,
                slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                category,
                eligibility,
                duration,
                certification,
                detailed_syllabus,
                admissions,
                JSON.stringify(json_data || {})
            ]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error("[courses POST] DB error:", err.message);
        res.status(500).json({ error: "Server Error", detail: err.detail });
    }
});

// Update a course
router.put("/courses/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            slug,
            category,
            eligibility,
            duration,
            certification,
            detailed_syllabus,
            admissions,
            json_data
        } = req.body;

        const result = await pool.query(
            `UPDATE courses SET 
                title = $1, 
                slug = $2, 
                category = $3, 
                eligibility = $4, 
                duration = $5, 
                certification = $6, 
                detailed_syllabus = $7, 
                admissions = $8, 
                json_data = $9, 
                updated_at = CURRENT_TIMESTAMP 
            WHERE id = $10 RETURNING *`,
            [
                title,
                slug,
                category,
                eligibility,
                duration,
                certification,
                detailed_syllabus,
                admissions,
                JSON.stringify(json_data || {}),
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("[courses PUT] DB error:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

// Delete a course
router.delete("/courses/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM courses WHERE id = $1", [id]);
        res.json({ message: "Course deleted successfully" });
    } catch (err) {
        console.error("[courses DELETE] DB error:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;
