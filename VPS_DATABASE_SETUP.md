# VPS Database Setup Guide

Complete guide to set up PostgreSQL on your VPS (4 core, 8GB RAM).

---

## System Requirements

✅ VPS: 4 core, 8GB RAM (Perfect!)  
✅ OS: Ubuntu 20.04+ / Debian 11+ (recommended)  
✅ Root or sudo access  
✅ Port 5432 available (or custom port)

---

## Step 1: Connect to Your VPS

```bash
# SSH into your VPS
ssh root@your-vps-ip
# or
ssh username@your-vps-ip
```

---

## Step 2: Install PostgreSQL

### For Ubuntu/Debian:

```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Check PostgreSQL version
psql --version

# Check if PostgreSQL is running
sudo systemctl status postgresql
```

### For CentOS/RHEL:

```bash
# Install PostgreSQL
sudo dnf install postgresql-server postgresql-contrib -y

# Initialize database
sudo postgresql-setup --initdb

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

## Step 3: Configure PostgreSQL

### Switch to postgres user:

```bash
sudo -i -u postgres
```

### Access PostgreSQL:

```bash
psql
```

### Create Database and User:

```sql
-- Create database
CREATE DATABASE ghumophiro;

-- Create user with password
CREATE USER ghumophiro_user WITH ENCRYPTED PASSWORD 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ghumophiro TO ghumophiro_user;

-- Grant schema privileges (PostgreSQL 15+)
\c ghumophiro
GRANT ALL ON SCHEMA public TO ghumophiro_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ghumophiro_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ghumophiro_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ghumophiro_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ghumophiro_user;

-- Exit psql
\q
```

### Exit postgres user:

```bash
exit
```

---

## Step 4: Configure Remote Access (if needed)

### Edit PostgreSQL configuration:

```bash
# Find PostgreSQL version
ls /etc/postgresql/

# Edit postgresql.conf (replace 14 with your version)
sudo nano /etc/postgresql/14/main/postgresql.conf
```

**Find and modify:**
```conf
# Change from localhost to all interfaces
listen_addresses = '*'

# Optional: Change port if needed
port = 5432

# Performance tuning for 8GB RAM
shared_buffers = 2GB
effective_cache_size = 6GB
maintenance_work_mem = 512MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 10MB
min_wal_size = 1GB
max_wal_size = 4GB
max_worker_processes = 4
max_parallel_workers_per_gather = 2
max_parallel_workers = 4
max_parallel_maintenance_workers = 2
```

### Edit pg_hba.conf for authentication:

```bash
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

**Add at the end:**
```conf
# Allow connections from your app server
# Replace 0.0.0.0/0 with your app server IP for security
host    ghumophiro    ghumophiro_user    0.0.0.0/0    md5

# Or for local connections only (more secure)
host    ghumophiro    ghumophiro_user    127.0.0.1/32    md5
```

### Restart PostgreSQL:

```bash
sudo systemctl restart postgresql
```

---

## Step 5: Configure Firewall

### Using UFW (Ubuntu):

```bash
# Allow PostgreSQL port
sudo ufw allow 5432/tcp

# Or allow only from specific IP
sudo ufw allow from YOUR_APP_SERVER_IP to any port 5432

# Check status
sudo ufw status
```

### Using firewalld (CentOS):

```bash
# Allow PostgreSQL port
sudo firewall-cmd --permanent --add-port=5432/tcp
sudo firewall-cmd --reload
```

---

## Step 6: Test Connection

### From VPS (local):

```bash
psql -h localhost -U ghumophiro_user -d ghumophiro
# Enter password when prompted
```

### From your development machine:

```bash
psql -h YOUR_VPS_IP -U ghumophiro_user -d ghumophiro
```

---

## Step 7: Set Up Your Application

### Update .env.local:

```bash
# If app is on same VPS (recommended)
DATABASE_URL="postgresql://ghumophiro_user:your_secure_password_here@localhost:5432/ghumophiro"

# If app is on different server
DATABASE_URL="postgresql://ghumophiro_user:your_secure_password_here@YOUR_VPS_IP:5432/ghumophiro"
```

