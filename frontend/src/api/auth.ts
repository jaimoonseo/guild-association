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
    window.location.href = `${apiClient.defaults.baseURL}/auth/github`;
  },
};
