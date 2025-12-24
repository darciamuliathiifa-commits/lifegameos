import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = ({ content, className }: MarkdownRendererProps) => {
  const parseMarkdown = (text: string): string => {
    if (!text) return '';
    
    const lines = text.split('\n');
    const processedLines: string[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let inList = false;
    let listType: 'ul' | 'ol' | null = null;
    
    const closeList = () => {
      if (inList && listType) {
        processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
        inList = false;
        listType = null;
      }
    };
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      // Handle code blocks (```)
      if (line.trim().startsWith('```')) {
        closeList();
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBlockContent = [];
        } else {
          inCodeBlock = false;
          const code = codeBlockContent.join('\n')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
          processedLines.push(`<pre class="bg-muted/50 border border-border rounded-lg p-4 my-3 overflow-x-auto"><code class="text-sm font-mono text-primary whitespace-pre-wrap">${code}</code></pre>`);
        }
        continue;
      }
      
      if (inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }
      
      // Empty lines
      if (line.trim() === '') {
        closeList();
        processedLines.push('<div class="h-3"></div>');
        continue;
      }
      
      // Headers - must check from H6 to H1
      const h6Match = line.match(/^######\s+(.+)$/);
      if (h6Match) {
        closeList();
        processedLines.push(`<h6 class="text-sm font-semibold text-muted-foreground mb-1 mt-2">${formatInline(h6Match[1])}</h6>`);
        continue;
      }
      
      const h5Match = line.match(/^#####\s+(.+)$/);
      if (h5Match) {
        closeList();
        processedLines.push(`<h5 class="text-base font-semibold text-foreground mb-1 mt-2">${formatInline(h5Match[1])}</h5>`);
        continue;
      }
      
      const h4Match = line.match(/^####\s+(.+)$/);
      if (h4Match) {
        closeList();
        processedLines.push(`<h4 class="text-lg font-semibold text-foreground mb-2 mt-3">${formatInline(h4Match[1])}</h4>`);
        continue;
      }
      
      const h3Match = line.match(/^###\s+(.+)$/);
      if (h3Match) {
        closeList();
        processedLines.push(`<h3 class="text-xl font-bold text-foreground mb-2 mt-4">${formatInline(h3Match[1])}</h3>`);
        continue;
      }
      
      const h2Match = line.match(/^##\s+(.+)$/);
      if (h2Match) {
        closeList();
        processedLines.push(`<h2 class="text-2xl font-bold text-foreground border-b border-border/50 pb-2 mb-3 mt-5">${formatInline(h2Match[1])}</h2>`);
        continue;
      }
      
      const h1Match = line.match(/^#\s+(.+)$/);
      if (h1Match) {
        closeList();
        processedLines.push(`<h1 class="text-3xl font-bold text-foreground border-b border-border pb-2 mb-4 mt-6">${formatInline(h1Match[1])}</h1>`);
        continue;
      }
      
      // Blockquotes
      const blockquoteMatch = line.match(/^>\s*(.*)$/);
      if (blockquoteMatch) {
        closeList();
        processedLines.push(`<blockquote class="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-2 bg-muted/30 py-2 rounded-r">${formatInline(blockquoteMatch[1])}</blockquote>`);
        continue;
      }
      
      // Horizontal rules
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
        closeList();
        processedLines.push('<hr class="border-border my-6" />');
        continue;
      }
      
      // Checkbox lists (must check before regular lists)
      const uncheckedMatch = line.match(/^[-*]\s+\[\s?\]\s+(.+)$/);
      if (uncheckedMatch) {
        if (!inList || listType !== 'ul') {
          closeList();
          processedLines.push('<ul class="my-2 space-y-1">');
          inList = true;
          listType = 'ul';
        }
        processedLines.push(`<li class="flex items-center gap-2 ml-2"><span class="w-4 h-4 border border-border rounded inline-block flex-shrink-0"></span><span class="text-foreground">${formatInline(uncheckedMatch[1])}</span></li>`);
        continue;
      }
      
      const checkedMatch = line.match(/^[-*]\s+\[[xX]\]\s+(.+)$/);
      if (checkedMatch) {
        if (!inList || listType !== 'ul') {
          closeList();
          processedLines.push('<ul class="my-2 space-y-1">');
          inList = true;
          listType = 'ul';
        }
        processedLines.push(`<li class="flex items-center gap-2 ml-2"><span class="w-4 h-4 bg-primary rounded inline-flex items-center justify-center text-xs text-primary-foreground flex-shrink-0">✓</span><span class="text-muted-foreground line-through">${formatInline(checkedMatch[1])}</span></li>`);
        continue;
      }
      
      // Unordered lists (- or * or +)
      const ulMatch = line.match(/^[-*+]\s+(.+)$/);
      if (ulMatch) {
        if (!inList || listType !== 'ul') {
          closeList();
          processedLines.push('<ul class="my-2 space-y-1">');
          inList = true;
          listType = 'ul';
        }
        processedLines.push(`<li class="text-foreground ml-5 list-disc">${formatInline(ulMatch[1])}</li>`);
        continue;
      }
      
      // Ordered lists
      const olMatch = line.match(/^\d+\.\s+(.+)$/);
      if (olMatch) {
        if (!inList || listType !== 'ol') {
          closeList();
          processedLines.push('<ol class="my-2 space-y-1">');
          inList = true;
          listType = 'ol';
        }
        processedLines.push(`<li class="text-foreground ml-5 list-decimal">${formatInline(olMatch[1])}</li>`);
        continue;
      }
      
      // Regular paragraph
      closeList();
      processedLines.push(`<p class="text-foreground leading-relaxed mb-2">${formatInline(line)}</p>`);
    }
    
    // Close any open list at the end
    closeList();
    
    return processedLines.join('\n');
  };
  
  const formatInline = (text: string): string => {
    // Escape HTML first
    let result = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Process inline formatting in order of specificity
    result = result
      // Inline code first (to protect content inside)
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary">$1</code>')
      // Bold and Italic combined (***text*** or ___text___)
      .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong class="font-bold"><em class="italic">$1</em></strong>')
      .replace(/___([^_]+)___/g, '<strong class="font-bold"><em class="italic">$1</em></strong>')
      // Bold (**text** or __text__)
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>')
      .replace(/__([^_]+)__/g, '<strong class="font-bold text-foreground">$1</strong>')
      // Italic (*text* or _text_) - be careful not to match inside words
      .replace(/\*([^*\s][^*]*[^*\s])\*/g, '<em class="italic">$1</em>')
      .replace(/\*([^*\s])\*/g, '<em class="italic">$1</em>')
      .replace(/(?<![a-zA-Z])_([^_\s][^_]*[^_\s])_(?![a-zA-Z])/g, '<em class="italic">$1</em>')
      .replace(/(?<![a-zA-Z])_([^_\s])_(?![a-zA-Z])/g, '<em class="italic">$1</em>')
      // Strikethrough (~~text~~)
      .replace(/~~([^~]+)~~/g, '<del class="line-through text-muted-foreground">$1</del>')
      // Links [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary/80 underline underline-offset-2">$1</a>')
      // Highlight (==text==)
      .replace(/==([^=]+)==/g, '<mark class="bg-accent/30 px-1 rounded">$1</mark>')
      // Internal links [[text]]
      .replace(/\[\[([^\]]+)\]\]/g, '<span class="text-primary bg-primary/10 px-1 rounded cursor-pointer hover:bg-primary/20">$1</span>');
    
    return result;
  };

  return (
    <div 
      className={cn("prose prose-invert max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content || '') }}
    />
  );
};