---

## Step 8: Install Drizzle and Push Schema

### On your development machine:

```bash
# Install Drizzle Kit
npm install -D drizzle-kit

# Generate migration
npx drizzle-kit generate:pg

# Push schema to database
npx drizzle-kit push:pg
```

---

## Step 9: Seed Database

Create `scripts/seed.ts`:

```typescript
import { db } from '@/lib/db'
import { tours, destinations, users } from '@/lib/db/schema'
import { hash } from 'bcryptjs'

async function seed() {
  console.log('🌱 Seeding database...')

  // Create admin user
  console.log('Creating admin user...')
  const hashedPassword = await hash('admin123', 10)
  const [admin] = await db.insert(users).values({
    name: 'Admin User',
    email: 'admin@ghumophiroindia.com',
    password: hashedPassword,
    role: 'admin',
    isActive: true,
    emailVerified: true,
  }).returning()
  console.log('✅ Admin user created:', admin.email)

  // Create sample user
  console.log('Creating sample user...')
  const userPassword = await hash('user123', 10)
  const [user] = await db.insert(users).values({
    name: 'John Doe',
    email: 'user@example.com',
    password: userPassword,
    role: 'user',
    phone: '+919876543210',
    country: 'India',
    isActive: true,
  }).returning()
  console.log('✅ Sample user created:', user.email)

  // Create destinations
  console.log('Creating destinations...')
  const destinationData = [
    {
      name: 'Delhi',
      slug: 'delhi',
      subtitle: 'The Capital City',
      description: 'Experience the vibrant capital of India with its rich history and modern charm.',
      image: '/images/destinations/delhi.jpg',
      tourCount: 0,
      isPopular: true,
    },
    {
      name: 'Agra',
      slug: 'agra',
      subtitle: 'City of Taj Mahal',
      description: 'Home to the magnificent Taj Mahal, one of the Seven Wonders of the World.',
      image: '/images/destinations/agra.jpg',
      tourCount: 0,
      isPopular: true,
    },
    {
      name: 'Jaipur',
      slug: 'jaipur',
      subtitle: 'The Pink City',
      description: 'Explore the royal heritage and stunning palaces of Rajasthan.',
      image: '/images/destinations/jaipur.jpg',
      tourCount: 0,
      isPopular: true,
    },
    {
      name: 'Goa',
      slug: 'goa',
      subtitle: 'Beach Paradise',
      description: 'Relax on pristine beaches and enjoy the vibrant nightlife.',
      image: '/images/destinations/goa.jpg',
      tourCount: 0,
      isPopular: true,
    },
    {
      name: 'Kerala',
      slug: 'kerala',
      subtitle: 'God\'s Own Country',
      description: 'Experience the backwaters, tea plantations, and natural beauty.',
      image: '/images/destinations/kerala.jpg',
      tourCount: 0,
      isPopular: true,
    },
  ]

  await db.insert(destinations).values(destinationData)
  console.log('✅ Destinations created:', destinationData.length)

  // Create sample tours
  console.log('Creating sample tours...')
  const tourData = [
    {
      title: 'Golden Triangle Tour',
      slug: 'golden-triangle-tour',
      description: 'Visit Delhi, Agra, and Jaipur - the three most iconic cities of North India',
      longDescription: 'Experience the best of North India with our Golden Triangle Tour. Visit the bustling capital Delhi, witness the magnificent Taj Mahal in Agra, and explore the royal palaces of Jaipur. This tour offers a perfect blend of history, culture, and architecture.',
      duration: 7,
      price: '1500.00',
      maxGroupSize: 15,
      difficulty: 'easy',
      category: 'heritage',
      images: ['/images/tours/golden-triangle.jpg'],
      highlights: [
        'Visit the iconic Taj Mahal',
        'Explore Red Fort and Qutub Minar in Delhi',
        'Discover Amber Fort and City Palace in Jaipur',
        'Experience local markets and cuisine',
        'Professional English-speaking guide',
      ],
      included: [
        'Accommodation in 4-star hotels',
        'Daily breakfast and dinner',
        'Air-conditioned transportation',
        'All monument entrance fees',
        'Professional tour guide',
      ],
      excluded: [
        'International flights',
        'Lunch and drinks',
        'Personal expenses',
        'Travel insurance',
        'Tips and gratuities',
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Delhi',
          description: 'Welcome to India! Arrive in Delhi and transfer to your hotel.',
          activities: ['Airport pickup', 'Hotel check-in', 'Welcome dinner', 'Tour briefing'],
        },
        {
          day: 2,
          title: 'Delhi Sightseeing',
          description: 'Full day exploring Old and New Delhi.',
          activities: ['Red Fort', 'Jama Masjid', 'Raj Ghat', 'India Gate', 'Qutub Minar'],
        },
        {
          day: 3,
          title: 'Delhi to Agra',
          description: 'Drive to Agra and visit the Taj Mahal at sunset.',
          activities: ['Drive to Agra (4 hours)', 'Taj Mahal visit', 'Agra Fort', 'Mehtab Bagh'],
        },
        {
          day: 4,
          title: 'Agra to Jaipur',
          description: 'Visit Fatehpur Sikri en route to Jaipur.',
          activities: ['Fatehpur Sikri', 'Drive to Jaipur', 'Evening at leisure'],
        },
        {
          day: 5,
          title: 'Jaipur Sightseeing',
          description: 'Explore the Pink City of Jaipur.',
          activities: ['Amber Fort', 'City Palace', 'Jantar Mantar', 'Hawa Mahal', 'Local markets'],
        },
        {
          day: 6,
          title: 'Jaipur to Delhi',
          description: 'Return to Delhi with stops at local attractions.',
          activities: ['Drive to Delhi', 'Shopping time', 'Farewell dinner'],
        },
        {
          day: 7,
          title: 'Departure',
          description: 'Transfer to airport for your onward journey.',
          activities: ['Hotel checkout', 'Airport transfer', 'Departure'],
        },
      ],
      destinations: ['Delhi', 'Agra', 'Jaipur'],
      rating: '4.8',
      reviewCount: 120,
      isActive: true,
      isFeatured: true,
    },
    {
      title: 'Goa Beach Escape',
      slug: 'goa-beach-escape',
      description: 'Relax on pristine beaches and enjoy water sports in Goa',
      longDescription: 'Escape to the tropical paradise of Goa. Enjoy sun-kissed beaches, water sports, vibrant nightlife, and Portuguese heritage. Perfect for beach lovers and adventure seekers.',
      duration: 5,
      price: '800.00',
      maxGroupSize: 20,
      difficulty: 'easy',
      category: 'beach',
      images: ['/images/tours/goa-beach.jpg'],
      highlights: [
        'Pristine beaches of North and South Goa',
        'Water sports activities',
        'Beach parties and nightlife',
        'Portuguese heritage sites',
        'Seafood dining experiences',
      ],
      included: [
        'Beach resort accommodation',
        'Daily breakfast',
        'Airport transfers',
        'Water sports package',
        'Beach party access',
      ],
      excluded: [
        'Flights',
        'Lunch and dinner',
        'Alcohol and beverages',
        'Personal expenses',
        'Additional activities',
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Goa',
          description: 'Arrive and check into your beach resort.',
          activities: ['Airport pickup', 'Resort check-in', 'Beach walk', 'Welcome drink'],
        },
        {
          day: 2,
          title: 'North Goa Beaches',
          description: 'Explore the famous beaches of North Goa.',
          activities: ['Calangute Beach', 'Baga Beach', 'Anjuna Beach', 'Beach shacks', 'Sunset viewing'],
        },
        {
          day: 3,
          title: 'Water Sports Day',
          description: 'Enjoy thrilling water sports activities.',
          activities: ['Parasailing', 'Jet skiing', 'Banana boat ride', 'Snorkeling', 'Beach relaxation'],
        },
        {
          day: 4,
          title: 'South Goa & Heritage',
          description: 'Discover South Goa beaches and Portuguese heritage.',
          activities: ['Palolem Beach', 'Old Goa churches', 'Spice plantation', 'Local markets'],
        },
        {
          day: 5,
          title: 'Departure',
          description: 'Last beach morning and departure.',
          activities: ['Beach time', 'Resort checkout', 'Airport transfer'],
        },
      ],
      destinations: ['Goa'],
      rating: '4.6',
      reviewCount: 85,
      isActive: true,
      isFeatured: true,
    },
    {
      title: 'Kerala Backwaters Experience',
      slug: 'kerala-backwaters',
      description: 'Cruise through serene backwaters and explore tea plantations',
      longDescription: 'Discover God\'s Own Country with our Kerala tour. Cruise through tranquil backwaters on a traditional houseboat, visit lush tea plantations, and experience the natural beauty of Kerala.',
      duration: 6,
      price: '1200.00',
      maxGroupSize: 12,
      difficulty: 'easy',
      category: 'nature',
      images: ['/images/tours/kerala-backwaters.jpg'],
      highlights: [
        'Houseboat cruise in Alleppey backwaters',
        'Tea plantation visit in Munnar',
        'Kathakali dance performance',
        'Ayurvedic spa treatment',
        'Wildlife sanctuary visit',
      ],
      included: [
        'Accommodation in resorts and houseboat',
        'All meals during houseboat stay',
        'Daily breakfast at hotels',
        'All transfers and sightseeing',
        'Ayurvedic massage session',
      ],
      excluded: [
        'Flights',
        'Lunch and dinner (except houseboat)',
        'Personal expenses',
        'Camera fees at monuments',
        'Tips',
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Kochi',
          description: 'Arrive in Kochi and explore the historic port city.',
          activities: ['Airport pickup', 'Fort Kochi walk', 'Chinese fishing nets', 'Kathakali show'],
        },
        {
          day: 2,
          title: 'Kochi to Munnar',
          description: 'Drive to the hill station of Munnar.',
          activities: ['Scenic drive', 'Waterfalls', 'Tea plantations', 'Munnar town'],
        },
        {
          day: 3,
          title: 'Munnar Exploration',
          description: 'Explore tea gardens and viewpoints.',
          activities: ['Tea factory visit', 'Echo Point', 'Mattupetty Dam', 'Eravikulam National Park'],
        },
        {
          day: 4,
          title: 'Munnar to Alleppey',
          description: 'Drive to Alleppey and board houseboat.',
          activities: ['Drive to Alleppey', 'Houseboat check-in', 'Backwater cruise', 'Village visits'],
        },
        {
          day: 5,
          title: 'Houseboat Experience',
          description: 'Full day cruising through backwaters.',
          activities: ['Backwater cruise', 'Local life observation', 'Traditional Kerala meals', 'Sunset viewing'],
        },
        {
          day: 6,
          title: 'Departure',
          description: 'Disembark and transfer to airport.',
          activities: ['Houseboat checkout', 'Drive to Kochi', 'Airport transfer'],
        },
      ],
      destinations: ['Kerala'],
      rating: '4.9',
      reviewCount: 95,
      isActive: true,
      isFeatured: true,
    },
  ]

  await db.insert(tours).values(tourData)
  console.log('✅ Sample tours created:', tourData.length)

  console.log('\n🎉 Database seeded successfully!')
  console.log('\n📝 Login credentials:')
  console.log('Admin: admin@ghumophiroindia.com / admin123')
  console.log('User: user@example.com / user123')
}

seed()
  .catch((error) => {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
```

