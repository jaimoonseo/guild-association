import apiClient from './client';
import { Quest } from '../types';

export const questAPI = {
  getAll: async (params?: { status?: string; difficulty?: string }) => {
    const response = await apiClient.get<Quest[]>('/api/quests', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Quest>(`/api/quests/${id}`);
    return response.data;
  },

  create: async (data: {
    title: string;
    description: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    reward: number;
    githubIssueUrl?: string;
  }) => {
    const response = await apiClient.post<Quest>('/api/quests', data);
    return response.data;
  },

  accept: async (id: string) => {
    const response = await apiClient.post<Quest>(`/api/quests/${id}/accept`);
    return response.data;
  },

  submit: async (id: string, githubPrUrl: string) => {
    const response = await apiClient.post(`/api/quests/${id}/submit`, { githubPrUrl });
    return response.data;
  },

  complete: async (id: string) => {
    const response = await apiClient.post(`/api/quests/${id}/complete`);
    return response.data;
  },
};
