-- Database initialization script for Docker PostgreSQL
-- This runs automatically when the container is first created

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create database (if not exists)
SELECT 'CREATE DATABASE ghumo_phiro'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ghumo_phiro')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ghumo_phiro TO ghumo_user;

-- Connect to the database
\c ghumo_phiro

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO ghumo_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ghumo_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ghumo_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ghumo_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ghumo_user;

-- Log completion
SELECT 'Database initialization complete' AS status;
