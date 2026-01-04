import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, Download, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useState, useRef } from 'react';
import { useProjectStore } from '@/stores/projectStore';
import { cn } from '@/lib/utils';

export const VideoPreview = () => {
  const { currentProject } = useProjectStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);

  const assets = currentProject?.assets;
  const hasVideo = assets?.final_video_url || assets?.math_video_url;

  if (!hasVideo) {
    return (
      <motion.div 
        className="bg-card/50 backdrop-blur-sm border border-border rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="aspect-video bg-gradient-surface flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Play className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-sm">Video preview will appear here</p>
            <p className="text-xs mt-1 opacity-70">Math visuals + Avatar overlay</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-card/50 backdrop-blur-sm border border-border rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Video Area */}
      <div className="relative aspect-video bg-gradient-surface">
        {/* Placeholder for video */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4"
              animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Play className="w-10 h-10 text-primary ml-1" />
            </motion.div>
            <p className="text-sm text-muted-foreground">Video generated successfully</p>
          </div>
        </div>

        {/* Overlay Toggle Indicator */}
        {showOverlay && assets?.avatar_url && (
          <motion.div 
            className="absolute bottom-20 right-4 w-32 h-32 rounded-xl bg-card/80 border border-border overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary/30" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-2">
              <p className="text-[10px] text-center text-muted-foreground">Avatar Overlay</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 bg-muted/30 space-y-3">
        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-10">0:00</span>
          <Slider
            value={[progress]}
            onValueChange={(v) => setProgress(v[0])}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-10">3:24</span>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-9 w-9"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="h-9 w-9"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOverlay(!showOverlay)}
              className={cn(
                "h-8 gap-1.5 text-xs",
                showOverlay && "text-primary"
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              Overlay
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
