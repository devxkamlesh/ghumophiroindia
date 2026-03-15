# Deployment Guide - Ghumo Phiro India

## Pre-Deployment Checklist

- [x] Build successful (`npm run build`)
- [x] No TypeScript errors
- [x] All components working
- [x] Environment variables documented
- [x] .gitignore configured
- [x] README.md created

## Quick Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Ghumo Phiro India travel platform"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure environment variables:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
5. Click "Deploy"

## Database Setup

### Option 1: Vercel Postgres

1. In Vercel dashboard, go to Storage
2. Create new Postgres database
3. Copy connection string to `DATABASE_URL`
4. Run migrations:
   ```bash
   npm run db:push
   ```

### Option 2: External PostgreSQL

Use any PostgreSQL provider:
- Supabase
- Railway
- Neon
- AWS RDS

## Environment Variables

### Production

```env
DATABASE_URL=postgresql://user:password@host:5432/database
NEXT_PUBLIC_SITE_URL=https://ghumophiroindia.com
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
```

## Post-Deployment

1. **Test the site**: Visit your deployed URL
2. **Check all pages**: Home, Tours, Contact, etc.
3. **Test forms**: Booking, Contact, Custom Tour
4. **Mobile testing**: Check responsive design
5. **Performance**: Run Lighthouse audit

## Custom Domain

1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate (automatic)

## Monitoring

- **Vercel Analytics**: Automatic
- **Error Tracking**: Consider Sentry
- **Performance**: Vercel Speed Insights

## Backup Strategy

- Database: Daily automated backups
- Code: GitHub repository
- Environment: Document all variables

## Support

For deployment issues:
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs

---

**Your site is ready to go live! 🚀**
