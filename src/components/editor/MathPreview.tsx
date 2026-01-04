import { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';

export const MathPreview = () => {
  const { currentProject } = useProjectStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const script = currentProject?.script;
  const content = script ? `${script.intro}\n\n${script.explanation}\n\n${script.conclusion}` : '';

  useEffect(() => {
    if (!containerRef.current || !content) return;

    // Process content and render math
    const processedContent = content.replace(
      /\$\$(.*?)\$\$|\$(.*?)\$/g,
      (match, displayMath, inlineMath) => {
        const math = displayMath || inlineMath;
        const displayMode = !!displayMath;
        
        try {
          return katex.renderToString(math, {
            displayMode,
            throwOnError: false,
            trust: true,
          });
        } catch {
          return match;
        }
      }
    );

    // Split into paragraphs and wrap
    const paragraphs = processedContent.split('\n\n').filter(Boolean);
    containerRef.current.innerHTML = paragraphs
      .map(p => `<p class="mb-4 leading-relaxed">${p.replace(/\n/g, '<br/>')}</p>`)
      .join('');

  }, [content]);

  if (!content) {
    return (
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8 text-center">
        <div className="text-muted-foreground">
          <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Math preview will appear here</p>
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
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b border-border">
        <Calculator className="w-4 h-4 text-secondary" />
        <span className="text-sm font-medium">Math Preview (KaTeX)</span>
      </div>

      {/* Content */}
      <div 
        ref={containerRef}
        className="p-6 prose prose-invert prose-sm max-w-none overflow-y-auto max-h-[400px] scrollbar-thin"
      />
    </motion.div>
  );
};
