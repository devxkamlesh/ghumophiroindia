# How to Run SQL Files in Supabase

## The Issue
The SQL files are created but the data is NOT in the database yet. You need to run each SQL file in Supabase SQL Editor.

---

## Step-by-Step Instructions

### Step 1: Open Supabase
1. Go to https://supabase.com/dashboard
2. Select your project: **lxvsyobuaywkwgrbqcrc**
3. Click on **SQL Editor** in the left sidebar

### Step 2: Run Files in Order

Copy and paste each file's content into the SQL Editor and click **RUN**.

#### File 1: States (if not already done)
```
Open: backend/src/core/database/seeds/001_insert_indian_states.sql
Copy all content → Paste in SQL Editor → Click RUN
```

#### File 2: Cities (if not already done)
```
Open: backend/src/core/database/seeds/002_insert_rajasthan_cities.sql
Copy all content → Paste in SQL Editor → Click RUN
```

#### File 3: Jaipur + Udaipur Part 1 (if not already done)
```
Open: backend/src/core/database/seeds/003_insert_rajasthan_places_part1.sql
Copy all content → Paste in SQL Editor → Click RUN
```

#### File 4: Udaipur + Jodhpur ⚠️ THIS ONE HAS JODHPUR
```
Open: backend/src/core/database/seeds/004_insert_rajasthan_places_part2.sql
Copy all content → Paste in SQL Editor → Click RUN
```

#### File 5: Mark Popular
```
Open: backend/src/core/database/seeds/005_mark_locations_popular.sql
Copy all content → Paste in SQL Editor → Click RUN
```

#### File 6: Jaisalmer
```
Open: backend/src/core/database/seeds/006_insert_jaisalmer_places.sql
Copy all content → Paste in SQL Editor → Click RUN
```

#### File 7: Mount Abu
```
Open: backend/src/core/database/seeds/007_insert_mount_abu_places.sql
Copy all content → Paste in SQL Editor → Click RUN
```

#### File 8: Pushkar
```
Open: backend/src/core/database/seeds/008_insert_pushkar_places.sql
Copy all content → Paste in SQL Editor → Click RUN
```

#### File 9: Bikaner
```
Open: backend/src/core/database/seeds/009_insert_bikaner_places.sql
Copy all content → Paste in SQL Editor → Click RUN
```

#### File 10: Sawai Madhopur
```
Open: backend/src/core/database/seeds/010_insert_sawai_madhopur_places.sql
Copy all content → Paste in SQL Editor → Click RUN
```

#### File 11: Chittorgarh
```
Open: backend/src/core/database/seeds/011_insert_chittorgarh_places.sql
Copy all content → Paste in SQL Editor → Click RUN
```

---

## Step 3: Verify Data

After running all files, verify the data:

```sql
-- Count by type
SELECT type, COUNT(*) as count 
FROM locations 
GROUP BY type 
ORDER BY type;

-- Expected results:
-- country: 1
-- state: 13
-- city: 8
-- place: 65

-- Check Jodhpur specifically
SELECT name, slug, type 
FROM locations 
WHERE path LIKE '%jodhpur%' 
ORDER BY name;

-- Should show:
-- Jodhpur (city)
-- Mehrangarh Fort (place)
-- Umaid Bhawan Palace (place)
-- Jaswant Thada (place)
-- Clock Tower Market (place)
-- Balsamand Lake (place)
-- Kaylana Lake (place)
```

---

## Quick Check: Which Files Have You Run?

Run this query to see what's already in your database:

```sql
SELECT 
  type,
  COUNT(*) as count,
  STRING_AGG(DISTINCT name, ', ' ORDER BY name) as examples
FROM locations 
GROUP BY type 
ORDER BY type;
```

This will show you:
- How many countries, states, cities, and places you have
- Examples of each type

---

## Troubleshooting

### Error: "parent_id not found"
**Cause**: You're trying to insert places before cities exist
**Solution**: Run files in order (001 → 002 → 003 → 004 → etc.)

### Error: "duplicate key value"
**Cause**: You've already run this file
**Solution**: Skip to the next file

### Error: "relation locations does not exist"
**Cause**: The locations table hasn't been created
**Solution**: Run migrations first:
```sql
-- Check if table exists
SELECT * FROM locations LIMIT 1;

-- If error, you need to create the table first
-- Run the migration: backend/src/core/database/migrations/003_locations.sql
```

---

## Fast Method: Run All at Once

If you want to run all files at once, you can combine them:

1. Open Supabase SQL Editor
2. Paste this query to check current state:
```sql
SELECT type, COUNT(*) FROM locations GROUP BY type;
```

3. Then run each file one by one in order

---

## Summary

**The files exist on your computer** ✅  
**The data is NOT in the database yet** ❌  
**You need to run each SQL file in Supabase** ⏳

Once you run file **004_insert_rajasthan_places_part2.sql**, Jodhpur places will appear in your database!

---

## Need Help?

If you get any errors while running the SQL files, let me know the exact error message and I'll help you fix it.
