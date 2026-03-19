# Location Data Excel Format Guide

## Database Table Structure

### Locations Table Columns

| Column Name | Data Type | Required | Description | Example |
|------------|-----------|----------|-------------|---------|
| id | INTEGER | Auto | Primary key (auto-generated) | 1 |
| name | TEXT | ✅ Yes | Location name | Jaipur |
| slug | TEXT | ✅ Yes | URL-friendly identifier (unique) | jaipur |
| type | TEXT | ✅ Yes | Location type: `country`, `state`, `city`, `place` | city |
| parent_id | INTEGER | Conditional | ID of parent location (NULL for countries) | 2 |
| path | TEXT | Auto | Hierarchical path (auto-generated) | india/rajasthan/jaipur |
| lat | DECIMAL | Optional | Latitude (7 decimal places) | 26.9124336 |
| lng | DECIMAL | Optional | Longitude (7 decimal places) | 75.7872709 |
| description | TEXT | Optional | Brief description | The Pink City of India |
| image | TEXT | Optional | Image URL | https://example.com/jaipur.jpg |
| is_active | BOOLEAN | Auto | Active status (default: true) | true |
| is_popular | BOOLEAN | Auto | Show on homepage (default: false) | true |
| created_at | TIMESTAMP | Auto | Creation timestamp (auto-generated) | 2024-01-15 10:30:00 |

---

## Excel Template for Bulk Import

### Sheet 1: Countries

| name | slug | type | lat | lng | description | image | is_popular |
|------|------|------|-----|-----|-------------|-------|------------|
| India | india | country | 20.5937 | 78.9629 | Incredible India - Land of diversity | https://images.unsplash.com/photo-1524492412937-b28074a5d7da | true |
| UAE | uae | country | 23.4241 | 53.8478 | United Arab Emirates | https://images.unsplash.com/photo-1512453979798-5ea266f8880c | true |

### Sheet 2: States (parent_name = Country name)

| name | slug | type | parent_name | lat | lng | description | image | is_popular |
|------|------|------|-------------|-----|-----|-------------|-------|------------|
| Rajasthan | rajasthan | state | India | 27.0238 | 74.2179 | Land of Kings | https://images.unsplash.com/photo-1477587458883-47145ed94245 | true |
| Kerala | kerala | state | India | 10.8505 | 76.2711 | God's Own Country | https://images.unsplash.com/photo-1602216056096-3b40cc0c9944 | true |
| Gujarat | gujarat | state | India | 22.2587 | 71.1924 | Vibrant Gujarat | https://images.unsplash.com/photo-1609137144813-7d9921338f24 | false |
| Dubai | dubai | state | UAE | 25.2048 | 55.2708 | City of Gold | https://images.unsplash.com/photo-1512453979798-5ea266f8880c | true |

### Sheet 3: Cities (parent_name = State name)

| name | slug | type | parent_name | lat | lng | description | image | is_popular |
|------|------|------|-------------|-----|-----|-------------|-------|------------|
| Jaipur | jaipur | city | Rajasthan | 26.9124336 | 75.7872709 | The Pink City | https://images.unsplash.com/photo-1599661046289-e31897846e41 | true |
| Udaipur | udaipur | city | Rajasthan | 24.5854 | 73.7125 | City of Lakes | https://images.unsplash.com/photo-1587474260584-136574528ed5 | true |
| Jodhpur | jodhpur | city | Rajasthan | 26.2389 | 73.0243 | The Blue City | https://images.unsplash.com/photo-1609137144813-7d9921338f24 | true |
| Jaisalmer | jaisalmer | city | Rajasthan | 26.9157 | 70.9083 | The Golden City | https://images.unsplash.com/photo-1477587458883-47145ed94245 | true |
| Kochi | kochi | city | Kerala | 9.9312 | 76.2673 | Queen of Arabian Sea | https://images.unsplash.com/photo-1602216056096-3b40cc0c9944 | false |

### Sheet 4: Places (parent_name = City name)

| name | slug | type | parent_name | lat | lng | description | image | is_popular |
|------|------|------|-------------|-----|-----|-------------|-------|------------|
| Hawa Mahal | hawa-mahal | place | Jaipur | 26.9239 | 75.8267 | Palace of Winds | https://images.unsplash.com/photo-1599661046289-e31897846e41 | true |
| Amber Fort | amber-fort | place | Jaipur | 26.9855 | 75.8513 | Historic fort palace | https://images.unsplash.com/photo-1609137144813-7d9921338f24 | true |
| City Palace | city-palace-udaipur | place | Udaipur | 24.5761 | 73.6833 | Royal palace complex | https://images.unsplash.com/photo-1587474260584-136574528ed5 | false |
| Lake Pichola | lake-pichola | place | Udaipur | 24.5761 | 73.6833 | Artificial lake | https://images.unsplash.com/photo-1602216056096-3b40cc0c9944 | true |
| Mehrangarh Fort | mehrangarh-fort | place | Jodhpur | 26.2985 | 73.0187 | Historic fort | https://images.unsplash.com/photo-1477587458883-47145ed94245 | true |

---

## Important Rules

### 1. **Hierarchy Rules**
- **Countries**: No parent (parent_id = NULL)
- **States**: Must have a country as parent
- **Cities**: Must have a state as parent
- **Places**: Must have a city as parent

### 2. **Slug Rules**
- Must be unique across ALL locations
- Use lowercase letters, numbers, and hyphens only
- No spaces or special characters
- Example: "Hawa Mahal" → "hawa-mahal"

