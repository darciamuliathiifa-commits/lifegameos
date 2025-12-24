import { X, Pin, Trash2, Edit2, Calendar, Tag } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Note {
  id: string;
  title: string;
  content: string | null;
  category: string;
  is_pinned: boolean;
  created_at: string;
}

interface NoteDetailSheetProps {
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (note: Note) => void;
}

export const NoteDetailSheet = ({
  note,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onTogglePin
}: NoteDetailSheetProps) => {
  if (!note) return null;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      planner: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      meal: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      bookshelf: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      goals: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      habits: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      travel: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      movies: 'bg-red-500/20 text-red-400 border-red-500/30',
      vision: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      journal: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      workout: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      finance: 'bg-green-500/20 text-green-400 border-green-500/30',
      health: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
      general: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[category] || colors.general;
  };

  // Parse markdown-like content
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-display text-foreground mt-6 mb-3 first:mt-0">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg font-display text-foreground/90 mt-4 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      }
      // Checkbox items
      if (line.startsWith('- [ ] ')) {
        return (
          <div key={index} className="flex items-center gap-2 py-1 text-muted-foreground">
            <div className="w-4 h-4 rounded border border-border/60" />
            <span className="font-body">{line.replace('- [ ] ', '')}</span>
          </div>
        );
      }
      if (line.startsWith('- [x] ')) {
        return (
          <div key={index} className="flex items-center gap-2 py-1 text-muted-foreground line-through">
            <div className="w-4 h-4 rounded bg-primary/20 border border-primary/40 flex items-center justify-center">
              <span className="text-xs text-primary">✓</span>
            </div>
            <span className="font-body">{line.replace('- [x] ', '')}</span>
          </div>
        );
      }
      // Regular list items
      if (line.startsWith('- ')) {
        return (
          <div key={index} className="flex items-start gap-2 py-0.5">
            <span className="text-primary mt-1">•</span>
            <span className="font-body text-foreground/80">{line.replace('- ', '')}</span>
          </div>
        );
      }
      // Empty lines
      if (line.trim() === '') {
        return <div key={index} className="h-2" />;
      }
      // Regular text
      return (
        <p key={index} className="font-body text-foreground/80 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-2xl font-display text-foreground text-left line-clamp-2">
                {note.title}
              </SheetTitle>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <Badge variant="outline" className={cn("text-xs", getCategoryColor(note.category))}>
                  <Tag className="w-3 h-3 mr-1" />
                  {note.category}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(note.created_at), 'PPP')}
                </span>
                {note.is_pinned && (
                  <Badge variant="secondary" className="text-xs bg-accent/20 text-accent">
                    <Pin className="w-3 h-3 mr-1 fill-current" /> Pinned
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Actions */}
        <div className="flex items-center gap-2 py-4 border-b border-border">
          <Button variant="outline" size="sm" onClick={() => onEdit(note)} className="gap-2">
            <Edit2 className="w-4 h-4" /> Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onTogglePin(note)}
            className={cn("gap-2", note.is_pinned && "bg-accent/20 text-accent border-accent/30")}
          >
            <Pin className={cn("w-4 h-4", note.is_pinned && "fill-current")} />
            {note.is_pinned ? 'Unpin' : 'Pin'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              onDelete(note.id);
              onOpenChange(false);
            }} 
            className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
        </div>

        {/* Content */}
        <div className="py-6">
          {note.content ? (
            <div className="prose prose-invert max-w-none">
              {renderContent(note.content)}
            </div>
          ) : (
            <p className="text-muted-foreground font-body italic">No content yet. Click edit to add content.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
