import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

export const isClient = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && (req.user as any).role === 'CLIENT') {
    return next();
  }
  res.status(403).json({ error: 'Forbidden: Client access required' });
};

export const isAdventurer = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && (req.user as any).role === 'ADVENTURER') {
    return next();
  }
  res.status(403).json({ error: 'Forbidden: Adventurer access required' });
};
