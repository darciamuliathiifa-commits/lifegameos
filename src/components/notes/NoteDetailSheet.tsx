import { useState, useEffect } from 'react';
import { Pin, Trash2, Calendar, Tag, Save, Eye, Edit3 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MarkdownRenderer } from './MarkdownRenderer';

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
  onDelete: (id: string) => void;
  onTogglePin: (note: Note) => void;
  onNoteUpdated?: () => void;
}

export const NoteDetailSheet = ({
  note,
  open,
  onOpenChange,
  onDelete,
  onTogglePin,
  onNoteUpdated
}: NoteDetailSheetProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || '');
      setHasChanges(false);
      setIsPreviewMode(false);
    }
  }, [note]);

  if (!note) return null;

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setHasChanges(true);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    setHasChanges(true);
  };

  const saveChanges = async () => {
    if (!hasChanges) return;
    
    setIsSaving(true);
    const { error } = await supabase
      .from('notes')
      .update({ title, content, updated_at: new Date().toISOString() })
      .eq('id', note.id);

    if (error) {
      toast.error('Failed to save changes');
    } else {
      toast.success('Note saved');
      setHasChanges(false);
      onNoteUpdated?.();
    }
    setIsSaving(false);
  };

  const handleClose = async (isOpen: boolean) => {
    if (!isOpen && hasChanges) {
      await saveChanges();
    }
    onOpenChange(isOpen);
  };

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
      aigypt: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      temantiket: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    };
    return colors[category] || colors.general;
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <Input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="text-2xl font-display text-foreground border-none px-0 focus-visible:ring-0 bg-transparent"
                placeholder="Note title"
              />
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
        <div className="flex items-center gap-2 py-4 border-b border-border flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={saveChanges}
            disabled={!hasChanges || isSaving}
            className={cn("gap-2", hasChanges && "bg-primary/20 text-primary border-primary/30")}
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Menyimpan...' : hasChanges ? 'Simpan' : 'Tersimpan'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={cn("gap-2", isPreviewMode && "bg-primary/20 text-primary border-primary/30")}
          >
            {isPreviewMode ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onTogglePin(note)}
            className={cn("gap-2", note.is_pinned && "bg-accent/20 text-accent border-accent/30")}
          >
            <Pin className={cn("w-4 h-4", note.is_pinned && "fill-current")} />
            {note.is_pinned ? 'Lepas Pin' : 'Pin'}
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
            <Trash2 className="w-4 h-4" /> Hapus
          </Button>
        </div>

        {/* Markdown Tips */}
        {!isPreviewMode && (
          <div className="py-2 px-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
            <span className="font-semibold">Tips Markdown:</span> # Heading 1, ## Heading 2, **bold**, *italic*, - list, `code`
          </div>
        )}

        {/* Content Area */}
        <div className="py-4">
          {isPreviewMode ? (
            <div className="min-h-[400px] p-4 bg-muted/20 rounded-lg">
              <MarkdownRenderer content={content} />
            </div>
          ) : (
            <Textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Mulai menulis catatan... (Markdown didukung: # Heading, **bold**, *italic*, dll)"
              className="min-h-[400px] font-mono text-sm border-none focus-visible:ring-0 bg-transparent resize-none"
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};