import { useState, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TOPIC_SUGGESTIONS } from '@/types/project';
import { cn } from '@/lib/utils';

interface LessonInputProps {
  onSubmit: (topic: string) => void;
  isLoading?: boolean;
}

export const LessonInput = ({ onSubmit, isLoading }: LessonInputProps) => {
  const [topic, setTopic] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (topic.trim() && !isLoading) {
      onSubmit(topic.trim());
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTopic(suggestion);
  };

  return (
    <div className="space-y-6">
      {/* Main Input */}
      <motion.div 
        className={cn(
          "relative rounded-2xl transition-all duration-300",
          isFocused && "glow-primary"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="gradient-border rounded-2xl overflow-hidden">
          <div className="bg-card p-1">
            <Textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your math lesson topic... (e.g., 'Explain the chain rule in calculus with visual examples')"
              className="min-h-[120px] text-lg bg-transparent border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
              disabled={isLoading}
            />
            <div className="flex items-center justify-between p-4 pt-0">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span>AI-powered lesson generation</span>
              </div>
              <Button 
                onClick={handleSubmit}
                disabled={!topic.trim() || isLoading}
                className="gap-2 bg-gradient-primary hover:opacity-90 glow-primary text-primary-foreground"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Generate Lesson
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Smart Suggestions */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-secondary" />
          Smart Suggestions
        </p>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {TOPIC_SUGGESTIONS.map((suggestion, index) => (
              <motion.button
                key={suggestion.label}
                onClick={() => handleSuggestionClick(suggestion.label)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  "bg-muted/50 hover:bg-muted text-foreground border border-border/50 hover:border-primary/50",
                  "hover:glow-primary"
                )}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                <span className="text-secondary mr-1.5">#</span>
                {suggestion.label}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
