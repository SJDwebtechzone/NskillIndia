const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// --- Multer Configuration ---
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

const upload = multer({ storage: storage });

// --- Banners ---

// Get all banners
router.get("/banners", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM banners ORDER BY order_index ASC");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Add a banner with image upload
router.post("/banners", upload.single("image"), async (req, res) => {
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
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Add a popup
router.post("/popups", async (req, res) => {
    try {
        const { image_url, title, description, course_id } = req.body;
        const result = await pool.query(
            "INSERT INTO popups (image_url, title, description, course_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [image_url, title, description, course_id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
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

module.exports = router;
