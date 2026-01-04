import { motion } from 'framer-motion';
import { Video, Music, Image, MoreVertical, Download, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProjectStore } from '@/stores/projectStore';
import { cn } from '@/lib/utils';

interface AssetItem {
  id: string;
  type: 'video' | 'audio' | 'image';
  name: string;
  url: string;
  duration?: string;
  size?: string;
}

export const AssetLibrary = () => {
  const { currentProject } = useProjectStore();
  
  const assets = currentProject?.assets;
  
  const assetItems: AssetItem[] = [];
  
  if (assets?.audio_url) {
    assetItems.push({
      id: 'audio',
      type: 'audio',
      name: 'Voice Narration',
      url: assets.audio_url,
      duration: '3:24',
      size: '4.2 MB',
    });
  }
  
  if (assets?.math_video_url) {
    assetItems.push({
      id: 'math',
      type: 'video',
      name: 'Math Animation',
      url: assets.math_video_url,
      duration: '3:20',
      size: '28.5 MB',
    });
  }
  
  if (assets?.avatar_url) {
    assetItems.push({
      id: 'avatar',
      type: 'video',
      name: 'Avatar Video',
      url: assets.avatar_url,
      duration: '3:24',
      size: '45.2 MB',
    });
  }
  
  if (assets?.final_video_url) {
    assetItems.push({
      id: 'final',
      type: 'video',
      name: 'Final Composite',
      url: assets.final_video_url,
      duration: '3:24',
      size: '52.8 MB',
    });
  }

  const iconMap = {
    video: Video,
    audio: Music,
    image: Image,
  };

  if (assetItems.length === 0) {
    return (
      <motion.div 
        className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-muted-foreground">
          <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Generated assets will appear here</p>
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
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium">Generated Assets</span>
          <span className="text-xs text-muted-foreground">({assetItems.length})</span>
        </div>
      </div>

      {/* Asset Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {assetItems.map((asset, index) => {
          const Icon = iconMap[asset.type];
          
          return (
            <motion.div
              key={asset.id}
              className="bg-muted/30 rounded-lg p-3 border border-border/50 hover:border-primary/50 transition-colors group"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-background/50 rounded-md mb-3 flex items-center justify-center relative overflow-hidden">
                <Icon className="w-8 h-8 text-muted-foreground/50" />
                <motion.div
                  className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity"
                />
              </div>

              {/* Info */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{asset.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {asset.duration} • {asset.size}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                      <MoreVertical className="w-3.5 h-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Download className="w-3.5 h-3.5 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <RefreshCw className="w-3.5 h-3.5 mr-2" />
                      Regenerate
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-3.5 h-3.5 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
