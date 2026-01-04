import { create } from 'zustand';
import { Project, LogEntry, PipelineStatus } from '@/types/project';

interface ProjectState {
  currentProject: Project | null;
  projects: Project[];
  logs: LogEntry[];
  useMockApi: boolean;
  
  // Actions
  setCurrentProject: (project: Project | null) => void;
  updateProjectStatus: (status: PipelineStatus) => void;
  updateProjectScript: (script: Partial<Project['script']>) => void;
  updateProjectAssets: (assets: Partial<Project['assets']>) => void;
  updateManimCode: (code: string) => void;
  addProject: (project: Project) => void;
  addLog: (type: LogEntry['type'], message: string) => void;
  clearLogs: () => void;
  toggleMockApi: () => void;
  createNewProject: (topic: string) => Project;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  currentProject: null,
  projects: [],
  logs: [],
  useMockApi: true,

  setCurrentProject: (project) => set({ currentProject: project }),

  updateProjectStatus: (status) => set((state) => ({
    currentProject: state.currentProject 
      ? { ...state.currentProject, status, updatedAt: new Date() }
      : null,
  })),

  updateProjectScript: (script) => set((state) => ({
    currentProject: state.currentProject 
      ? { 
          ...state.currentProject, 
          script: { ...state.currentProject.script, ...script },
          updatedAt: new Date() 
        }
      : null,
  })),

  updateProjectAssets: (assets) => set((state) => ({
    currentProject: state.currentProject 
      ? { 
          ...state.currentProject, 
          assets: { ...state.currentProject.assets, ...assets },
          updatedAt: new Date() 
        }
      : null,
  })),

  updateManimCode: (code) => set((state) => ({
    currentProject: state.currentProject 
      ? { ...state.currentProject, manim_code: code, updatedAt: new Date() }
      : null,
  })),

  addProject: (project) => set((state) => ({
    projects: [project, ...state.projects],
  })),

  addLog: (type, message) => set((state) => ({
    logs: [
      ...state.logs,
      {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        type,
        message,
      },
    ].slice(-100), // Keep last 100 logs
  })),

  clearLogs: () => set({ logs: [] }),

  toggleMockApi: () => set((state) => ({ useMockApi: !state.useMockApi })),

  createNewProject: (topic) => {
    const project: Project = {
      projectId: crypto.randomUUID(),
      topic,
      script: { intro: '', explanation: '', conclusion: '' },
      manim_code: '',
      assets: {},
      status: 'idle',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      currentProject: project,
      projects: [project, ...state.projects],
    }));
    
    return project;
  },
}));
