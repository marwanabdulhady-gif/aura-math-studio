import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Info, CheckCircle, AlertTriangle, XCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/stores/projectStore';
import { cn } from '@/lib/utils';

const iconMap = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const colorMap = {
  info: 'text-secondary',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-destructive',
};

export const LogConsole = () => {
  const { logs, clearLogs } = useProjectStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <motion.div 
      className="bg-card/50 backdrop-blur-sm border border-border rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium">Pipeline Console</span>
          <span className="text-xs text-muted-foreground">({logs.length} entries)</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearLogs}
          className="h-7 px-2 text-muted-foreground hover:text-foreground"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Log Entries */}
      <div 
        ref={scrollRef}
        className="h-40 overflow-y-auto scrollbar-thin p-3 space-y-1 font-mono text-xs"
      >
        <AnimatePresence initial={false}>
          {logs.length === 0 ? (
            <motion.p 
              className="text-muted-foreground text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Waiting for pipeline to start...
            </motion.p>
          ) : (
            logs.map((log) => {
              const Icon = iconMap[log.type];
              return (
                <motion.div
                  key={log.id}
                  className="flex items-start gap-2 py-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="text-muted-foreground shrink-0">
                    [{log.timestamp.toLocaleTimeString()}]
                  </span>
                  <Icon className={cn("w-3.5 h-3.5 shrink-0 mt-0.5", colorMap[log.type])} />
                  <span className={cn(
                    log.type === 'error' && 'text-destructive',
                    log.type === 'success' && 'text-success',
                    log.type === 'warning' && 'text-warning',
                  )}>
                    {log.message}
                  </span>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
