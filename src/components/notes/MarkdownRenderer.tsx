import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = ({ content, className }: MarkdownRendererProps) => {
  // Simple markdown parser without external dependencies
  const parseMarkdown = (text: string): string => {
    let html = text
      // Escape HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Headers
      .replace(/^###### (.+)$/gm, '<h6 class="text-sm font-display text-muted-foreground mb-1 mt-2">$1</h6>')
      .replace(/^##### (.+)$/gm, '<h5 class="text-base font-display text-foreground mb-1 mt-2">$1</h5>')
      .replace(/^#### (.+)$/gm, '<h4 class="text-lg font-display text-foreground mb-2 mt-3">$1</h4>')
      .replace(/^### (.+)$/gm, '<h3 class="text-xl font-display text-foreground mb-2 mt-4">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-display text-foreground border-b border-border/50 pb-2 mb-3 mt-5">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-display text-foreground border-b border-border pb-2 mb-4 mt-6">$1</h1>')
      // Bold and Italic
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="font-semibold"><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic text-foreground">$1</em>')
      .replace(/___(.+?)___/g, '<strong class="font-semibold"><em>$1</em></strong>')
      .replace(/__(.+?)__/g, '<strong class="font-semibold text-foreground">$1</strong>')
      .replace(/_(.+?)_/g, '<em class="italic text-foreground">$1</em>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary">$1</code>')
      // Blockquotes
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-2 bg-muted/30 py-2 rounded-r">$1</blockquote>')
      // Horizontal rules
      .replace(/^---$/gm, '<hr class="border-border my-6" />')
      .replace(/^\*\*\*$/gm, '<hr class="border-border my-6" />')
      // Unordered lists
      .replace(/^[\-\*] (.+)$/gm, '<li class="text-foreground font-body ml-4 list-disc">$1</li>')
      // Ordered lists
      .replace(/^\d+\. (.+)$/gm, '<li class="text-foreground font-body ml-4 list-decimal">$1</li>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary/80 underline underline-offset-2">$1</a>')
      // Paragraphs (wrap remaining text)
      .replace(/^(?!<[hblaopu]|<hr|<code|<strong|<em)(.+)$/gm, '<p class="text-foreground font-body leading-relaxed mb-3">$1</p>')
      // Clean up empty paragraphs
      .replace(/<p class="[^"]*"><\/p>/g, '')
      // Wrap consecutive list items
      .replace(/(<li[^>]*>.*?<\/li>\n?)+/g, '<ul class="list-disc list-inside space-y-1 mb-3 text-foreground font-body ml-2">$&</ul>');

    return html;
  };

  return (
    <div 
      className={cn("prose prose-invert max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
};