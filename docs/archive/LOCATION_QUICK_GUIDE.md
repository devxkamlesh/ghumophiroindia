# Quick Guide: Location Data Format

## 📊 Excel/CSV Column Structure

| Column | Required | Type | Example | Notes |
|--------|----------|------|---------|-------|
| **name** | ✅ Yes | Text | Jaipur | Display name |
| **slug** | ✅ Yes | Text | jaipur | Unique, lowercase, use hyphens |
| **type** | ✅ Yes | Text | city | Must be: country, state, city, or place |
| **parent_slug** | Conditional | Text | rajasthan | Required for all except countries |
| **lat** | Optional | Decimal | 26.9124336 | Latitude (7 decimals) |
| **lng** | Optional | Decimal | 75.7872709 | Longitude (7 decimals) |
| **description** | Optional | Text | The Pink City | Brief description |
| **image** | Optional | URL | https://... | Image URL |
| **is_popular** | Optional | Boolean | true | Show on homepage (true/false) |

---

## 🏗️ Hierarchy Structure

```
Country (India)
  └── State (Rajasthan)
      └── City (Jaipur)
          └── Place (Hawa Mahal)
```

**Rules:**
- Countries have NO parent
- States must have a Country parent
- Cities must have a State parent
- Places must have a City parent

---

## 📝 Example Data Rows

### Country
```
India,india,country,,20.5937,78.9629,Incredible India,https://...,true
```

### State
```
Rajasthan,rajasthan,state,india,27.0238,74.2179,Land of Kings,https://...,true
```

### City
```
Jaipur,jaipur,city,rajasthan,26.9124336,75.7872709,The Pink City,https://...,true
```

### Place
```
Hawa Mahal,hawa-mahal,place,jaipur,26.9239,75.8267,Palace of Winds,https://...,true
```

---

## ✅ Validation Checklist

- [ ] All slugs are unique
- [ ] All slugs are lowercase with hyphens only
- [ ] Type is one of: country, state, city, place
- [ ] Countries have empty parent_slug
- [ ] All other types have valid parent_slug
- [ ] Coordinates are in decimal format
- [ ] is_popular is true or false

---

## 🚀 Files Created

1. **LOCATION_EXCEL_FORMAT.md** - Complete detailed guide
2. **location_import_template.csv** - Ready-to-use CSV template with sample data
3. **LOCATION_QUICK_GUIDE.md** - This quick reference

---

## 📥 How to Use

### Option 1: Use Admin Panel (Recommended)
1. Go to: http://187.127.151.137/dashboard/locations
2. Click "Add Location" button
3. Fill in the form
4. Toggle "Mark as Popular" if needed
5. Save

### Option 2: Bulk Import via SQL
1. Open `location_import_template.csv` in Excel
2. Add/modify your locations
3. Convert to SQL (see LOCATION_EXCEL_FORMAT.md)
4. Run SQL on your database

### Option 3: Direct CSV Import
1. Edit `location_import_template.csv`
2. Use PostgreSQL COPY command:
```sql
COPY locations(name, slug, type, parent_id, path, lat, lng, description, image, is_popular)
FROM '/path/to/file.csv'
DELIMITER ','
CSV HEADER;
```

---

## 🗺️ Finding Coordinates

**Google Maps Method:**
1. Open Google Maps
2. Search for location
3. Right-click on the exact spot
4. Click the coordinates to copy
5. Format: 26.9124336, 75.7872709

**Format:**
- First number = Latitude (North/South)
- Second number = Longitude (East/West)
- Use up to 7 decimal places

---

## 🖼️ Image URLs

**Free Sources:**
- Unsplash: https://unsplash.com/s/photos/jaipur
- Pexels: https://www.pexels.com/search/jaipur
- Pixabay: https://pixabay.com/images/search/jaipur

**Format:**
```
https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80
```

---

## 💡 Pro Tips

1. **Start with Countries** → then States → then Cities → then Places
2. **Use consistent naming**: "City Palace" not "city palace" or "CITY PALACE"
3. **Slugs must be unique**: Use "city-palace-jaipur" and "city-palace-udaipur"
4. **Mark 3-5 locations as popular** per type for best homepage display
5. **Add descriptions**: Helps with SEO and user experience
6. **Use high-quality images**: Minimum 800px width recommended

---

## 🔧 Common Issues

**Issue**: "Slug already exists"
- **Fix**: Make slug more specific (add city name)

**Issue**: "Parent not found"
- **Fix**: Create parent location first

**Issue**: "Invalid type"
- **Fix**: Use exactly: country, state, city, or place (lowercase)

**Issue**: "Invalid coordinates"
- **Fix**: Use decimal format, not degrees/minutes/seconds

---

## 📞 Need Help?

Check the detailed guide: **LOCATION_EXCEL_FORMAT.md**
