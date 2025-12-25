# StarArc Database Migrations

This directory contains production-ready migrations for the StarArc database schema.

## Migration Files

### 000_create_extensions_and_functions.sql
- Creates the `uuid-ossp` PostgreSQL extension
- Creates the `update_updated_at_column()` trigger function

### 001_create_users.sql
- Creates the main `users` table with all columns and constraints
- Sets up all indexes for optimal query performance
- Creates the self-referencing foreign key for Apex manager hierarchy
- Adds the trigger for automatic timestamp updates

### 002_add_comments.sql
- Adds comprehensive documentation comments to the users table and columns
- Explains the purpose of each column, especially encrypted fields and privacy features

## Running Migrations

### Local Development
```bash
# Navigate to migrations directory
cd /Users/sam/mydata/MyApps/ArchimedesApps/stararc/backend/database/migrations

# Run all migrations
node run-migrations.js
```

### Production
Set the `DATABASE_URL` environment variable and run:
```bash
NODE_ENV=production DATABASE_URL=your_postgres_url node run-migrations.js
```

## Schema Features

The StarArc schema is designed with privacy-by-design principles:

- **Dual Encryption**: User data is encrypted both with user passwords (user-only access) and master keys (admin support access)
- **Email Hashing**: Email addresses are hashed for login lookup while maintaining privacy
- **Apex Hierarchy**: Support for Apex managers with ApexChild accounts
- **2FA Support**: Built-in two-factor authentication with backup codes
- **Spaceship Integration**: Encrypted auth keys for Spaceship app integration
- **Subscription Management**: Stripe integration for payment and subscription handling

## Database Structure

The schema consists of a single, comprehensive `users` table that handles:
- Authentication and authorization
- Subscription and billing management  
- Two-factor authentication
- Spaceship app integration
- Apex manager/child account relationships
- Privacy-compliant user data encryption