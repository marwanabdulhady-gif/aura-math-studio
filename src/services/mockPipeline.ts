import { PipelineStatus } from '@/types/project';
import { PipelineStatusResponse, StartPipelineResponse } from './api';

const MOCK_SCRIPT = {
  intro: "Welcome to today's lesson on derivatives! We'll explore one of the most fundamental concepts in calculus.",
  explanation: `The derivative of a function measures its rate of change at any given point. 
  
Mathematically, the derivative of f(x) is defined as:
$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$

For polynomial functions, we use the power rule:
$$\\frac{d}{dx}[x^n] = nx^{n-1}$$

Let's work through an example with $f(x) = x^3 + 2x^2 - 5x + 1$`,
  conclusion: "Understanding derivatives opens the door to optimization, physics, and machine learning. Practice with different functions to build your intuition!",
};

const MOCK_MANIM_CODE = `from manim import *

class DerivativeScene(Scene):
    def construct(self):
        # Title
        title = Text("Understanding Derivatives", font_size=48)
        title.to_edge(UP)
        self.play(Write(title))
        
        # Function definition
        func = MathTex(r"f(x) = x^3 + 2x^2 - 5x + 1")
        func.next_to(title, DOWN, buff=1)
        self.play(FadeIn(func))
        
        # Derivative formula
        derivative_def = MathTex(
            r"f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}"
        )
        derivative_def.next_to(func, DOWN, buff=0.5)
        self.play(Write(derivative_def))
        self.wait(2)
        
        # Apply power rule
        power_rule = MathTex(r"\\frac{d}{dx}[x^n] = nx^{n-1}")
        power_rule.next_to(derivative_def, DOWN, buff=0.5)
        self.play(FadeIn(power_rule))
        
        # Result
        result = MathTex(r"f'(x) = 3x^2 + 4x - 5")
        result.next_to(power_rule, DOWN, buff=0.5)
        result.set_color(YELLOW)
        self.play(Transform(func.copy(), result))
        self.wait(3)`;

const PIPELINE_STAGES: PipelineStatus[] = [
  'PENDING',
  'GENERATING_SCRIPT',
  'SYNTHESIZING_AUDIO',
  'RENDERING_MATH',
  'GENERATING_AVATAR',
  'COMPOSITING',
  'COMPLETED',
];

class MockPipelineService {
  private tasks: Map<string, { status: PipelineStatus; stageIndex: number; topic: string }> = new Map();
  
  async start(topic: string): Promise<StartPipelineResponse> {
    const taskId = crypto.randomUUID();
    this.tasks.set(taskId, { status: 'PENDING', stageIndex: 0, topic });
    
    // Simulate automatic progression
    this.simulateProgress(taskId);
    
    return { taskId, status: 'PENDING' };
  }

  async getStatus(taskId: string): Promise<PipelineStatusResponse> {
    const task = this.tasks.get(taskId);
    
    if (!task) {
      return { taskId, status: 'FAILED', progress: 0, error: 'Task not found' };
    }

    const progress = Math.min((task.stageIndex / (PIPELINE_STAGES.length - 1)) * 100, 100);
    
    const response: PipelineStatusResponse = {
      taskId,
      status: task.status,
      progress,
    };

    // Add data based on current stage
    if (task.stageIndex >= 1) {
      response.script = MOCK_SCRIPT;
      response.manim_code = MOCK_MANIM_CODE;
    }

    if (task.stageIndex >= 2) {
      response.assets = {
        audio_url: 'https://example.com/audio.mp3',
      };
    }

    if (task.stageIndex >= 3) {
      response.assets = {
        ...response.assets,
        math_video_url: 'https://example.com/math.mp4',
      };
    }

    if (task.stageIndex >= 4) {
      response.assets = {
        ...response.assets,
        avatar_url: 'https://example.com/avatar.mp4',
      };
    }

    if (task.stageIndex >= 5) {
      response.assets = {
        ...response.assets,
        final_video_url: 'https://example.com/final.mp4',
      };
    }

    return response;
  }

  private simulateProgress(taskId: string) {
    const task = this.tasks.get(taskId);
    if (!task) return;

    const interval = setInterval(() => {
      const currentTask = this.tasks.get(taskId);
      if (!currentTask) {
        clearInterval(interval);
        return;
      }

      if (currentTask.stageIndex < PIPELINE_STAGES.length - 1) {
        currentTask.stageIndex++;
        currentTask.status = PIPELINE_STAGES[currentTask.stageIndex];
        this.tasks.set(taskId, currentTask);
      } else {
        clearInterval(interval);
      }
    }, 3000); // Progress every 3 seconds
  }
}

export const mockPipelineService = new MockPipelineService();
