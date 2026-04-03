# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Frontend (React + TypeScript)                   │
│                  Hosted on Vercel                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  - Dashboard (Quest Board)                           │   │
│  │  - Quest Detail Page                                 │   │
│  │  - User Profile                                      │   │
│  │  - Leaderboard                                       │   │
│  │  - RPG-styled UI Components                         │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ REST API
                       ▼
┌─────────────────────────────────────────────────────────────┐
│            Backend (Node.js + Express)                       │
│              Hosted on Vercel (Serverless)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes:                                             │   │
│  │  - /auth/* (GitHub OAuth)                           │   │
│  │  - /api/quests/* (Quest CRUD)                       │   │
│  │  - /api/users/* (Profile, Leaderboard)             │   │
│  │  - /api/npc/* (AI Mock)                            │   │
│  │                                                      │   │
│  │  Middleware:                                         │   │
│  │  - Passport.js (GitHub OAuth)                       │   │
│  │  - Session Management                               │   │
│  │  - Auth Guards                                      │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Prisma ORM
                       ▼
┌─────────────────────────────────────────────────────────────┐
│           Database (PostgreSQL)                              │
│              Hosted on Supabase                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Tables:                                             │   │
│  │  - users (GitHub ID, level, XP, gold, role)        │   │
│  │  - quests (title, desc, difficulty, reward, status)│   │
│  │  - submissions (PR URLs, review status)            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                       │
                       │ OAuth Flow
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    GitHub OAuth API                          │
│  - User authentication                                       │
│  - Profile data (username, avatar, email)                   │
│  - GitHub ID as unique identifier                           │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Login (GitHub OAuth)

```
User → Frontend → Backend → GitHub OAuth
                             ↓
                      User Profile Data
                             ↓
User ← Frontend ← Backend ← Database (Create/Find User)
```

### 2. Quest Creation

```
Client → Frontend → Backend API → Database
                                    ↓
                                 Insert Quest
                                    ↓
Client ← Frontend ← Backend ← Database (Return Quest)
```

### 3. Quest Lifecycle

```
1. CREATE  : Client posts quest
2. ACCEPT  : Adventurer accepts → status: IN_PROGRESS
3. SUBMIT  : Adventurer submits PR URL → submission record
4. COMPLETE: Client marks complete → award gold + XP
```

### 4. Leveling System

```
Quest Completed → Gold Awarded → XP Calculated (Gold × 10)
                                        ↓
                                  Update User XP
                                        ↓
                            Calculate Level (XP ÷ 1000)
                                        ↓
                              Update User Level if changed
```

## Tech Stack Details

### Frontend Stack
- **Framework**: React 18 (UI library)
- **Language**: TypeScript (type safety)
- **Build Tool**: Vite (fast dev server & bundler)
- **Routing**: React Router v6 (SPA navigation)
- **HTTP Client**: Axios (API calls)
- **Icons**: React Icons (UI icons)
- **Styling**: Custom CSS (RPG theme)

### Backend Stack
- **Runtime**: Node.js 18+
- **Framework**: Express (web framework)
- **Language**: TypeScript (type safety)
- **ORM**: Prisma (database toolkit)
- **Auth**: Passport.js + passport-github2
- **Session**: express-session
- **Security**: CORS, dotenv

### Database
- **Type**: PostgreSQL 14+
- **Hosting**: Supabase (managed PostgreSQL)
- **ORM**: Prisma Client
- **Migrations**: Prisma Migrate

### Deployment
- **Frontend Hosting**: Vercel (CDN + serverless)
- **Backend Hosting**: Vercel (serverless functions)
- **Database**: Supabase (cloud PostgreSQL)
- **Source Control**: GitHub
- **CI/CD**: Vercel auto-deploy on git push

## Security Features

### Authentication
- GitHub OAuth 2.0 (industry standard)
- Session-based authentication
- Secure session secrets
- HTTPS only (production)

### Authorization
- Role-based access (Client vs Adventurer)
- Middleware guards on protected routes
- Quest ownership validation
- User-specific data access

### Data Protection
- Environment variables for secrets
- CORS configuration
- Database connection pooling
- Input validation (Prisma schema)

## Performance Optimizations

### Frontend
- Code splitting (Vite)
- Lazy loading components
- Optimized bundle size
- Static asset caching

### Backend
- Serverless functions (auto-scaling)
- Database connection pooling
- Efficient Prisma queries
- Session caching

### Database
- Indexed columns (id, githubId)
- Optimized relations
- Query optimization
- Connection pooling (Supabase)

## Scaling Strategy

### Vertical Scaling (Current MVP)
- Vercel auto-scales serverless functions
- Supabase manages database resources
- No infrastructure management needed

### Horizontal Scaling (Future)
- Add Redis for session storage
- Implement caching layer
- Add CDN for static assets
- Database read replicas

## Monitoring & Observability

### Available Tools
- **Vercel Analytics**: Frontend performance
- **Vercel Logs**: Function execution logs
- **Supabase Dashboard**: Database performance
- **Supabase Logs**: Query logs and errors

### Key Metrics to Monitor
- API response times
- Database query performance
- Error rates
- User authentication success rate
- Quest completion rate

## Development Workflow

```
1. Local Development
   ├── Frontend: npm run dev (http://localhost:3000)
   ├── Backend: npm run dev (http://localhost:3001)
   └── Database: Supabase (cloud) or local PostgreSQL

2. Git Commit
   └── git push origin main

3. Automatic Deployment
   ├── Vercel detects push
   ├── Builds frontend (Vite)
   ├── Builds backend (TypeScript)
   └── Deploys to production

4. Live URLs
   ├── Frontend: https://guild-association.vercel.app
   └── Backend: https://guild-association-api.vercel.app
```

## Environment Configuration

### Development (.env)
```env
DATABASE_URL=postgresql://localhost/guild_association
GITHUB_CLIENT_ID=dev_client_id
FRONTEND_URL=http://localhost:3000
```

### Production (Vercel)
```env
DATABASE_URL=postgresql://supabase_url
GITHUB_CLIENT_ID=prod_client_id
FRONTEND_URL=https://guild-association.vercel.app
NODE_ENV=production
```

## API Design Principles

### RESTful Conventions
- GET: Retrieve resources
- POST: Create resources
- PATCH: Update resources
- DELETE: Remove resources (not implemented yet)

### Response Format
```json
{
  "data": { ... },      // Success response
  "error": "message"    // Error response
}
```

### HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Future Architecture Improvements

### Phase 1: Enhanced Features
- [ ] WebSocket for real-time updates
- [ ] Notification system
- [ ] File upload for quest attachments
- [ ] Advanced search and filtering

### Phase 2: Advanced Features
- [ ] Real AI integration (OpenAI/Anthropic)
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

### Phase 3: Scale & Performance
- [ ] Redis caching layer
- [ ] GraphQL API option
- [ ] Microservices architecture
- [ ] Multi-region deployment

---

Built with modern, scalable architecture principles ⚔️
