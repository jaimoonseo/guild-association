import { Router } from 'express';
import prisma from '../config/database';
import { isAuthenticated, isClient } from '../middleware/auth';

const router = Router();

// Get all quests
router.get('/', async (req, res) => {
  try {
    const { status, difficulty } = req.query;
    const where: any = {};

    if (status) where.status = status;
    if (difficulty) where.difficulty = difficulty;

    const quests = await prisma.quest.findMany({
      where,
      include: {
        createdBy: {
          select: { id: true, username: true, avatarUrl: true },
        },
        assignedTo: {
          select: { id: true, username: true, avatarUrl: true, level: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(quests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quests' });
  }
});

// Get quest by ID
router.get('/:id', async (req, res) => {
  try {
    const quest = await prisma.quest.findUnique({
      where: { id: req.params.id },
      include: {
        createdBy: {
          select: { id: true, username: true, avatarUrl: true },
        },
        assignedTo: {
          select: { id: true, username: true, avatarUrl: true, level: true },
        },
        submissions: {
          include: {
            user: {
              select: { id: true, username: true, avatarUrl: true },
            },
          },
        },
      },
    });

    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' });
    }

    res.json(quest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quest' });
  }
});

// Create quest (Client only)
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title, description, difficulty, reward, githubIssueUrl } = req.body;
    const userId = (req.user as any).id;

    const quest = await prisma.quest.create({
      data: {
        title,
        description,
        difficulty,
        reward,
        githubIssueUrl,
        createdById: userId,
      },
      include: {
        createdBy: {
          select: { id: true, username: true, avatarUrl: true },
        },
      },
    });

    res.status(201).json(quest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create quest' });
  }
});

// Accept quest (Adventurer only)
router.post('/:id/accept', isAuthenticated, async (req, res) => {
  try {
    const questId = req.params.id;
    const userId = (req.user as any).id;

    const quest = await prisma.quest.findUnique({ where: { id: questId } });

    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' });
    }

    if (quest.status !== 'OPEN') {
      return res.status(400).json({ error: 'Quest is not available' });
    }

    const updatedQuest = await prisma.quest.update({
      where: { id: questId },
      data: {
        status: 'IN_PROGRESS',
        assignedToId: userId,
      },
      include: {
        assignedTo: {
          select: { id: true, username: true, avatarUrl: true, level: true },
        },
      },
    });

    res.json(updatedQuest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept quest' });
  }
});

// Submit solution
router.post('/:id/submit', isAuthenticated, async (req, res) => {
  try {
    const questId = req.params.id;
    const userId = (req.user as any).id;
    const { githubPrUrl } = req.body;

    const quest = await prisma.quest.findUnique({ where: { id: questId } });

    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' });
    }

    if (quest.assignedToId !== userId) {
      return res.status(403).json({ error: 'Not assigned to this quest' });
    }

    const submission = await prisma.submission.create({
      data: {
        questId,
        userId,
        githubPrUrl,
      },
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit solution' });
  }
});

// Complete quest (Client only)
router.post('/:id/complete', isAuthenticated, async (req, res) => {
  try {
    const questId = req.params.id;
    const userId = (req.user as any).id;

    const quest = await prisma.quest.findUnique({ where: { id: questId } });

    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' });
    }

    if (quest.createdById !== userId) {
      return res.status(403).json({ error: 'Only quest creator can complete' });
    }

    if (quest.status !== 'IN_PROGRESS') {
      return res.status(400).json({ error: 'Quest is not in progress' });
    }

    // Award gold and XP to adventurer
    const xpGain = quest.reward * 10; // 10 XP per gold
    const adventurer = await prisma.user.update({
      where: { id: quest.assignedToId! },
      data: {
        gold: { increment: quest.reward },
        xp: { increment: xpGain },
      },
    });

    // Level up logic (simple: every 1000 XP = 1 level)
    const newLevel = Math.floor(adventurer.xp / 1000) + 1;
    if (newLevel > adventurer.level) {
      await prisma.user.update({
        where: { id: adventurer.id },
        data: { level: newLevel },
      });
    }

    // Complete quest
    const completedQuest = await prisma.quest.update({
      where: { id: questId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    res.json({ quest: completedQuest, adventurer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to complete quest' });
  }
});

export default router;
