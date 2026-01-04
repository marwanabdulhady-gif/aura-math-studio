export type PipelineStatus = 
  | 'idle' 
  | 'PENDING'
  | 'GENERATING_SCRIPT' 
  | 'SYNTHESIZING_AUDIO' 
  | 'RENDERING_MATH' 
  | 'GENERATING_AVATAR' 
  | 'COMPOSITING' 
  | 'COMPLETED' 
  | 'FAILED';

export interface ProjectScript {
  intro: string;
  explanation: string;
  conclusion: string;
}

export interface ProjectAssets {
  audio_url?: string;
  math_video_url?: string;
  avatar_url?: string;
  final_video_url?: string;
}

export interface Project {
  projectId: string;
  topic: string;
  script: ProjectScript;
  manim_code: string;
  assets: ProjectAssets;
  status: PipelineStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export const PIPELINE_STEPS = [
  { id: 'GENERATING_SCRIPT', label: 'AI Scripting', icon: 'FileText' },
  { id: 'SYNTHESIZING_AUDIO', label: 'Voice Synthesis', icon: 'Mic' },
  { id: 'RENDERING_MATH', label: 'Math Visuals', icon: 'Calculator' },
  { id: 'GENERATING_AVATAR', label: 'Avatar Sync', icon: 'User' },
  { id: 'COMPOSITING', label: 'Final Export', icon: 'Film' },
] as const;

export const TOPIC_SUGGESTIONS = [
  { label: 'Calculus: Derivatives', category: 'Calculus' },
  { label: 'Algebra: Quadratic Equations', category: 'Algebra' },
  { label: 'Trigonometry: Unit Circle', category: 'Trigonometry' },
  { label: 'Linear Algebra: Matrices', category: 'Linear Algebra' },
  { label: 'Statistics: Normal Distribution', category: 'Statistics' },
  { label: 'Geometry: Pythagorean Theorem', category: 'Geometry' },
  { label: 'Calculus: Integrals', category: 'Calculus' },
  { label: 'Number Theory: Prime Numbers', category: 'Number Theory' },
];
