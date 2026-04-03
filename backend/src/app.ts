import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import passport from './config/passport';

// Routes
import authRoutes from './routes/auth';
import questRoutes from './routes/quests';
import userRoutes from './routes/users';
import npcRoutes from './routes/npc';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'guild-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/users', userRoutes);
app.use('/api/npc', npcRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Guild Association API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