### Run the seed script:

```bash
# Add script to package.json
npm pkg set scripts.seed="tsx scripts/seed.ts"

# Install tsx if not already installed
npm install -D tsx

# Run seed
npm run seed
```

---

## Step 10: Set Up Backups

### Create backup script:

```bash
sudo nano /usr/local/bin/backup-postgres.sh
```

**Add:**
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="ghumophiro"

mkdir -p $BACKUP_DIR

# Create backup
pg_dump -U ghumophiro_user $DB_NAME | gzip > $BACKUP_DIR/ghumophiro_$DATE.sql.gz

# Keep only last 7 days of backups
find $BACKUP_DIR -name "ghumophiro_*.sql.gz" -mtime +7 -delete

echo "Backup completed: ghumophiro_$DATE.sql.gz"
```

### Make executable:

```bash
sudo chmod +x /usr/local/bin/backup-postgres.sh
```

### Set up cron job (daily backup at 2 AM):

```bash
sudo crontab -e
```

**Add:**
```cron
0 2 * * * /usr/local/bin/backup-postgres.sh
```

---

## Step 11: Security Hardening

### 1. Change default port (optional):

```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
```

Change `port = 5432` to `port = 5433` (or any other port)

### 2. Limit connections:

```sql
-- Connect as postgres user
sudo -u postgres psql

