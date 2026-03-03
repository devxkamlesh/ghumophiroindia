# Deployment Guide

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Domain name
- Hosting platform account (Vercel, AWS, etc.)

## Environment Variables

Create a `.env.local` file with:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
```

## Database Setup

1. Create PostgreSQL database
2. Run migrations:

```bash
npm run db:push
```

3. Seed initial data (optional):

```bash
npm run db:seed
```

## Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login and deploy:
```bash
vercel login
vercel --prod
```

3. Set environment variables in Vercel dashboard

## AWS Deployment

### Using EC2

1. Launch EC2 instance (Ubuntu 22.04)
2. Install Node.js and PostgreSQL
3. Clone repository
4. Install dependencies: `npm install`
5. Build: `npm run build`
6. Start with PM2: `pm2 start npm --name "rajasthan-tours" -- start`

### Using Elastic Beanstalk

1. Install EB CLI
2. Initialize: `eb init`
3. Create environment: `eb create production`
4. Deploy: `eb deploy`

## Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t rajasthan-tours .
docker run -p 3000:3000 rajasthan-tours
```

## Post-Deployment

1. Configure DNS records
2. Set up SSL certificate
3. Configure CDN (CloudFlare)
4. Set up monitoring
5. Configure backups
6. Test all functionality

## Performance Optimization

- Enable CDN for static assets
- Configure image optimization
- Set up database connection pooling
- Enable caching headers
- Monitor with analytics

## Monitoring

- Set up error tracking (Sentry)
- Configure uptime monitoring
- Set up performance monitoring
- Enable database monitoring
- Configure log aggregation

## Backup Strategy

- Daily database backups
- Weekly full backups
- Offsite backup storage
- Test restore procedures
