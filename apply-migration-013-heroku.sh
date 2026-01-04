#!/bin/bash

# ================================================
# Stararc Heroku Migration 013
# ================================================
# This script applies migration 013 to the Heroku database
# and updates the schema_migrations table.

echo "🚀 Starting Stararc Heroku Migration 013..."
echo ""

# Get Heroku app name
HEROKU_APP="stararc"

echo "📋 App: $HEROKU_APP"
echo ""

# Check if migration file exists
MIGRATION_FILE="database/migrations/013_add_asset_items_update_tracking.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Error: Migration file not found: $MIGRATION_FILE"
    exit 1
fi

echo "📄 Migration file: $MIGRATION_FILE"
echo ""

# Display migration content
echo "📖 Migration content preview:"
echo "-------------------------------------------"
head -20 "$MIGRATION_FILE"
echo "..."
echo "-------------------------------------------"
echo ""

# Ask for confirmation
read -p "⚠️  Apply this migration to $HEROKU_APP Heroku database? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Migration cancelled."
    exit 0
fi

echo ""
echo "🔄 Applying migration to Heroku..."
echo ""

# Apply migration using heroku pg:psql
heroku pg:psql --app "$HEROKU_APP" < "$MIGRATION_FILE"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration 013 applied successfully!"
    echo ""
    echo "🔍 Verifying schema_migrations..."
    heroku pg:psql --app "$HEROKU_APP" -c "SELECT version, description, applied_at FROM schema_migrations ORDER BY version DESC LIMIT 5;"
    echo ""
    echo "🔍 Verifying new columns in asset_items..."
    heroku pg:psql --app "$HEROKU_APP" -c "\d asset_items" | grep -E "(price_data_source|automatic_price_update|last_price_update|price_update_reminder|quantity_data_source|automatic_quantity_update|last_quantity_update|quantity_update_reminder)"
    echo ""
    echo "✅ Migration completed successfully!"
else
    echo ""
    echo "❌ Migration failed! Please check the error messages above."
    exit 1
fi
