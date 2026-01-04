import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { useProjectStore } from '@/stores/projectStore';
import { Zap, Wifi, WifiOff } from 'lucide-react';

export const DashboardHeader = () => {
  const { useMockApi, toggleMockApi, currentProject } = useProjectStore();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-2xl font-bold">
              <span className="gradient-text">Lesson Creator</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {currentProject 
                ? `Working on: ${currentProject.topic || 'Untitled Project'}`
                : 'Create AI-powered math education videos'
              }
            </p>
          </motion.div>

          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Mock API Toggle */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-2">
                {useMockApi ? (
                  <WifiOff className="w-4 h-4 text-warning" />
                ) : (
                  <Wifi className="w-4 h-4 text-success" />
                )}
                <span className="text-sm text-muted-foreground">
                  {useMockApi ? 'Mock Mode' : 'Live API'}
                </span>
              </div>
              <Switch
                checked={!useMockApi}
                onCheckedChange={() => toggleMockApi()}
              />
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30 border border-border">
              <Zap className="w-4 h-4 text-secondary animate-pulse" />
              <span className="text-sm">System Ready</span>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};
