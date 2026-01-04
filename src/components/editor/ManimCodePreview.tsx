import { motion } from 'framer-motion';
import { Code2, Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/stores/projectStore';
import { useState } from 'react';

export const ManimCodePreview = () => {
  const { currentProject } = useProjectStore();
  const [copied, setCopied] = useState(false);

  const code = currentProject?.manim_code;

  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!code) {
    return (
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8 text-center">
        <div className="text-muted-foreground">
          <Code2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Manim code will appear here after generation</p>
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
          <Code2 className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium">Manim Code</span>
          <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">Python</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleCopy}
          className="h-7 px-2"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-success" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>

      {/* Code */}
      <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
        <SyntaxHighlighter
          language="python"
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            background: 'transparent',
            fontSize: '0.75rem',
            padding: '1rem',
          }}
          showLineNumbers
          lineNumberStyle={{
            color: 'hsl(var(--muted-foreground))',
            opacity: 0.5,
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </motion.div>
  );
};
