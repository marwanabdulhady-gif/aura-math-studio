import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Save, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useProjectStore } from '@/stores/projectStore';
import { cn } from '@/lib/utils';

export const ScriptEditor = () => {
  const { currentProject, updateProjectScript } = useProjectStore();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'intro' | 'explanation' | 'conclusion'>('intro');
  const [editContent, setEditContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const script = currentProject?.script;

  useEffect(() => {
    if (script) {
      setEditContent(script[activeTab]);
    }
  }, [activeTab, script]);

  const handleSave = () => {
    updateProjectScript({ [activeTab]: editContent });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (script) {
      setEditContent(script[activeTab]);
    }
    setIsEditing(false);
  };

  const tabs = [
    { id: 'intro', label: 'Introduction' },
    { id: 'explanation', label: 'Main Explanation' },
    { id: 'conclusion', label: 'Conclusion' },
  ] as const;

  if (!script || (!script.intro && !script.explanation && !script.conclusion)) {
    return (
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8 text-center">
        <div className="text-muted-foreground">
          <Edit3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Script will appear here after generation</p>
        </div>
      </div>
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
          <Edit3 className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium">Script Editor</span>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCancel}
                className="h-7 px-2"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                className="h-7 px-3 bg-success hover:bg-success/90"
              >
                <Save className="w-3.5 h-3.5 mr-1" />
                Save
              </Button>
            </>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="h-7 px-2"
            >
              <Edit3 className="w-3.5 h-3.5 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (!isEditing) setActiveTab(tab.id);
            }}
            className={cn(
              "flex-1 px-4 py-2.5 text-sm font-medium transition-colors relative",
              activeTab === tab.id 
                ? "text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeScriptTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {isEditing ? (
          <Textarea
            ref={textareaRef}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[200px] bg-muted/30 border-border resize-none font-mono text-sm"
          />
        ) : (
          <div className="min-h-[200px] p-4 bg-muted/30 rounded-lg">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {script[activeTab] || 'No content generated yet'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
