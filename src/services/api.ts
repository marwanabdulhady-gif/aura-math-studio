import axios from 'axios';
import { Project, PipelineStatus } from '@/types/project';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth tokens if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token here if needed
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Types
export interface StartPipelineResponse {
  taskId: string;
  status: PipelineStatus;
}

export interface PipelineStatusResponse {
  taskId: string;
  status: PipelineStatus;
  progress: number;
  assets?: {
    audio_url?: string;
    math_video_url?: string;
    avatar_url?: string;
    final_video_url?: string;
  };
  script?: {
    intro: string;
    explanation: string;
    conclusion: string;
  };
  manim_code?: string;
  error?: string;
}

// API Functions
export const pipelineApi = {
  start: async (topic: string): Promise<StartPipelineResponse> => {
    const response = await apiClient.post('/pipeline/start', { topic });
    return response.data;
  },

  getStatus: async (taskId: string): Promise<PipelineStatusResponse> => {
    const response = await apiClient.get(`/pipeline/status/${taskId}`);
    return response.data;
  },

  generateScript: async (topic: string) => {
    const response = await apiClient.post('/generate-script', { topic });
    return response.data;
  },

  generateAudio: async (text: string, voiceId?: string) => {
    const response = await apiClient.post('/generate-audio', { text, voiceId });
    return response.data;
  },

  renderManim: async (code: string) => {
    const response = await apiClient.post('/render-manim', { code });
    return response.data;
  },

  generateAvatar: async (audioUrl: string, avatarId?: string) => {
    const response = await apiClient.post('/generate-avatar', { audioUrl, avatarId });
    return response.data;
  },
};
