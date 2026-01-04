import { motion } from 'framer-motion';
import { Check, Loader2, AlertCircle, Clock } from 'lucide-react';
import { FileText, Mic, Calculator, User, Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PipelineStatus, PIPELINE_STEPS } from '@/types/project';

interface PipelineStepperProps {
  currentStatus: PipelineStatus;
}

const iconMap = {
  FileText,
  Mic,
  Calculator,
  User,
  Film,
};

const getStepState = (stepId: string, currentStatus: PipelineStatus) => {
  const stepOrder = PIPELINE_STEPS.map(s => s.id);
  const currentIndex = stepOrder.findIndex(s => s === currentStatus);
  const stepIndex = stepOrder.findIndex(s => s === stepId);

  if (currentStatus === 'FAILED') return 'error';
  if (currentStatus === 'COMPLETED') return 'completed';
  if (currentStatus === 'idle' || currentStatus === 'PENDING') return 'pending';
  if (stepIndex < currentIndex) return 'completed';
  if (stepIndex === currentIndex) return 'active';
  return 'pending';
};

export const PipelineStepper = ({ currentStatus }: PipelineStepperProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Connection Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-border" />
        <motion.div 
          className="absolute top-6 left-0 h-0.5 bg-gradient-primary"
          initial={{ width: '0%' }}
          animate={{ 
            width: currentStatus === 'COMPLETED' ? '100%' 
              : currentStatus === 'idle' || currentStatus === 'PENDING' ? '0%'
              : `${(PIPELINE_STEPS.findIndex(s => s.id === currentStatus) / (PIPELINE_STEPS.length - 1)) * 100}%`
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {PIPELINE_STEPS.map((step, index) => {
          const state = getStepState(step.id, currentStatus);
          const IconComponent = iconMap[step.icon as keyof typeof iconMap];

          return (
            <motion.div
              key={step.id}
              className="relative z-10 flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative",
                  state === 'completed' && "bg-success glow-primary",
                  state === 'active' && "bg-primary animate-pulse-glow",
                  state === 'pending' && "bg-muted",
                  state === 'error' && "bg-destructive"
                )}
                whileHover={{ scale: 1.1 }}
              >
                {state === 'completed' && (
                  <Check className="w-5 h-5 text-success-foreground" />
                )}
                {state === 'active' && (
                  <Loader2 className="w-5 h-5 text-primary-foreground animate-spin" />
                )}
                {state === 'pending' && (
                  <IconComponent className="w-5 h-5 text-muted-foreground" />
                )}
                {state === 'error' && (
                  <AlertCircle className="w-5 h-5 text-destructive-foreground" />
                )}

                {/* Pulse effect for active state */}
                {state === 'active' && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-primary"
                    initial={{ opacity: 0.5, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.5 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.div>

              <div className="mt-3 text-center">
                <p className={cn(
                  "text-xs font-medium",
                  state === 'active' && "text-primary",
                  state === 'completed' && "text-success",
                  state === 'pending' && "text-muted-foreground",
                  state === 'error' && "text-destructive"
                )}>
                  {step.label}
                </p>
                {state === 'active' && (
                  <motion.p 
                    className="text-[10px] text-muted-foreground mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Processing...
                  </motion.p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
