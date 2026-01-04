-- ================================================
-- Migration 013: Add Update Tracking to asset_items
-- ================================================
-- Description: Adds fields for tracking automatic vs manual updates for price and quantity
-- Author: System
-- Date: 2026-01-02

BEGIN;

SET search_path TO public;

-- ================================================
-- Add new columns for price tracking
-- ================================================

-- Price data source tracking
ALTER TABLE asset_items ADD COLUMN IF NOT EXISTS price_data_source VARCHAR(50)
    CHECK (price_data_source IN ('manual', 'eodhd', 'bank_api', 'csv_import'));

-- Automatic price update flag
ALTER TABLE asset_items ADD COLUMN IF NOT EXISTS automatic_price_update BOOLEAN DEFAULT false;

-- Last price update timestamp
ALTER TABLE asset_items ADD COLUMN IF NOT EXISTS last_price_update TIMESTAMP WITHOUT TIME ZONE;

-- Price update reminder
ALTER TABLE asset_items ADD COLUMN IF NOT EXISTS price_update_reminder VARCHAR(20) DEFAULT 'none'
    CHECK (price_update_reminder IN ('none', 'weekly', 'monthly', 'quarterly', 'yearly'));

-- ================================================
-- Add new columns for quantity tracking
-- ================================================

-- Quantity data source tracking
ALTER TABLE asset_items ADD COLUMN IF NOT EXISTS quantity_data_source VARCHAR(50) DEFAULT 'manual'
    CHECK (quantity_data_source IN ('manual', 'bank_api', 'csv_import'));

-- Automatic quantity update flag
ALTER TABLE asset_items ADD COLUMN IF NOT EXISTS automatic_quantity_update BOOLEAN DEFAULT false;

-- Last quantity update timestamp
ALTER TABLE asset_items ADD COLUMN IF NOT EXISTS last_quantity_update TIMESTAMP WITHOUT TIME ZONE;

-- Quantity update reminder
ALTER TABLE asset_items ADD COLUMN IF NOT EXISTS quantity_update_reminder VARCHAR(20) DEFAULT 'none'
    CHECK (quantity_update_reminder IN ('none', 'weekly', 'monthly', 'quarterly', 'yearly'));

-- ================================================
-- Create indexes for performance
-- ================================================

-- Index for finding items that need price updates
CREATE INDEX IF NOT EXISTS idx_asset_items_price_tracking 
    ON asset_items(automatic_price_update, last_price_update) 
    WHERE automatic_price_update = false AND price_update_reminder != 'none';

-- Index for finding items that need quantity updates
CREATE INDEX IF NOT EXISTS idx_asset_items_quantity_tracking 
    ON asset_items(automatic_quantity_update, last_quantity_update) 
    WHERE automatic_quantity_update = false AND quantity_update_reminder != 'none';

-- Index for filtering by price data source
CREATE INDEX IF NOT EXISTS idx_asset_items_price_data_source 
    ON asset_items(price_data_source);

-- Index for filtering by quantity data source
CREATE INDEX IF NOT EXISTS idx_asset_items_quantity_data_source 
    ON asset_items(quantity_data_source);

-- ================================================
-- Add comments for documentation
-- ================================================

COMMENT ON COLUMN asset_items.price_data_source IS 'Source of price data: manual, eodhd, bank_api, csv_import';
COMMENT ON COLUMN asset_items.automatic_price_update IS 'Whether price is automatically updated from external source';
COMMENT ON COLUMN asset_items.last_price_update IS 'Timestamp of last price update (manual or automatic)';
COMMENT ON COLUMN asset_items.price_update_reminder IS 'Frequency reminder for manual price updates: none, weekly, monthly, quarterly, yearly';

COMMENT ON COLUMN asset_items.quantity_data_source IS 'Source of quantity data: manual, bank_api, csv_import';
COMMENT ON COLUMN asset_items.automatic_quantity_update IS 'Whether quantity is automatically updated from external source';
COMMENT ON COLUMN asset_items.last_quantity_update IS 'Timestamp of last quantity update (manual or automatic)';
COMMENT ON COLUMN asset_items.quantity_update_reminder IS 'Frequency reminder for manual quantity updates: none, weekly, monthly, quarterly, yearly';

-- ================================================
-- Update schema_migrations table
-- ================================================

INSERT INTO schema_migrations (version, description, applied_at)
VALUES (
    13,
    'Add update tracking fields to asset_items table',
    CURRENT_TIMESTAMP
)
ON CONFLICT (version) DO NOTHING;

COMMIT;

-- ================================================
-- Rollback Instructions
-- ================================================
-- To rollback this migration, run:
-- BEGIN;
-- DELETE FROM schema_migrations WHERE version = 13;
-- DROP INDEX IF EXISTS idx_asset_items_price_tracking;
-- DROP INDEX IF EXISTS idx_asset_items_quantity_tracking;
-- DROP INDEX IF EXISTS idx_asset_items_price_data_source;
-- DROP INDEX IF EXISTS idx_asset_items_quantity_data_source;
-- ALTER TABLE asset_items DROP COLUMN IF EXISTS price_data_source;
-- ALTER TABLE asset_items DROP COLUMN IF EXISTS automatic_price_update;
-- ALTER TABLE asset_items DROP COLUMN IF EXISTS last_price_update;
-- ALTER TABLE asset_items DROP COLUMN IF EXISTS price_update_reminder;
-- ALTER TABLE asset_items DROP COLUMN IF EXISTS quantity_data_source;
-- ALTER TABLE asset_items DROP COLUMN IF EXISTS automatic_quantity_update;
-- ALTER TABLE asset_items DROP COLUMN IF EXISTS last_quantity_update;
-- ALTER TABLE asset_items DROP COLUMN IF EXISTS quantity_update_reminder;
-- COMMIT;
