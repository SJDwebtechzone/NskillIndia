const pool = require('./backend/config/db');
const { courses } = require('./frontend/data/courses');

async function setupDatabase() {
    try {
        console.log("Checking for 'courses' table...");
        
        // Create table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS courses (
                id SERIAL PRIMARY KEY,
                slug VARCHAR(255) UNIQUE NOT NULL,
                title VARCHAR(255) NOT NULL,
                category VARCHAR(50),
                eligibility TEXT,
                duration VARCHAR(100),
                certification TEXT,
                detailed_syllabus TEXT,
                admissions TEXT,
                json_data JSONB DEFAULT '{}',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ 'courses' table ready.");

        console.log("Seeding courses...");
        for (const course of courses) {
            const {
                id: slug,
                title,
                category,
                eligibility,
                duration,
                certification,
                content,
                ...rest
            } = course;

            const detailed_syllabus = Array.isArray(content) ? content.join('\n') : (content || '');
            
            // rest contains: videos, goal, overview, features, projectWork, dissertation, assessments, courseOutcomes
            const json_data = rest;

            await pool.query(`
                INSERT INTO courses (slug, title, category, eligibility, duration, certification, detailed_syllabus, json_data)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (slug) DO UPDATE SET
                    title = EXCLUDED.title,
                    category = EXCLUDED.category,
                    eligibility = EXCLUDED.eligibility,
                    duration = EXCLUDED.duration,
                    certification = EXCLUDED.certification,
                    detailed_syllabus = EXCLUDED.detailed_syllabus,
                    json_data = EXCLUDED.json_data,
                    updated_at = CURRENT_TIMESTAMP
            `, [slug, title, category, eligibility, duration, certification, detailed_syllabus, JSON.stringify(json_data)]);
            
            console.log(`   - Seeded: ${title}`);
        }

        console.log("✅ Seeding completed.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Database setup error:", err);
        process.exit(1);
    }
}

setupDatabase();
