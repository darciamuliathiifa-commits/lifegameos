import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = ({ content, className }: MarkdownRendererProps) => {
  return (
    <div className={cn("prose prose-invert max-w-none", className)}>
      <ReactMarkdown
        components={{
        h1: ({ children }) => (
          <h1 className="text-3xl font-display text-foreground border-b border-border pb-2 mb-4 mt-6 first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-display text-foreground border-b border-border/50 pb-2 mb-3 mt-5">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-display text-foreground mb-2 mt-4">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-lg font-display text-foreground mb-2 mt-3">
            {children}
          </h4>
        ),
        h5: ({ children }) => (
          <h5 className="text-base font-display text-foreground mb-1 mt-2">
            {children}
          </h5>
        ),
        h6: ({ children }) => (
          <h6 className="text-sm font-display text-muted-foreground mb-1 mt-2">
            {children}
          </h6>
        ),
        p: ({ children }) => (
          <p className="text-foreground font-body leading-relaxed mb-3">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-1 mb-3 text-foreground font-body ml-2">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-1 mb-3 text-foreground font-body ml-2">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-foreground font-body">
            {children}
          </li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-4 bg-muted/30 py-2 rounded-r">
            {children}
          </blockquote>
        ),
        code: ({ children, className }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary">
                {children}
              </code>
            );
          }
          return (
            <code className="block bg-muted p-4 rounded-lg text-sm font-mono text-foreground overflow-x-auto my-3">
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="bg-muted rounded-lg overflow-x-auto my-3">
            {children}
          </pre>
        ),
        a: ({ children, href }) => (
          <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 underline underline-offset-2"
          >
            {children}
          </a>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">
            {children}
          </strong>
        ),
        em: ({ children }) => (
          <em className="italic text-foreground">
            {children}
          </em>
        ),
        hr: () => (
          <hr className="border-border my-6" />
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="w-full border-collapse border border-border rounded-lg">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-muted">
            {children}
          </thead>
        ),
        th: ({ children }) => (
          <th className="border border-border px-4 py-2 text-left font-display text-foreground">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-border px-4 py-2 font-body text-foreground">
            {children}
          </td>
        ),
        img: ({ src, alt }) => (
          <img 
            src={src} 
            alt={alt || ''} 
            className="max-w-full h-auto rounded-lg my-4"
          />
        ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};