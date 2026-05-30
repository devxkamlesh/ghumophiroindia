# Database Seed Files

This folder contains SQL seed data files for populating the database with initial location data.

## Files

### 001_insert_indian_states.sql
- **Purpose**: Insert 13 Indian states into the locations table
- **Dependencies**: Requires India country to exist first
- **Run Order**: 1st

### 002_insert_rajasthan_cities.sql
- **Purpose**: Insert major Rajasthan cities (Jaipur, Udaipur, Jodhpur, Jaisalmer)
- **Dependencies**: Requires Rajasthan state to exist
- **Run Order**: 2nd

### 003_insert_rajasthan_places_part1.sql
- **Purpose**: Insert Rajasthan tourist places - Part 1 (16 places: Jaipur 10, Udaipur 6)
- **Dependencies**: Requires cities to exist
- **Run Order**: 3rd
- **Places**: Hawa Mahal, Amber Fort, City Palace Jaipur, Jantar Mantar, etc.

### 004_insert_rajasthan_places_part2.sql
- **Purpose**: Insert Rajasthan tourist places - Part 2 (8 places: Udaipur 2, Jodhpur 6)
- **Dependencies**: Requires cities to exist
- **Run Order**: 4th
- **Places**: Fateh Sagar Lake, Saheliyon Ki Bari, Mehrangarh Fort, etc.

### 005_mark_locations_popular.sql
- **Purpose**: Mark specific locations as popular for home page display
- **Dependencies**: Requires locations to exist
- **Run Order**: 5th (optional)

### 006_insert_jaisalmer_places.sql
- **Purpose**: Insert Jaisalmer tourist places (7 places)
- **Dependencies**: Requires Jaisalmer city to exist
- **Run Order**: 6th
- **Places**: Jaisalmer Fort, Sam Sand Dunes, Patwon Ki Haveli, Gadisar Lake, Kuldhara Village, Tanot Mata Temple, Longewala Border

### 007_insert_mount_abu_places.sql
- **Purpose**: Insert Mount Abu tourist places (10 places)
- **Dependencies**: Requires Mount Abu city to exist
- **Run Order**: 7th
- **Places**: Dilwara Temples, Nakki Lake, Guru Shikhar, Sunset Point, Toad Rock, Achalgarh Fort, Honeymoon Point, Arbuda Devi Temple, Mount Abu Wildlife Sanctuary, Peace Park

### 008_insert_pushkar_places.sql
- **Purpose**: Insert Pushkar tourist places (2 places)
- **Dependencies**: Requires Pushkar city to exist
- **Run Order**: 8th
- **Places**: Pushkar Lake, Brahma Temple

### 009_insert_bikaner_places.sql
- **Purpose**: Insert Bikaner tourist places (10 places)
- **Dependencies**: Requires Bikaner city to exist
- **Run Order**: 9th
- **Places**: Junagarh Fort, Karni Mata Temple, Lalgarh Palace, National Research Centre on Camel, Gajner Palace, Rampuria Haveli, Bhandasar Jain Temple, Shri Laxminath Temple, Devi Kund Sagar, Prachina Museum

### 010_insert_sawai_madhopur_places.sql
- **Purpose**: Insert Sawai Madhopur tourist places (2 places)
- **Dependencies**: Requires Sawai Madhopur city to exist
- **Run Order**: 10th
- **Places**: Ranthambore National Park, Ranthambore Fort

### 011_insert_chittorgarh_places.sql
- **Purpose**: Insert Chittorgarh tourist places (10 places)
- **Dependencies**: Requires Chittorgarh city to exist
- **Run Order**: 11th
- **Places**: Chittorgarh Fort, Vijay Stambh, Kirti Stambh, Padmini Palace, Rana Kumbha Palace, Gaumukh Reservoir, Meera Temple, Kalika Mata Temple, Fateh Prakash Palace, Sanwariyaji Temple

## How to Run

