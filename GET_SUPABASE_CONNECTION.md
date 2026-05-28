# Get Supabase Connection String

## Steps to Get the Correct Connection String

1. **Go to your Supabase project**
   - Open: https://lxvsyobuaywkwgrbqcrc.supabase.co
   - Or go to: https://app.supabase.com and select your project

2. **Navigate to Database Settings**
   - Click **"Settings"** (gear icon) in the left sidebar
   - Click **"Database"**

3. **Find Connection String Section**
   - Scroll down to **"Connection string"**
   - You'll see tabs: **URI**, **JDBC**, **Golang**, etc.

4. **Copy the Connection Pooling URI**
   - Click on **"Connection Pooling"** tab (if available)
   - Or use the **"URI"** tab
   - Copy the full string that looks like:
     ```
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
     ```

5. **Replace [YOUR-PASSWORD]**
   - Your password is: `c4&-V8mYxS$$k@R`
   - But it needs to be URL-encoded for special characters:
     - `&` becomes `%26`
     - `$` becomes `%24`
     - `@` becomes `%40`
   - So it becomes: `c4%26-V8mYxS%24%24k%40R`

6. **Update backend/.env**
   - Open `backend/.env`
   - Replace the DATABASE_URL line with your connection string
   - Example:
     ```env
     DATABASE_URL=postgresql://postgres.lxvsyobuaywkwgrbqcrc:c4%26-V8mYxS%24%24k%40R@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
     ```

## Alternative: Use Supabase Dashboard SQL Editor

If connection issues persist, you can create tables directly in Supabase:

1. Go to https://app.supabase.com
2. Select your project
3. Click **"SQL Editor"** in left sidebar
4. Click **"New query"**
5. I'll provide you the SQL to create all tables

Would you like me to generate the SQL script for you?
