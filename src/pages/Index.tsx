import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { LessonInput } from '@/components/lesson/LessonInput';
import { PipelineStepper } from '@/components/pipeline/PipelineStepper';
import { ScriptEditor } from '@/components/editor/ScriptEditor';
import { MathPreview } from '@/components/editor/MathPreview';
import { ManimCodePreview } from '@/components/editor/ManimCodePreview';
import { VideoPreview } from '@/components/preview/VideoPreview';
import { AssetLibrary } from '@/components/assets/AssetLibrary';
import { LogConsole } from '@/components/console/LogConsole';
import { useProjectStore } from '@/stores/projectStore';
import { usePipelineService } from '@/hooks/usePipelineService';

const Index = () => {
  const { currentProject, createNewProject, addLog } = useProjectStore();
  const { startPipeline } = usePipelineService();

  const handleSubmit = async (topic: string) => {
    // Create a new project if none exists
    if (!currentProject) {
      createNewProject(topic);
      addLog('info', `Created new project: "${topic}"`);
    }
    
    // Start the pipeline
    startPipeline(topic);
  };

  const isProcessing = currentProject?.status !== 'idle' 
    && currentProject?.status !== 'COMPLETED' 
    && currentProject?.status !== 'FAILED'
    && currentProject?.status !== undefined;

  return (
    <>
      <Helmet>
        <title>Aura Math AI - AI-Powered Math Education Videos</title>
        <meta name="description" content="Create stunning math education videos with AI. Automate scripting, voice synthesis, animations, and avatar generation." />
      </Helmet>
      
      <MainLayout>
        <DashboardHeader />
        
        <div className="p-8 space-y-8">
          {/* Pipeline Status */}
          {currentProject && currentProject.status !== 'idle' && (
            <motion.section
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-8"
            >
              <h2 className="text-lg font-semibold mb-6 text-center">Pipeline Progress</h2>
              <PipelineStepper currentStatus={currentProject.status} />
            </motion.section>
          )}

          {/* Magic Input Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <LessonInput onSubmit={handleSubmit} isLoading={isProcessing} />
          </motion.section>

          {/* Content Grid */}
          {currentProject && (
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Left Column */}
              <div className="space-y-6">
                <ScriptEditor />
                <ManimCodePreview />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <MathPreview />
                <VideoPreview />
                <AssetLibrary />
              </div>
            </motion.div>
          )}

          {/* Log Console */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <LogConsole />
          </motion.section>
        </div>
      </MainLayout>
    </>
  );
};

export default Index;
