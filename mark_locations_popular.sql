-- Mark existing locations as popular for home page display
-- Run this in your PostgreSQL database or pgAdmin

-- Mark all existing locations as popular
UPDATE locations SET is_popular = true WHERE slug IN ('india', 'dubai', 'rajasthan', 'jaipur');

-- Verify the changes
SELECT id, name, type, slug, is_popular 
FROM locations 
ORDER BY type, name;