-- Set connection limit
ALTER USER ghumophiro_user CONNECTION LIMIT 20;
```

### 3. Enable SSL (recommended for production):

```bash
# Generate SSL certificate
sudo openssl req -new -x509 -days 365 -nodes -text -out /etc/postgresql/14/main/server.crt -keyout /etc/postgresql/14/main/server.key

# Set permissions
sudo chmod 600 /etc/postgresql/14/main/server.key
sudo chown postgres:postgres /etc/postgresql/14/main/server.*

# Enable SSL in postgresql.conf
sudo nano /etc/postgresql/14/main/postgresql.conf
```

**Add:**
```conf
ssl = on
ssl_cert_file = '/etc/postgresql/14/main/server.crt'
ssl_key_file = '/etc/postgresql/14/main/server.key'
```

### 4. Restart PostgreSQL:

```bash
sudo systemctl restart postgresql
```

---

## Step 12: Monitoring

### Install pg_stat_statements:

```sql
-- Connect as postgres
sudo -u postgres psql -d ghumophiro

-- Enable extension
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

### Check database size:

```sql
SELECT pg_size_pretty(pg_database_size('ghumophiro'));
```

### Check active connections:

```sql
SELECT count(*) FROM pg_stat_activity WHERE datname = 'ghumophiro';
```