### 3. **Type Values** (case-sensitive)
- `country`
- `state`
- `city`
- `place`

### 4. **Coordinates**
- Use decimal format (not degrees/minutes/seconds)
- Latitude: -90 to 90
- Longitude: -180 to 180
- Up to 7 decimal places for precision

### 5. **Boolean Values**
- Use: `true` or `false` (lowercase)
- Or: `1` or `0`
- Or: `TRUE` or `FALSE` (Excel format)

---

## SQL Import Script Template

Once you have your Excel data, you can convert it to SQL:

```sql
-- 1. Insert Countries
INSERT INTO locations (name, slug, type, parent_id, path, lat, lng, description, image, is_popular)
VALUES 
('India', 'india', 'country', NULL, 'india', '20.5937', '78.9629', 'Incredible India - Land of diversity', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da', true),
('UAE', 'uae', 'country', NULL, 'uae', '23.4241', '53.8478', 'United Arab Emirates', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c', true);

-- 2. Insert States (get parent_id from countries)
INSERT INTO locations (name, slug, type, parent_id, path, lat, lng, description, image, is_popular)
VALUES 
('Rajasthan', 'rajasthan', 'state', (SELECT id FROM locations WHERE slug='india'), 'india/rajasthan', '27.0238', '74.2179', 'Land of Kings', 'https://images.unsplash.com/photo-1477587458883-47145ed94245', true),
('Kerala', 'kerala', 'state', (SELECT id FROM locations WHERE slug='india'), 'india/kerala', '10.8505', '76.2711', 'God''s Own Country', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944', true);

-- 3. Insert Cities (get parent_id from states)
INSERT INTO locations (name, slug, type, parent_id, path, lat, lng, description, image, is_popular)
VALUES 
('Jaipur', 'jaipur', 'city', (SELECT id FROM locations WHERE slug='rajasthan'), 'india/rajasthan/jaipur', '26.9124336', '75.7872709', 'The Pink City', 'https://images.unsplash.com/photo-1599661046289-e31897846e41', true),
('Udaipur', 'udaipur', 'city', (SELECT id FROM locations WHERE slug='rajasthan'), 'india/rajasthan/udaipur', '24.5854', '73.7125', 'City of Lakes', 'https://images.unsplash.com/photo-1587474260584-136574528ed5', true);

-- 4. Insert Places (get parent_id from cities)
INSERT INTO locations (name, slug, type, parent_id, path, lat, lng, description, image, is_popular)
VALUES 
('Hawa Mahal', 'hawa-mahal', 'place', (SELECT id FROM locations WHERE slug='jaipur'), 'india/rajasthan/jaipur/hawa-mahal', '26.9239', '75.8267', 'Palace of Winds', 'https://images.unsplash.com/photo-1599661046289-e31897846e41', true),
('Amber Fort', 'amber-fort', 'place', (SELECT id FROM locations WHERE slug='jaipur'), 'india/rajasthan/jaipur/amber-fort', '26.9855', '75.8513', 'Historic fort palace', 'https://images.unsplash.com/photo-1609137144813-7d9921338f24', true);
```

---

## Quick Reference: Popular Rajasthan Locations

### Cities
| City | Slug | Lat | Lng |
|------|------|-----|-----|
| Jaipur | jaipur | 26.9124336 | 75.7872709 |
| Udaipur | udaipur | 24.5854 | 73.7125 |
| Jodhpur | jodhpur | 26.2389 | 73.0243 |
| Jaisalmer | jaisalmer | 26.9157 | 70.9083 |
| Bikaner | bikaner | 28.0229 | 73.3119 |
| Pushkar | pushkar | 26.4899 | 74.5511 |
| Mount Abu | mount-abu | 24.5926 | 72.7156 |
| Ajmer | ajmer | 26.4499 | 74.6399 |

### Famous Places in Jaipur
| Place | Slug | Lat | Lng |
|-------|------|-----|-----|
| Hawa Mahal | hawa-mahal | 26.9239 | 75.8267 |
| Amber Fort | amber-fort | 26.9855 | 75.8513 |
| City Palace | city-palace-jaipur | 26.9255 | 75.8237 |
| Jantar Mantar | jantar-mantar-jaipur | 26.9247 | 75.8249 |
| Jal Mahal | jal-mahal | 26.9530 | 75.8458 |
| Nahargarh Fort | nahargarh-fort | 26.9368 | 75.8155 |

---

## Tips for Finding Coordinates

1. **Google Maps**: Right-click on location → Click coordinates to copy
2. **Format**: Use decimal format (26.9124336, 75.7872709)
3. **Precision**: 7 decimal places = ~1cm accuracy
4. **Validation**: Latitude must be between -90 and 90, Longitude between -180 and 180

---

## Image URL Sources

### Free Stock Photos
- **Unsplash**: https://unsplash.com/s/photos/[location-name]
- **Pexels**: https://www.pexels.com/search/[location-name]
- **Pixabay**: https://pixabay.com/images/search/[location-name]

### Example Unsplash URLs
```
https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80
https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80
https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=80
```

---

## Next Steps

1. **Create Excel file** with 4 sheets (Countries, States, Cities, Places)
2. **Fill in data** following the format above
3. **Convert to SQL** using the template
4. **Run SQL** on your PostgreSQL database
5. **Mark as popular** from admin panel or via SQL:
   ```sql
   UPDATE locations SET is_popular = true WHERE slug IN ('jaipur', 'udaipur', 'jodhpur');
   ```