### Option 1: Supabase SQL Editor
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Run files in order (001 → 002 → 003 → 004 → 005 → 006 → 007 → 008 → 009 → 010 → 011)
4. Verify data: `SELECT * FROM locations ORDER BY type, name;`

### Option 2: Command Line (psql)
```bash
# Connect to database
psql "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# Run files in order
\i backend/src/core/database/seeds/001_insert_indian_states.sql
\i backend/src/core/database/seeds/002_insert_rajasthan_cities.sql
\i backend/src/core/database/seeds/003_insert_rajasthan_places_part1.sql
\i backend/src/core/database/seeds/004_insert_rajasthan_places_part2.sql
\i backend/src/core/database/seeds/005_mark_locations_popular.sql
\i backend/src/core/database/seeds/006_insert_jaisalmer_places.sql
\i backend/src/core/database/seeds/007_insert_mount_abu_places.sql
\i backend/src/core/database/seeds/008_insert_pushkar_places.sql
\i backend/src/core/database/seeds/009_insert_bikaner_places.sql
\i backend/src/core/database/seeds/010_insert_sawai_madhopur_places.sql
\i backend/src/core/database/seeds/011_insert_chittorgarh_places.sql
```

### Option 3: Node.js Script (Future)
```bash
npm run db:seed
```

## Data Structure

### Location Hierarchy
```
India (country)
└── Rajasthan (state)
    ├── Jaipur (city)
    │   ├── Hawa Mahal (place)
    │   ├── Amber Fort (place)
    │   └── ... (8 more places)
    ├── Udaipur (city)
    │   ├── City Palace Udaipur (place)
    │   ├── Lake Pichola (place)
    │   └── ... (6 more places)
    ├── Jodhpur (city)
    │   ├── Mehrangarh Fort (place)
    │   ├── Umaid Bhawan Palace (place)
    │   └── ... (4 more places)
    ├── Jaisalmer (city)
    │   ├── Jaisalmer Fort (place)
    │   ├── Sam Sand Dunes (place)
    │   └── ... (5 more places)
    ├── Mount Abu (city)
    │   ├── Dilwara Temples (place)
    │   ├── Nakki Lake (place)
    │   └── ... (8 more places)
    ├── Pushkar (city)
    │   ├── Pushkar Lake (place)
    │   └── Brahma Temple (place)
    ├── Bikaner (city)
    │   ├── Junagarh Fort (place)
    │   ├── Karni Mata Temple (place)
    │   └── ... (8 more places)
    ├── Sawai Madhopur (city)
    │   ├── Ranthambore National Park (place)
    │   └── Ranthambore Fort (place)
    └── Chittorgarh (city)
        ├── Chittorgarh Fort (place)
        ├── Vijay Stambh (place)
        └── ... (8 more places)
```

## Notes

- All descriptions are 150-200 words for SEO optimization
- Images use Unsplash URLs (replace with Cloudinary URLs in production)
- Coordinates (lat/lng) are accurate for each location
- `is_popular` flag controls home page display
- `path` field maintains hierarchy (e.g., "india/rajasthan/jaipur/hawa-mahal")

## Verification Queries

```sql
-- Count locations by type
SELECT type, COUNT(*) as count 
FROM locations 
GROUP BY type 
ORDER BY type;

-- View hierarchy
SELECT 
  REPEAT('  ', (LENGTH(path) - LENGTH(REPLACE(path, '/', ''))) - 1) || name as hierarchy,
  type,
  slug,
  is_popular
FROM locations 
ORDER BY path;

-- Check popular locations
SELECT name, type, slug 
FROM locations 
WHERE is_popular = true 
ORDER BY type, name;
```

## Future Seeds

Add more seed files for:
- Other Indian states (Kerala, Goa, Himachal Pradesh, etc.)
- International destinations (Dubai, Thailand, etc.)
- Tour packages
- Sample bookings (for testing)
