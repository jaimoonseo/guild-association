import { Router } from 'express';

const router = Router();

// Mock NPC AI endpoint
router.post('/advice', (req, res) => {
  const { questDifficulty, userLevel } = req.body;

  // Mock AI responses
  const adviceTemplates = {
    EASY: [
      "This quest looks perfect for a beginner! Start with the documentation first.",
      "A great quest to build your skills! Don't forget to test your code.",
      "Easy quest detected! Remember to commit often and write clear code.",
    ],
    MEDIUM: [
      "A challenging quest awaits! Break it down into smaller tasks.",
      "This will test your skills! Consider pair programming if you get stuck.",
      "Good choice! Make sure to review similar issues on GitHub first.",
    ],
    HARD: [
      "A legendary quest! Study the codebase thoroughly before starting.",
      "This quest requires mastery! Don't hesitate to ask for help in discussions.",
      "Epic difficulty! Plan your approach carefully and test extensively.",
    ],
  };

  const levelAdvice = userLevel < 5
    ? "As a novice adventurer, consider starting with easier quests to build experience."
    : userLevel < 10
    ? "You're gaining strength! Medium quests are within your reach."
    : "A veteran adventurer! Hard quests await your expertise.";

  const difficulty = questDifficulty || 'EASY';
  const randomAdvice = adviceTemplates[difficulty as keyof typeof adviceTemplates]?.[
    Math.floor(Math.random() * 3)
  ] || "Stay focused and code with honor!";

  res.json({
    npc: "Guild Master",
    message: randomAdvice,
    personalizedAdvice: levelAdvice,
    motivationalQuote: "The best code is written one line at a time. ⚔️",
  });
});

// Get random quest suggestion
router.get('/suggest-quest', (req, res) => {
  const suggestions = [
    {
      type: "EASY",
      title: "Fix typo in README",
      description: "Help improve documentation by fixing typos.",
      estimatedTime: "30 minutes",
    },
    {
      type: "MEDIUM",
      title: "Add unit tests",
      description: "Increase code coverage by adding test cases.",
      estimatedTime: "2-3 hours",
    },
    {
      type: "HARD",
      title: "Refactor core module",
      description: "Improve performance and maintainability of critical code.",
      estimatedTime: "1-2 days",
    },
  ];

  const random = suggestions[Math.floor(Math.random() * suggestions.length)];
  res.json({
    npc: "Quest Board",
    suggestion: random,
    message: "Here's a quest that might interest you!",
  });
});

export default router;
