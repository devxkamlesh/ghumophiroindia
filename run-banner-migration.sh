#!/bin/bash

# Load environment variables
if [ -f backend/.env ]; then
    export $(cat backend/.env | grep -v '^#' | xargs)
fi

echo "🗄️  Running banner migration..."

# Run the migration
psql "$DATABASE_URL" -f backend/src/core/database/migrations/007_banners.sql

echo "✅ Migration complete!"

# Verify the table was created
echo "📋 Checking banners table..."
psql "$DATABASE_URL" -c "\dt banners"
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM banners;"
