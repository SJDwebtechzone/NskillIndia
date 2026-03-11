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

          -- Student Enquiry Form Table
          CREATE TABLE IF NOT EXISTS student_enquiries (
            id SERIAL PRIMARY KEY,
            enquiry_id VARCHAR(20) UNIQUE NOT NULL,
            enquiry_date DATE DEFAULT CURRENT_DATE,
            mode_of_enquiry VARCHAR(50),
            
            -- Student Personal Details
            student_name VARCHAR(255) NOT NULL,
            gender VARCHAR(20),
            age INT,
            dob DATE,
            mobile_number VARCHAR(20),
            whatsapp_number VARCHAR(20),
            email_id VARCHAR(255),
            
            -- Location Details
            perm_address TEXT,
            perm_city VARCHAR(100),
            perm_state VARCHAR(100),
            perm_pin VARCHAR(20),
            curr_address TEXT,
            curr_city VARCHAR(100),
            curr_state VARCHAR(100),
            curr_pin VARCHAR(20),
            
            -- Educational Background
            highest_qualification VARCHAR(100),
            year_of_passing VARCHAR(50),
            institution_name VARCHAR(255),
            
            -- Career Goals
            career_objective VARCHAR(100),
            preferred_country VARCHAR(100),
            expected_salary VARCHAR(100),
            willing_to_work_all_india VARCHAR(10),
            
            -- Experience & Skill
            work_experience VARCHAR(100),
            company_name VARCHAR(255),
            position VARCHAR(255),
            salary VARCHAR(100),
            location VARCHAR(255),
            skills_trade TEXT,
            
            -- Parent / Guardian Details
            father_name VARCHAR(255),
            mother_name VARCHAR(255),
            parent_contact VARCHAR(20),
            parent_occupation VARCHAR(255),
            
            -- Referral & Counsellor Details
            referred_by VARCHAR(50),
            counsellor_name VARCHAR(255),
            counsellor_code VARCHAR(100),
            will_attend_test VARCHAR(10),
            
            -- Course Interest Details
            course_interested VARCHAR(255),
            level_of_course VARCHAR(50),
            training_mode VARCHAR(50),
            batch_timing VARCHAR(50),
            
            -- Follow-up & Counselling
            counselling_date DATE,
            counselling_done_by VARCHAR(100),
            interest_level VARCHAR(50),
            follow_up_date DATE,
            remarks TEXT,
            
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
