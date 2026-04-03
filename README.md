# 🏰 Guild Association

A developer quest platform with RPG-style UI where clients post coding tasks (quests) and developers (adventurers) solve them for rewards and glory!

## ✨ Features

- **Quest System**: Create, accept, submit, and complete coding quests
- **RPG Elements**: Levels, XP, gold rewards, difficulty ratings (⭐⭐⭐)
- **GitHub Integration**: OAuth authentication and GitHub issue/PR linking
- **Leaderboard**: Compete with other developers
- **Role System**: Client (quest requester) or Adventurer (developer)
- **Mock NPC AI**: Get quest advice and suggestions

## 🛠️ Tech Stack

### Backend
- **Framework**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Passport.js with GitHub OAuth
- **API**: RESTful endpoints

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Custom CSS with RPG theme
- **Icons**: React Icons

## 📋 Prerequisites

### Option 1: Local Development
- Node.js 18+ and npm
- PostgreSQL 14+ (local installation)
- GitHub account (for OAuth)

### Option 2: Cloud Development (Recommended) ☁️
- Node.js 18+ and npm
- [Supabase](https://supabase.com) account (free PostgreSQL hosting)
- [Vercel](https://vercel.com) account (free deployment)
- GitHub account (for OAuth and repository)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd guild-association
```

### 2. Database Setup

**Option A: Local PostgreSQL**

```bash
createdb guild_association
```

**Option B: Supabase (Recommended)** ☁️

1. Go to https://supabase.com and create account
2. Create new project: `guild-association`
3. Copy connection string from Settings → Database
4. Use in `DATABASE_URL` (next step)

```env
DATABASE_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres"
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/guild_association?schema=public"
PORT=3001
NODE_ENV=development

# GitHub OAuth (create at https://github.com/settings/developers)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3001/auth/github/callback

SESSION_SECRET=your_random_secret_key
FRONTEND_URL=http://localhost:3000
```

Run database migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Start the backend:

```bash
npm run dev
```

Backend will run on **http://localhost:3001**

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on **http://localhost:3000**

### 5. GitHub OAuth Setup

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - Application name: `Guild Association`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3001/auth/github/callback`
4. Copy Client ID and Client Secret to backend `.env`

## 📁 Project Structure

```
guild-association/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts     # Prisma client
│   │   │   └── passport.ts     # GitHub OAuth config
│   │   ├── middleware/
│   │   │   └── auth.ts         # Auth middleware
│   │   ├── routes/
│   │   │   ├── auth.ts         # Authentication endpoints
│   │   │   ├── quests.ts       # Quest CRUD operations
│   │   │   ├── users.ts        # User profiles & leaderboard
│   │   │   └── npc.ts          # Mock AI endpoints
│   │   └── index.ts            # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── api/                # API client functions
    │   ├── components/         # React components
    │   ├── pages/              # Page components
    │   ├── styles/             # CSS stylesheets
    │   ├── types/              # TypeScript types
    │   ├── App.tsx             # Main app component
    │   └── main.tsx            # Entry point
    ├── package.json
    └── vite.config.ts
```

## 🎮 Usage

### As a Client (Quest Requester)

1. Login with GitHub
2. Click "Post New Quest"
3. Fill in quest details (title, description, difficulty, reward)
4. Optionally link a GitHub issue
5. Wait for an adventurer to accept
6. Review submission and mark as completed

### As an Adventurer (Developer)

1. Login with GitHub
2. Browse available quests on the quest board
3. Accept a quest
4. Submit your GitHub PR link
5. Earn gold and XP when completed!
6. Level up and climb the leaderboard

## 🔌 API Endpoints

### Authentication
- `GET /auth/github` - Initiate GitHub OAuth
- `GET /auth/github/callback` - OAuth callback
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user

### Quests
- `GET /api/quests` - Get all quests (filter by status, difficulty)
- `GET /api/quests/:id` - Get quest details
- `POST /api/quests` - Create new quest
- `POST /api/quests/:id/accept` - Accept quest
- `POST /api/quests/:id/submit` - Submit solution
- `POST /api/quests/:id/complete` - Mark as completed

### Users
- `GET /api/users/:id` - Get user profile
- `PATCH /api/users/me/role` - Update user role
- `GET /api/users/leaderboard/top` - Get top 10 users

### NPC (Mock AI)
- `POST /api/npc/advice` - Get quest advice
- `GET /api/npc/suggest-quest` - Get quest suggestion

## 🎨 RPG UI Elements

- **Quest Cards**: Color-coded by status (open, in progress, completed)
- **Difficulty Stars**: ⭐ (Easy), ⭐⭐ (Medium), ⭐⭐⭐ (Hard)
- **Gold Rewards**: 🪙 Currency for completed quests
- **Level & XP System**: Gain XP, level up (1000 XP per level)
- **Leaderboard**: Rankings with medals 🥇🥈🥉
- **Character Stats**: Level, Gold, Completed Quests
- **XP Progress Bar**: Visual level progression

## 🔮 Future Enhancements

- [ ] Replace mock NPC with real AI agent (GPT/Claude)
- [ ] Quest categories and tags
- [ ] Quest comments and discussions
- [ ] Notifications system
- [ ] Quest deadlines
- [ ] Team quests (multiple adventurers)
- [ ] Badges and achievements
- [ ] Quest templates
- [ ] GitHub webhooks for automatic PR verification
- [ ] Quest recommendations based on skills

## 🚀 Deployment to Production

For complete deployment guide to **Vercel + Supabase**, see [DEPLOYMENT.md](DEPLOYMENT.md)

Quick summary:
1. **Database**: Create Supabase project (free)
2. **Code**: Push to GitHub
3. **Backend**: Deploy to Vercel (auto-deploy from GitHub)
4. **Frontend**: Deploy to Vercel (auto-deploy from GitHub)
5. **OAuth**: Update GitHub OAuth callback URLs

Total cost: **$0/month** on free tiers! 🎉

## 🐛 Troubleshooting

### Database connection error
- **Local**: Ensure PostgreSQL is running
- **Supabase**: Check connection string and password
- Run `npx prisma generate` and `npx prisma migrate dev`

### OAuth error
- Verify GitHub OAuth app settings
- Check callback URL matches exactly
- Ensure GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are correct

### CORS error
- Ensure FRONTEND_URL in backend `.env` matches frontend URL
- Check that backend and frontend are both running

## 📝 License

MIT

## 👥 Contributing

Contributions welcome! Please open an issue or submit a PR.

---

Built with ⚔️ by senior full-stack engineers
