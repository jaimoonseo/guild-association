import { Router } from 'express';
import passport from '../config/passport';
import type { Request, Response, NextFunction } from 'express';

const router = Router();

// GitHub OAuth login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth callback
router.get(
  '/github/callback',
  (req, res, next) => {
    passport.authenticate('github', (err: any, user: any, info: any) => {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

      if (err) {
        console.error('GitHub auth error:', err);
        return res.redirect(`${frontendUrl}/?error=auth_failed&message=${encodeURIComponent(err.message)}&stack=${encodeURIComponent(err.stack || '')}`);
      }
      if (!user) {
        console.error('No user returned:', info);
        return res.redirect(`${frontendUrl}/?error=no_user&message=${encodeURIComponent(JSON.stringify(info))}`);
      }
      req.logIn(user, (loginErr: any) => {
        if (loginErr) {
          console.error('Login error:', loginErr);
          return res.redirect(`${frontendUrl}/?error=login_failed&message=${encodeURIComponent(loginErr.message)}&stack=${encodeURIComponent(loginErr.stack || '')}`);
        }
        return res.redirect(frontendUrl);
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
  console.log('=== /auth/me Debug ===');
  console.log('Session ID:', req.sessionID);
  console.log('Session:', JSON.stringify(req.session));
  console.log('Cookies:', req.headers.cookie);
  console.log('Is Authenticated:', req.isAuthenticated());
  console.log('User:', req.user);
  console.log('=====================');

  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({
      error: 'Not authenticated',
      debug: {
        hasSession: !!req.session,
        sessionID: req.sessionID,
        hasCookie: !!req.headers.cookie
      }
    });
  }
});

export default router;

