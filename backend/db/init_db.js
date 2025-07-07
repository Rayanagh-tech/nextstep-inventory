

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// ✅ Validate required environment variables
const requiredEnvVars = ['DB_USER', 'DB_HOST', 'DB_NAME', 'DB_PASSWORD', 'DB_PORT'];
const missingEnv = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
    console.error('❌ Missing environment variables:', missingEnv.join(', '));
    process.exit(1);
}

// ✅ Initialize PostgreSQL connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

async function initializeDatabase() {
    try {
        console.log('🔌 Testing database connection...');
        await pool.query('SELECT 1');
        console.log('✅ Database connection successful');

        // Load schema.sql
        const schemaPath = path.join(__dirname, 'schema.sql');
        if (!fs.existsSync(schemaPath)) throw new Error('Missing schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Load seed.sql
        const seedPath = path.join(__dirname, 'seed.sql');
        if (!fs.existsSync(seedPath)) throw new Error('Missing seed.sql');
        const seedSql = fs.readFileSync(seedPath, 'utf8');

        console.log('📐 Running schema...');
        await pool.query(schemaSql);
        console.log('✅ Schema executed');

        console.log('🌱 Running seed data...');
        await pool.query(seedSql);
        console.log('✅ Seed data inserted');

        console.log('🎉 Database initialization complete');
    } catch (err) {
        console.error('❌ Initialization failed:', err.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// ▶ Run if this file is called directly
if (require.main === module) {
    initializeDatabase()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}

// Export for testing or reuse
module.exports = initializeDatabase;
