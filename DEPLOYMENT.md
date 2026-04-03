# 🚀 Deployment Guide

Deploy Guild Association using GitHub + Vercel + Supabase (100% Free!)

## Architecture

- **Frontend**: Vercel (Static hosting)
- **Backend**: Vercel (Serverless functions)
- **Database**: Supabase (PostgreSQL)
- **Auth**: GitHub OAuth
- **Source**: GitHub repository

## Prerequisites

- GitHub account
- Vercel account (sign up with GitHub)
- Supabase account (sign up with GitHub)

---

## Step 1: Database Setup (Supabase)

### 1.1 Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Fill in:
   - **Name**: `guild-association`
   - **Database Password**: (generate or create strong password)
   - **Region**: Choose closest to you
6. Click "Create new project" (takes ~2 minutes)

### 1.2 Get Database Connection String

1. Go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. Copy the **URI** connection string
4. It looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your database password

### 1.3 Run Migrations (Local)

Before deploying, set up the database schema:

```bash
cd backend

# Create .env with Supabase URL
echo 'DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"' > .env

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init

# Verify in Supabase dashboard
# Go to Table Editor - you should see users, quests, submissions tables
```

---

## Step 2: GitHub Repository

### 2.1 Initialize Git

```bash
cd guild-association

git init
git add .
git commit -m "Initial commit: Guild Association MVP"
```

### 2.2 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `guild-association`
3. Public or Private (your choice)
4. **Don't** initialize with README (we already have one)
5. Click "Create repository"

### 2.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/guild-association.git
git branch -M main
git push -u origin main
```

---

## Step 3: GitHub OAuth App (Production)

### 3.1 Create Production OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: `Guild Association`
   - **Homepage URL**: `https://guild-association.vercel.app` (or your custom domain)
   - **Authorization callback URL**: `https://guild-association-api.vercel.app/auth/github/callback`
   - (Note: You'll update these URLs after Vercel deployment)
4. Click "Register application"
5. **Copy Client ID**
6. Click "Generate a new client secret"
7. **Copy Client Secret** (save both securely!)

---

## Step 4: Deploy Backend to Vercel

### 4.1 Prepare Backend for Vercel

Create `backend/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ]
}
```

Update `backend/package.json` - add vercel build script:

```json
{
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "vercel-build": "prisma generate && tsc"
  }
}
```

### 4.2 Deploy Backend

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository: `guild-association`
4. **Root Directory**: Select `backend`
5. **Framework Preset**: Other
6. Click "Deploy"

### 4.3 Configure Backend Environment Variables

In Vercel dashboard → Settings → Environment Variables, add:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
GITHUB_CALLBACK_URL=https://your-backend-url.vercel.app/auth/github/callback
SESSION_SECRET=generate_random_secret_key_here
FRONTEND_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

**Generate random SESSION_SECRET**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4.4 Redeploy Backend

After adding environment variables:
1. Go to **Deployments** tab
2. Click on latest deployment
3. Click "Redeploy"

---

## Step 5: Deploy Frontend to Vercel

### 5.1 Update Frontend API URL

Update `frontend/src/api/client.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://your-backend-url.vercel.app'
    : 'http://localhost:3001');
```

Or create `frontend/.env.production`:

```env
VITE_API_URL=https://your-backend-url.vercel.app
```

### 5.2 Deploy Frontend

1. In Vercel, click "Add New" → "Project"
2. Select same GitHub repository
3. **Root Directory**: Select `frontend`
4. **Framework Preset**: Vite
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.vercel.app
   ```
6. Click "Deploy"

---

## Step 6: Update GitHub OAuth URLs

Now that you have both URLs:

1. Go to https://github.com/settings/developers
2. Click on your OAuth App
3. Update:
   - **Homepage URL**: `https://your-frontend-url.vercel.app`
   - **Authorization callback URL**: `https://your-backend-url.vercel.app/auth/github/callback`
4. Save

---

## Step 7: Update Backend Environment Variables

In Vercel backend settings, update:

```
FRONTEND_URL=https://your-frontend-url.vercel.app
GITHUB_CALLBACK_URL=https://your-backend-url.vercel.app/auth/github/callback
```

Redeploy backend again.

---

## Step 8: Test Your Deployment

1. Visit your frontend URL: `https://your-frontend-url.vercel.app`
2. Click "Login with GitHub"
3. Authorize the app
4. Create a quest!
5. Check Supabase Table Editor to see data

---

## Custom Domains (Optional)

### Frontend Domain

1. In Vercel frontend project → Settings → Domains
2. Add your domain (e.g., `guild.yourdomain.com`)
3. Follow DNS setup instructions
4. Update `FRONTEND_URL` in backend env vars
5. Update GitHub OAuth homepage URL

### Backend Domain

1. In Vercel backend project → Settings → Domains
2. Add your domain (e.g., `api.guild.yourdomain.com`)
3. Update `VITE_API_URL` in frontend env vars
4. Update `GITHUB_CALLBACK_URL` in backend env vars
5. Update GitHub OAuth callback URL

---

## Environment Variables Summary

### Backend (Vercel)
```env
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
GITHUB_CALLBACK_URL=https://your-backend.vercel.app/auth/github/callback
SESSION_SECRET=random_secret_key
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
PORT=3001
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.vercel.app
```

---

## Troubleshooting

### "CORS Error"
- Check `FRONTEND_URL` in backend matches your frontend URL exactly
- No trailing slash

### "OAuth Error"
- Verify callback URL in GitHub OAuth app settings
- Must match `GITHUB_CALLBACK_URL` in backend env vars

### "Database Connection Error"
- Check `DATABASE_URL` in Vercel backend env vars
- Ensure Supabase project is running
- Verify password is correct (no special chars breaking the URL)

### "Session Not Persisting"
- Set `SESSION_SECRET` in backend env vars
- In production, Vercel Functions are stateless - consider Redis for sessions (optional)

### Prisma Migration Issues
```bash
# Run locally to update production DB
DATABASE_URL="your_supabase_url" npx prisma migrate deploy
```

---

## Monitoring

### Vercel
- View logs: Vercel Dashboard → Project → Deployments → View Function Logs
- Check analytics: Vercel Dashboard → Analytics

### Supabase
- Monitor database: Supabase Dashboard → Database → Query Performance
- View logs: Supabase Dashboard → Logs

---

## Continuous Deployment

Vercel automatically deploys on every push to `main`:

```bash
git add .
git commit -m "Add new feature"
git push origin main
```

Both frontend and backend will auto-deploy! 🚀

---

## Cost

- **Vercel**: Free tier (Hobby)
  - Frontend: Unlimited bandwidth
  - Backend: 100GB bandwidth, 100 hours serverless
- **Supabase**: Free tier
  - 500MB database
  - Unlimited API requests
- **GitHub**: Free (public or private repos)

**Total Cost: $0/month** for MVP! 🎉

---

## Next Steps

1. ✅ Set up monitoring and alerts
2. ✅ Add analytics (Vercel Analytics)
3. ✅ Configure custom domain
4. ✅ Set up staging environment (separate Vercel project)
5. ✅ Add environment for feature branches

---

Happy deploying! ⚔️
