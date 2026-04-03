import { Router } from 'express';
import prisma from '../config/database';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        createdQuests: {
          where: { status: 'COMPLETED' },
        },
        assignedQuests: {
          where: { status: 'COMPLETED' },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const stats = {
      ...user,
      completedQuestsCount: user.assignedQuests.length,
      createdQuestsCount: user.createdQuests.length,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user role
router.patch('/me/role', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.user as any).id;
    const { role } = req.body;

    if (!['CLIENT', 'ADVENTURER'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// Get leaderboard
router.get('/leaderboard/top', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        level: true,
        xp: true,
        gold: true,
        _count: {
          select: {
            assignedQuests: {
              where: { status: 'COMPLETED' },
            },
          },
        },
      },
      orderBy: [
        { level: 'desc' },
        { xp: 'desc' },
      ],
      take: 10,
    });

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      ...user,
      completedQuests: user._count.assignedQuests,
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;
