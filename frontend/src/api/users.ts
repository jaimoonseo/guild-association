import apiClient from './client';
import { User, LeaderboardEntry } from '../types';

export const userAPI = {
  getProfile: async (id: string) => {
    const response = await apiClient.get<User>(`/api/users/${id}`);
    return response.data;
  },

  updateRole: async (role: 'CLIENT' | 'ADVENTURER') => {
    const response = await apiClient.patch<User>('/api/users/me/role', { role });
    return response.data;
  },

  getLeaderboard: async () => {
    const response = await apiClient.get<LeaderboardEntry[]>('/api/users/leaderboard/top');
    return response.data;
  },
};
