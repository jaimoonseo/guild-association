export interface User {
  id: string;
  githubId: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  role: 'CLIENT' | 'ADVENTURER';
  level: number;
  xp: number;
  gold: number;
  createdAt: string;
  updatedAt: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  reward: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  githubIssueUrl?: string;
  createdById: string;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  createdBy: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  assignedTo?: {
    id: string;
    username: string;
    avatarUrl?: string;
    level: number;
  };
  submissions?: Submission[];
}

export interface Submission {
  id: string;
  questId: string;
  userId: string;
  githubPrUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  reviewedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  gold: number;
  completedQuests: number;
}
