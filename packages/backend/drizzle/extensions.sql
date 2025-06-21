-- Enable required PostgreSQL extensions for TODO app
CREATE EXTENSION IF NOT EXISTS ltree;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Note: Indexes will be created automatically by Drizzle migrations
-- This file is run during container initialization to enable extensions
