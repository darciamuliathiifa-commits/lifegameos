import { useState, useEffect } from 'react';
import { Plus, Pyramid, BookOpen, Video, Users, Lightbulb, Calendar, FileText, Sparkles, Target, Eye, Heart, Utensils, Plane, Dumbbell, BookMarked, Film, Wallet, Loader2, Trash2, Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { NoteDetailSheet } from '@/components/notes/NoteDetailSheet';

interface Note {
  id: string;
  title: string;
  content: string | null;
  category: string | null;
  is_pinned: boolean | null;
  created_at: string;
  updated_at: string;
}

interface QuickMenuItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  defaultContent: string;
}

const quickMenuItems: QuickMenuItem[] = [
  { name: 'Planner', icon: Calendar, category: 'planner', defaultContent: '## Planner\n\n### Today\'s Tasks\n- [ ] Task 1\n- [ ] Task 2\n- [ ] Task 3\n\n### Schedule\n- 08:00 - Morning routine\n- 09:00 - Work\n- 12:00 - Lunch\n- 13:00 - Work\n- 18:00 - Evening' },
  { name: 'Meal Planner', icon: Utensils, category: 'meal', defaultContent: '## Meal Planner\n\n### Breakfast\n- \n\n### Lunch\n- \n\n### Dinner\n- \n\n### Snacks\n- ' },
  { name: 'Bookshelf', icon: BookMarked, category: 'bookshelf', defaultContent: '## My Bookshelf\n\n### Currently Reading\n- \n\n### Want to Read\n- \n\n### Finished\n- ' },
  { name: 'Goals', icon: Target, category: 'goals', defaultContent: '## Goals\n\n### Short Term Goals\n- [ ] \n\n### Long Term Goals\n- [ ] \n\n### Progress Notes\n- ' },
  { name: 'Habits', icon: Heart, category: 'habits', defaultContent: '## Habits Tracker\n\n### Daily Habits\n- [ ] Exercise\n- [ ] Read\n- [ ] Meditate\n- [ ] Drink water\n\n### Weekly Review\n- ' },
  { name: 'Travel Planner', icon: Plane, category: 'travel', defaultContent: '## Travel Planner\n\n### Destination\n- \n\n### Dates\n- \n\n### Packing List\n- [ ] Passport\n- [ ] Tickets\n- [ ] Clothes\n\n### Itinerary\n- ' },
  { name: 'Movies & Series', icon: Film, category: 'movies', defaultContent: '## Movies & Series\n\n### Watching\n- \n\n### Want to Watch\n- \n\n### Watched\n- ' },
  { name: 'Vision', icon: Eye, category: 'vision', defaultContent: '## Vision Board\n\n### My Vision\n- \n\n### Dreams & Aspirations\n- \n\n### Inspiration\n- ' },
  { name: 'Journal', icon: FileText, category: 'journal', defaultContent: '## Journal Entry\n\n### Date: ' + new Date().toLocaleDateString() + '\n\n### Thoughts\n- \n\n### Gratitude\n- \n\n### Reflections\n- ' },
  { name: 'Workout Planner', icon: Dumbbell, category: 'workout', defaultContent: '## Workout Planner\n\n### Today\'s Workout\n- [ ] Warm up\n- [ ] Cardio\n- [ ] Strength\n- [ ] Cool down\n\n### Weekly Schedule\n- Monday: \n- Tuesday: \n- Wednesday: \n- Thursday: \n- Friday: ' },
  { name: 'Finance', icon: Wallet, category: 'finance', defaultContent: '## Finance Tracker\n\n### Income\n- \n\n### Expenses\n- \n\n### Savings Goals\n- \n\n### Notes\n- ' },
  { name: 'Health', icon: Heart, category: 'health', defaultContent: '## Health Tracker\n\n### Daily Health Log\n- Sleep: hours\n- Water: glasses\n- Exercise: \n- Mood: \n\n### Notes\n- ' },
];

const quickLinks = [
  { name: 'AI Courses', icon: BookOpen },
  { name: 'Webinars', icon: Video },
  { name: 'Community Forum', icon: Users },
  { name: 'AI Ideas', icon: Lightbulb },
  { name: 'Events Calendar', icon: Calendar },
];

const getCategoryColor = (category: string | null) => {
  const colors: Record<string, string> = {
    planner: 'from-blue-500 to-blue-600',
    meal: 'from-orange-500 to-orange-600',
    bookshelf: 'from-purple-500 to-purple-600',
    goals: 'from-emerald-500 to-emerald-600',
    habits: 'from-pink-500 to-pink-600',
    travel: 'from-cyan-500 to-cyan-600',
    movies: 'from-red-500 to-red-600',
    vision: 'from-indigo-500 to-indigo-600',
    journal: 'from-amber-500 to-amber-600',
    workout: 'from-rose-500 to-rose-600',
    finance: 'from-green-500 to-green-600',
    health: 'from-teal-500 to-teal-600',
    aigypt: 'from-amber-500 to-orange-600',
  };
  return colors[category || 'aigypt'] || 'from-amber-500 to-orange-600';
};

