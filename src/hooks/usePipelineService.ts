import { useCallback, useRef } from 'react';
import { useProjectStore } from '@/stores/projectStore';
import { pipelineApi, PipelineStatusResponse } from '@/services/api';
import { mockPipelineService } from '@/services/mockPipeline';
import { PipelineStatus } from '@/types/project';

const POLL_INTERVAL = 3000;
const MAX_RETRIES = 3;

export const usePipelineService = () => {
  const { 
    useMockApi, 
    currentProject, 
    updateProjectStatus, 
    updateProjectScript, 
    updateProjectAssets,
    updateManimCode,
    addLog 
  } = useProjectStore();
  
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  const processStatusResponse = useCallback((response: PipelineStatusResponse) => {
    updateProjectStatus(response.status);

    if (response.script) {
      updateProjectScript(response.script);
    }

    if (response.manim_code) {
      updateManimCode(response.manim_code);
    }

    if (response.assets) {
      updateProjectAssets(response.assets);
    }

    // Log status updates
    const statusMessages: Record<PipelineStatus, string> = {
      'idle': 'Pipeline idle',
      'PENDING': 'Pipeline started, waiting for processing...',
      'GENERATING_SCRIPT': 'Generating AI script for your lesson...',
      'SYNTHESIZING_AUDIO': 'Synthesizing voice using ElevenLabs...',
      'RENDERING_MATH': 'Rendering Manim animations...',
      'GENERATING_AVATAR': 'Generating talking avatar with HeyGen...',
      'COMPOSITING': 'Compositing final video...',
      'COMPLETED': 'Video generation completed successfully!',
      'FAILED': `Pipeline failed: ${response.error || 'Unknown error'}`,
    };

    const logType = response.status === 'COMPLETED' ? 'success' 
      : response.status === 'FAILED' ? 'error' 
      : 'info';

    addLog(logType, statusMessages[response.status] || `Status: ${response.status}`);

    return response.status === 'COMPLETED' || response.status === 'FAILED';
  }, [updateProjectStatus, updateProjectScript, updateProjectAssets, updateManimCode, addLog]);

  const pollStatus = useCallback(async (taskId: string) => {
    try {
      const response = useMockApi 
        ? await mockPipelineService.getStatus(taskId)
        : await pipelineApi.getStatus(taskId);

      retryCountRef.current = 0; // Reset retry count on success
      const isComplete = processStatusResponse(response);

      if (isComplete) {
        stopPolling();
      }
    } catch (error) {
      retryCountRef.current++;
      addLog('warning', `Status check failed (attempt ${retryCountRef.current}/${MAX_RETRIES})`);

      if (retryCountRef.current >= MAX_RETRIES) {
        stopPolling();
        updateProjectStatus('FAILED');
        addLog('error', 'Pipeline failed after maximum retries');
      }
    }
  }, [useMockApi, processStatusResponse, stopPolling, addLog, updateProjectStatus]);

  const startPipeline = useCallback(async (topic: string) => {
    if (!currentProject) {
      addLog('error', 'No project selected');
      return;
    }

    try {
      addLog('info', `Starting pipeline for topic: "${topic}"`);
      updateProjectStatus('PENDING');

      const response = useMockApi 
        ? await mockPipelineService.start(topic)
        : await pipelineApi.start(topic);

      addLog('success', `Pipeline task created: ${response.taskId.slice(0, 8)}...`);

      // Start polling for status
      stopPolling(); // Clear any existing polling
      retryCountRef.current = 0;
      
      pollIntervalRef.current = setInterval(() => {
        pollStatus(response.taskId);
      }, POLL_INTERVAL);

      // Initial status check
      pollStatus(response.taskId);

    } catch (error) {
      addLog('error', `Failed to start pipeline: ${error}`);
      updateProjectStatus('FAILED');
    }
  }, [currentProject, useMockApi, addLog, updateProjectStatus, stopPolling, pollStatus]);

  return {
    startPipeline,
    stopPolling,
  };
};
