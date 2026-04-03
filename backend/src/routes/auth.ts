import { Router } from 'express';
import passport from '../config/passport';

const router = Router();

// GitHub OAuth login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth callback
router.get(
  '/github/callback',
  (req, res, next) => {
    passport.authenticate('github', (err, user, info) => {
      if (err) {
        console.error('GitHub auth error:', err);
        return res.status(500).json({ error: 'Authentication failed', message: err.message });
      }
      if (!user) {
        console.error('No user returned:', info);
        return res.status(401).json({ error: 'No user found', info });
      }
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error('Login error:', loginErr);
          return res.status(500).json({ error: 'Login failed', message: loginErr.message });
        }
        return res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
      });
    })(req, res, next);
  }
);

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Get current user
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

export default router;
