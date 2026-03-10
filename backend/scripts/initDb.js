const pool = require("../config/db");
const bcrypt = require("bcrypt");

async function initDb() {
    try {
        // Create users table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("✅ Users table ensured.");

        // Check if admin exists
        const adminCheck = await pool.query("SELECT * FROM users WHERE email = $1", ["admin@example.com"]);
        if (adminCheck.rows.length === 0) {
            const hash = await bcrypt.hash("Admin@123", 10);
            await pool.query(
                "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
                ["Admin", "admin@example.com", hash, "admin"]
            );
            console.log("✅ Admin user created: admin@example.com / Admin@123");
        } else {
            console.log("✅ Admin user already exists.");
        }

        // Create settings table (if needed by backend/routes/settings)
        // Create settings table (if needed by backend/routes/settings)
        await pool.query(`
          CREATE TABLE IF NOT EXISTS settings (
            key VARCHAR(50) PRIMARY KEY,
            value TEXT
          );
        `);
        console.log("✅ Settings table ensured.");

        // Create chat logs table (if needed by backend/routes/chat)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS chat_logs (
              id SERIAL PRIMARY KEY,
              user_email VARCHAR(100),
              message TEXT,
              response TEXT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
          `);
        console.log("✅ Chat logs table ensured.");

        // --- Tables for Settings/CMS ---
        await pool.query(`
          CREATE TABLE IF NOT EXISTS banners (
            id SERIAL PRIMARY KEY,
            image_url TEXT NOT NULL,
            title VARCHAR(255),
            order_index INT DEFAULT 0,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
          CREATE TABLE IF NOT EXISTS popups (
            id SERIAL PRIMARY KEY,
            image_url TEXT NOT NULL,
            title VARCHAR(255),
            description TEXT,
            course_id INT,
            is_active BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
          CREATE TABLE IF NOT EXISTS latest_news (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT,
            image_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
          CREATE TABLE IF NOT EXISTS accreditations (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255),
            image_url TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log("✅ CMS tables ensured.");

    } catch (err) {
        console.error("❌ Error initializing database:", err.message);
    } finally {
        pool.end();
    }
}

initDb();
