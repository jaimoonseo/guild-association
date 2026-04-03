import apiClient from './client';
import { User } from '../types';

export const authAPI = {
  getMe: async () => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  loginWithGitHub: () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    window.location.href = `${API_URL}/auth/github`;
  },
};
