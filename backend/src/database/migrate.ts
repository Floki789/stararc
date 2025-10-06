import { pool } from '../database/connection';
import fs from 'fs';
import path from 'path';

async function runMigrations(): Promise<void> {
  try {
    console.log('🔄 Running database migrations...');
    
    // Read the init.sql file
    const sqlPath = path.join(__dirname, '../../../database/init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL
    await pool.query(sql);
    
    console.log('✅ Database migrations completed successfully');
    
    // Verify tables were created
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📊 Created tables:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Verify subscription plans were inserted
    const plansResult = await pool.query('SELECT COUNT(*) as count FROM subscription_plans');
    console.log(`💳 Subscription plans created: ${plansResult.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migrations if called directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('🎉 Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

export { runMigrations };