---

## Troubleshooting

### Can't connect to database:

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# Test connection
psql -h localhost -U ghumophiro_user -d ghumophiro
```

### Permission denied:

```sql
-- Grant all privileges again
sudo -u postgres psql
\c ghumophiro
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ghumophiro_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ghumophiro_user;
```

### Out of memory:

```bash
# Check memory usage
free -h

# Adjust PostgreSQL settings in postgresql.conf
sudo nano /etc/postgresql/14/main/postgresql.conf
```

---

## Performance Optimization

### For 8GB RAM VPS:

```conf
# /etc/postgresql/14/main/postgresql.conf

# Memory
shared_buffers = 2GB
effective_cache_size = 6GB
maintenance_work_mem = 512MB
work_mem = 10MB

# Checkpoints
checkpoint_completion_target = 0.9
wal_buffers = 16MB

# Query Planning
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200

# WAL
min_wal_size = 1GB
max_wal_size = 4GB

# Workers
max_worker_processes = 4
max_parallel_workers_per_gather = 2
max_parallel_workers = 4
max_parallel_maintenance_workers = 2
```

---

## Quick Reference

### Common Commands:

```bash
# Start PostgreSQL
sudo systemctl start postgresql

# Stop PostgreSQL
sudo systemctl stop postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check status
sudo systemctl status postgresql

# Connect to database
psql -h localhost -U ghumophiro_user -d ghumophiro

# Create backup
pg_dump -U ghumophiro_user ghumophiro > backup.sql

# Restore backup
psql -U ghumophiro_user ghumophiro < backup.sql
```

---

## Next Steps

1. ✅ PostgreSQL installed and configured
2. ✅ Database and user created
3. ✅ Schema pushed with Drizzle
4. ✅ Database seeded with sample data
5. ✅ Backups configured
6. ✅ Security hardened

**Your database is ready! 🎉**

Connection string:
```
postgresql://ghumophiro_user:your_password@localhost:5432/ghumophiro
```

---

**Last Updated:** March 18, 2026  
**For VPS:** 4 core, 8GB RAM
