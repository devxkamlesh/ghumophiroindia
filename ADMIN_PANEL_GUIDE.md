# Admin Panel Access Guide

## How to Access the Admin Panel

### Method 1: Direct URL
Simply navigate to: **`http://localhost:3000/dashboard`**

### Method 2: Via Header Navigation
1. Login with an admin account
2. Click on your user avatar in the header
3. You'll be automatically redirected to `/dashboard`

## Admin Panel Features

### 📊 Dashboard Overview (`/dashboard`)
- Total tours, bookings, inquiries statistics
- Revenue and active users count
- Recent bookings list
- Recent inquiries list

### 🎫 Tours Management (`/dashboard/tours`)
- View all tours in grid layout
- Add new tour (button ready)
- Edit existing tours
- Delete tours
- View tour details

### 📅 Bookings Management (`/dashboard/bookings`)
- View all customer bookings
- See booking status (Confirmed, Pending, Cancelled, Completed)
- View payment status
- See customer details and special requests
- Filter and manage bookings

### 📍 Destinations Management (`/dashboard/destinations`)
- Coming soon (folder created)

### 📝 Custom Requests (`/dashboard/custom-requests`)
- Coming soon (folder created)

### 💬 Inquiries (`/dashboard/inquiries`)
- Coming soon (folder created)

### 📈 Analytics (`/dashboard/analytics`)
- Coming soon (folder created)

## Admin User Requirements

To access the admin panel, the user must have:
```json
{
  "role": "admin"
}
```

The admin panel checks for this role and redirects non-admin users to the home page.

## Creating an Admin User

### Option 1: Via Backend API
Register a user and manually update their role in the database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

### Option 2: Via Registration
Modify the registration endpoint to allow admin role creation (for development only).

## Admin Panel Layout

The admin panel includes:
- **Sidebar Navigation** - Collapsible on mobile
- **User Profile** - Shows admin name and email
- **Logout Button** - At the bottom of sidebar
- **Responsive Design** - Works on all screen sizes
- **Modern UI** - Orange/pink gradient theme matching your brand

## Navigation Structure

```
/dashboard                    → Overview with stats
/dashboard/tours             → Tours management
/dashboard/bookings          → Bookings management
/dashboard/destinations      → Destinations (to be implemented)
/dashboard/custom-requests   → Custom tour requests (to be implemented)
/dashboard/inquiries         → Customer inquiries (to be implemented)
/dashboard/analytics         → Analytics dashboard (to be implemented)
```

## Security Features

1. **Role-based access** - Only users with `role: 'admin'` can access
2. **Automatic redirect** - Non-admin users are redirected to home page
3. **Protected routes** - All dashboard routes check authentication
4. **Logout functionality** - Secure logout that clears tokens

## Next Steps

To complete the admin panel:

1. **Create remaining pages:**
   - Destinations management
   - Custom requests management
   - Inquiries management
   - Analytics dashboard

2. **Add CRUD operations:**
   - Create tour form
   - Edit tour form
   - Update booking status
   - Reply to inquiries

3. **Add backend endpoints:**
   - Admin-specific API routes
   - Bulk operations
   - Export data functionality

4. **Enhance features:**
   - Search and filters
   - Pagination
   - Sorting options
   - Data export (CSV/PDF)

## Testing

1. Start your development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Navigate to `http://localhost:3000/dashboard`

3. If not logged in, you'll be redirected to `/login`

4. Login with an admin account

5. You should see the dashboard overview page

## Troubleshooting

**Issue:** Can't access dashboard
- **Solution:** Make sure you're logged in with an admin account

**Issue:** Redirected to home page
- **Solution:** Check that your user has `role: 'admin'` in localStorage

**Issue:** Sidebar not showing
- **Solution:** Check browser console for errors, ensure all components are imported correctly

**Issue:** No data showing
- **Solution:** The pages use mock data initially. Connect to your backend API to see real data.
