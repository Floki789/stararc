const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  // Heroku DATABASE_URL format: postgres://user:pass@host:port/database
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('DATABASE_URL environment variable is required');
    process.exit(1);
  }

  console.log('Connecting to Heroku PostgreSQL...');
  
  const pool = new Pool({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Test connection
    const client = await pool.connect();
    console.log('Successfully connected to database');
    client.release();

    // Get all .sql files from the production migrations directory
    const migrationDir = __dirname;
    const files = fs.readdirSync(migrationDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort alphabetically: 000_, 001_, 002_, etc.

    console.log(`Found ${files.length} migration files:`);
    files.forEach(file => console.log(`  - ${file}`));

    // Execute each migration
    for (const file of files) {
      console.log(`\n🔄 Executing migration: ${file}`);
      const filePath = path.join(migrationDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      try {
        await pool.query(sql);
        console.log(`✅ Successfully executed: ${file}`);
      } catch (error) {
        console.error(`❌ Error executing ${file}:`, error.message);
        throw error;
      }
    }

    console.log('\n🎉 All migrations completed successfully!');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();