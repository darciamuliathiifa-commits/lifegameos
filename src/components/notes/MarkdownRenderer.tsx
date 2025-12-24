import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = ({ content, className }: MarkdownRendererProps) => {
  const parseMarkdown = (text: string): string => {
    // Split into lines for processing
    const lines = text.split('\n');
    const processedLines: string[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeBlockLang = '';
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      // Handle code blocks (```)
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBlockLang = line.trim().slice(3);
          codeBlockContent = [];
        } else {
          inCodeBlock = false;
          const code = codeBlockContent.join('\n')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
          processedLines.push(`<pre class="bg-muted/50 border border-border rounded-lg p-4 my-3 overflow-x-auto"><code class="text-sm font-mono text-primary">${code}</code></pre>`);
        }
        continue;
      }
      
      if (inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }
      
      // Skip empty lines but preserve structure
      if (line.trim() === '') {
        processedLines.push('<div class="h-3"></div>');
        continue;
      }
      
      // Escape HTML first
      line = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      
      // Headers - check from most specific (######) to least (#)
      if (line.match(/^###### (.+)$/)) {
        line = line.replace(/^###### (.+)$/, '<h6 class="text-sm font-semibold text-muted-foreground mb-1 mt-2">$1</h6>');
        processedLines.push(line);
        continue;
      }
      if (line.match(/^##### (.+)$/)) {
        line = line.replace(/^##### (.+)$/, '<h5 class="text-base font-semibold text-foreground mb-1 mt-2">$1</h5>');
        processedLines.push(line);
        continue;
      }
      if (line.match(/^#### (.+)$/)) {
        line = line.replace(/^#### (.+)$/, '<h4 class="text-lg font-semibold text-foreground mb-2 mt-3">$1</h4>');
        processedLines.push(line);
        continue;
      }
      if (line.match(/^### (.+)$/)) {
        line = line.replace(/^### (.+)$/, '<h3 class="text-xl font-bold text-foreground mb-2 mt-4">$1</h3>');
        processedLines.push(line);
        continue;
      }
      if (line.match(/^## (.+)$/)) {
        line = line.replace(/^## (.+)$/, '<h2 class="text-2xl font-bold text-foreground border-b border-border/50 pb-2 mb-3 mt-5">$1</h2>');
        processedLines.push(line);
        continue;
      }
      if (line.match(/^# (.+)$/)) {
        line = line.replace(/^# (.+)$/, '<h1 class="text-3xl font-bold text-foreground border-b border-border pb-2 mb-4 mt-6">$1</h1>');
        processedLines.push(line);
        continue;
      }
      
      // Blockquotes
      if (line.match(/^&gt; (.+)$/)) {
        line = line.replace(/^&gt; (.+)$/, '<blockquote class="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-2 bg-muted/30 py-2 rounded-r">$1</blockquote>');
        processedLines.push(line);
        continue;
      }
      
      // Horizontal rules
      if (line.match(/^---$/) || line.match(/^\*\*\*$/)) {
        processedLines.push('<hr class="border-border my-6" />');
        continue;
      }
      
      // Unordered lists (- or *)
      if (line.match(/^[\-\*] (.+)$/)) {
        const content = line.replace(/^[\-\*] (.+)$/, '$1');
        const formattedContent = formatInlineElements(content);
        processedLines.push(`<li class="text-foreground ml-5 list-disc mb-1">${formattedContent}</li>`);
        continue;
      }
      
      // Ordered lists
      if (line.match(/^\d+\. (.+)$/)) {
        const content = line.replace(/^\d+\. (.+)$/, '$1');
        const formattedContent = formatInlineElements(content);
        processedLines.push(`<li class="text-foreground ml-5 list-decimal mb-1">${formattedContent}</li>`);
        continue;
      }
      
      // Checkbox lists
      if (line.match(/^- \[ \] (.+)$/)) {
        const content = line.replace(/^- \[ \] (.+)$/, '$1');
        const formattedContent = formatInlineElements(content);
        processedLines.push(`<div class="flex items-center gap-2 mb-1"><span class="w-4 h-4 border border-border rounded inline-block"></span><span class="text-foreground">${formattedContent}</span></div>`);
        continue;
      }
      if (line.match(/^- \[x\] (.+)$/i)) {
        const content = line.replace(/^- \[x\] (.+)$/i, '$1');
        const formattedContent = formatInlineElements(content);
        processedLines.push(`<div class="flex items-center gap-2 mb-1"><span class="w-4 h-4 bg-primary rounded inline-flex items-center justify-center text-xs text-primary-foreground">✓</span><span class="text-muted-foreground line-through">${formattedContent}</span></div>`);
        continue;
      }
      
      // Regular paragraph with inline formatting
      const formattedLine = formatInlineElements(line);
      processedLines.push(`<p class="text-foreground leading-relaxed mb-2">${formattedLine}</p>`);
    }
    
    // Wrap consecutive list items in ul/ol
    let result = processedLines.join('\n');
    result = result.replace(/(<li class="text-foreground ml-5 list-disc[^"]*">[^<]*<\/li>\n?)+/g, (match) => {
      return `<ul class="my-2">${match}</ul>`;
    });
    result = result.replace(/(<li class="text-foreground ml-5 list-decimal[^"]*">[^<]*<\/li>\n?)+/g, (match) => {
      return `<ol class="my-2">${match}</ol>`;
    });
    
    return result;
  };
  
  const formatInlineElements = (text: string): string => {
    return text
      // Bold and Italic combined (***text*** or ___text___)
      .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong class="font-bold"><em class="italic">$1</em></strong>')
      .replace(/___([^_]+)___/g, '<strong class="font-bold"><em class="italic">$1</em></strong>')
      // Bold (**text** or __text__)
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>')
      .replace(/__([^_]+)__/g, '<strong class="font-bold text-foreground">$1</strong>')
      // Italic (*text* or _text_)
      .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')
      .replace(/_([^_]+)_/g, '<em class="italic">$1</em>')
      // Strikethrough (~~text~~)
      .replace(/~~([^~]+)~~/g, '<del class="line-through text-muted-foreground">$1</del>')
      // Inline code (`code`)
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary">$1</code>')
      // Links [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary/80 underline underline-offset-2">$1</a>')
      // Highlight (==text==)
      .replace(/==([^=]+)==/g, '<mark class="bg-accent/30 px-1 rounded">$1</mark>');
  };

  return (
    <div 
      className={cn("prose prose-invert max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content || '') }}
    />
  );
};