export const AIGYPTSpacePage = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('updated_at', { ascending: false });

    if (data) setNotes(data);
    setIsLoading(false);
  };

  const createNoteFromMenu = async (menuItem: QuickMenuItem) => {
    if (!user) {
      toast.error('Please login first');
      return;
    }

    setIsCreating(menuItem.name);

    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: user.id,
        title: `${menuItem.name} - AIGYPT`,
        content: menuItem.defaultContent,
        category: menuItem.category,
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to create note');
    } else {
      toast.success(`${menuItem.name} note created!`);
      fetchNotes();
      if (data) {
        setSelectedNote(data);
        setIsDetailOpen(true);
      }
    }
    
    setIsCreating(null);
  };

  const createNewNote = async () => {
    if (!user) {
      toast.error('Please login first');
      return;
    }

    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: user.id,
        title: 'New AIGYPT Note',
        content: '## New Note\n\nStart writing here...',
        category: 'aigypt',
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to create note');
    } else {
      toast.success('Note created!');
      fetchNotes();
      if (data) {
        setSelectedNote(data);
        setIsDetailOpen(true);
      }
    }
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setIsDetailOpen(true);
  };

  const handleNoteUpdate = () => {
    fetchNotes();
  };

  const handleDeleteNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);

    if (error) {
      toast.error('Failed to delete note');
    } else {
      toast.success('Note deleted');
      fetchNotes();
    }
  };

  const togglePin = async (noteId: string, isPinned: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const { error } = await supabase
      .from('notes')
      .update({ is_pinned: !isPinned })
      .eq('id', noteId);

    if (error) {
      toast.error('Failed to update note');
    } else {
      fetchNotes();
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
            <Pyramid className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display text-foreground flex items-center gap-2">
              AIGYPT Space <Sparkles className="w-6 h-6 text-secondary" />
            </h1>
          </div>
        </div>
        
        <p className="text-muted-foreground font-body text-sm md:text-base">
          <span className="text-secondary font-semibold">AIGYPT</span> - Komunitas AI Indonesia di Mesir.{' '}
          Belajar, Berbagi, dan Berkembang bersama di era Artificial Intelligence!
        </p>
        
        <div className="flex items-center gap-2 text-sm font-body">
          <div className="w-1 h-6 bg-secondary rounded-full" />
          <span className="italic text-muted-foreground">Empowering Indonesian Students with AI! 🚀</span>
        </div>
      </div>

      {/* Quick Menu Grid */}
      <Card className="bg-secondary/5 border-secondary/20">
        <CardContent className="py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {quickMenuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => createNoteFromMenu(item)}
                  disabled={isCreating === item.name}
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-secondary/10 transition-colors text-left group disabled:opacity-50"
                >
                  <IconComponent className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-body text-muted-foreground group-hover:text-foreground transition-colors">
                    {isCreating === item.name ? 'Creating...' : item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Quick Links Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardContent className="pt-5">
              <h3 className="text-secondary font-display font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <button className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors group w-full text-left">
                      <span className="text-primary">•</span>
                      <span className="group-hover:underline">{link.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {/* Logo Card */}
          <Card className="overflow-hidden">
            <div className="aspect-square bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center p-8">
              <div className="w-full h-full rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <Pyramid className="w-24 h-24 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Notes Cards Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display text-foreground">AIGYPT Notes</h2>
            <Button variant="adventure" size="sm" className="gap-2" onClick={createNewNote}>
              <Plus className="w-4 h-4" /> New Note
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : notes.length === 0 ? (
            <Card className="border-dashed border-2 border-border/50 bg-transparent">
              <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mb-4 text-muted-foreground/50" />
                <p className="text-center mb-4">No notes yet. Create your first note!</p>
                <Button variant="outline" onClick={createNewNote}>
                  <Plus className="w-4 h-4 mr-2" /> Create Note
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {notes.map((note) => (
                <Card 
                  key={note.id} 
                  className="overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform group"
                  onClick={() => handleNoteClick(note)}
                >
                  {/* Colored Header */}
                  <div className={cn(
                    "p-4 bg-gradient-to-br text-white relative",
                    getCategoryColor(note.category)
                  )}>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => togglePin(note.id, note.is_pinned || false, e)}
                        className="p-1 rounded hover:bg-white/20"
                      >
                        <Pin className={cn("w-4 h-4", note.is_pinned && "fill-current")} />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteNote(note.id, e)}
                        className="p-1 rounded hover:bg-white/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mb-2 opacity-80">
                      <Pyramid className="w-4 h-4" />
                      <span className="text-xs font-body">aigypt</span>
                      {note.is_pinned && <Pin className="w-3 h-3 fill-current" />}
                    </div>
                    <h3 className="font-display font-bold text-lg leading-tight line-clamp-2">{note.title}</h3>
                    <p className="text-xs opacity-80 mt-1 font-body capitalize">{note.category || 'General'}</p>
                  </div>
                  
                  {/* Content Preview */}
                  <CardContent className="pt-4">
                    <p className="text-sm font-body text-muted-foreground line-clamp-3">
                      {note.content?.replace(/[#*\[\]]/g, '').substring(0, 100) || 'No content'}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-2">
                      {new Date(note.updated_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}

              {/* New Note Card */}
              <Card 
                className="border-dashed border-2 border-border/50 bg-transparent hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={createNewNote}
              >
                <CardContent className="h-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Plus className="w-8 h-8 mb-2" />
                  <span className="text-sm font-body">New note</span>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Note Detail Sheet */}
      <NoteDetailSheet
        note={selectedNote}
        open={isDetailOpen}
        onOpenChange={(open) => {
          setIsDetailOpen(open);
          if (!open) setSelectedNote(null);
        }}
        onEdit={() => {}}
        onDelete={async (id) => {
          await supabase.from('notes').delete().eq('id', id);
          fetchNotes();
          setIsDetailOpen(false);
        }}
        onTogglePin={async (note) => {
          await supabase.from('notes').update({ is_pinned: !note.is_pinned }).eq('id', note.id);
          fetchNotes();
        }}
      />
    </div>
  );
};