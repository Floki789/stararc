#!/usr/bin/env node

/**
 * StarArc Migration Runner
 * Executes all migrations in /backend/database/migrations/production folder in order
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

class StarArcMigrationRunner {
    constructor() {
        // Database configuration for StarArc
        const poolConfig = {
            connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/stararc',
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        };
        
        this.pool = new Pool(poolConfig);
        this.migrationsPath = path.join(__dirname, 'production');
    }

    async runMigrations() {
        try {
            console.log('🚀 Starting StarArc migration process...');
            
            // Get all SQL files from production folder
            const files = fs.readdirSync(this.migrationsPath)
                .filter(file => file.endsWith('.sql'))
                .sort();

            console.log(`📁 Found ${files.length} migration files`);

            for (const file of files) {
                console.log(`⚡ Executing: ${file}`);
                
                const filePath = path.join(this.migrationsPath, file);
                const sql = fs.readFileSync(filePath, 'utf8');
                
                await this.pool.query(sql);
                console.log(`✅ Completed: ${file}`);
            }

            console.log('🎉 All StarArc migrations completed successfully!');
            
        } catch (error) {
            console.error('❌ Migration failed:', error.message);
            throw error;
        } finally {
            await this.pool.end();
        }
    }
}

// Run migrations
async function main() {
    const runner = new StarArcMigrationRunner();
    await runner.runMigrations();
}

main().catch(error => {
    console.error('❌ StarArc migration process failed:', error.message);
    process.exit(1);
});