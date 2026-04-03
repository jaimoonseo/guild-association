# 🚀 Quick Start Guide

Get Guild Association running in 5 minutes!

## Prerequisites Check

```bash
node --version  # Should be 18+
npm --version
psql --version  # PostgreSQL
```

## 1. Database Setup (1 min)

```bash
# Create database
createdb guild_association

# Or using psql
psql -c "CREATE DATABASE guild_association;"
```

## 2. Backend Setup (2 min)

```bash
cd backend

# Install
npm install

# Setup environment
cp .env.example .env

# IMPORTANT: Edit .env and set:
# - DATABASE_URL (your PostgreSQL connection)
# - GITHUB_CLIENT_ID (get from GitHub OAuth)
# - GITHUB_CLIENT_SECRET (get from GitHub OAuth)
# - SESSION_SECRET (any random string)

# Initialize database
npx prisma generate
npx prisma migrate dev --name init

# Start backend
npm run dev
```

Backend running at: **http://localhost:3001** ✅

## 3. Frontend Setup (1 min)

```bash
# New terminal
cd frontend

# Install
npm install

# Start
npm run dev
```

Frontend running at: **http://localhost:3000** ✅

## 4. GitHub OAuth Setup (1 min)

1. Visit: https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill:
   - **Name**: Guild Association Local
   - **Homepage**: http://localhost:3000
   - **Callback**: http://localhost:3001/auth/github/callback
4. Copy **Client ID** and **Client Secret** to `backend/.env`
5. Restart backend: `npm run dev`

## 🎉 You're Ready!

1. Open http://localhost:3000
2. Click "Login with GitHub"
3. Post your first quest!
4. Explore the RPG-style interface

## Quick Test

### Create a Quest
```
Title: Fix typo in README
Description: Update the README.md file to fix spelling errors
Difficulty: Easy
Reward: 50 gold
```

### Accept & Complete
1. Accept the quest
2. Submit PR URL: https://github.com/user/repo/pull/1
3. Client marks as completed
4. You earn gold and XP! 🎉

## Troubleshooting

**Database Error?**
```bash
# Check PostgreSQL is running
pg_ctl status

# Reset database
npx prisma migrate reset
```

**Port Already in Use?**
```bash
# Change ports in:
# backend/.env -> PORT=3002
# frontend/vite.config.ts -> port: 3001
```

**OAuth Error?**
- Double-check callback URL
- Restart backend after updating .env
- Clear browser cookies

## Next Steps

- Read [README.md](README.md) for full documentation
- Explore the API at http://localhost:3001/health
- Check database with `npx prisma studio`

Happy questing! ⚔️
