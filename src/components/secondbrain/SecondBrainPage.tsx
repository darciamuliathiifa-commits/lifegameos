import { useState, useEffect } from 'react';
import { Brain, Plus, Trash2, FolderOpen, FolderArchive, Lightbulb, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SecondBrainItem {
  id: string;
  title: string;
  content: string | null;
  type: 'project' | 'area' | 'resource' | 'archive';
  status: string;
  created_at: string;
}

const typeConfig = {
  project: { icon: Briefcase, color: 'text-primary', label: 'Projects' },
  area: { icon: FolderOpen, color: 'text-secondary', label: 'Areas' },
  resource: { icon: Lightbulb, color: 'text-accent', label: 'Resources' },
  archive: { icon: FolderArchive, color: 'text-muted-foreground', label: 'Archives' },
};

const statusOptions = ['not_started', 'in_progress', 'completed', 'on_hold'];

export const SecondBrainPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<SecondBrainItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'project' | 'area' | 'resource' | 'archive'>('project');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    title: '', content: '', type: 'project' as const, status: 'not_started'
  });

  useEffect(() => {
    if (user) fetchItems();
  }, [user]);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('second_brain_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setItems(data as SecondBrainItem[]);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!user || !form.title.trim()) return;

    const { error } = await supabase
      .from('second_brain_items')
      .insert({
        user_id: user.id,
        title: form.title,
        content: form.content || null,
        type: form.type,
        status: form.status,
      });

    if (!error) {
      toast.success('Item added!');
      fetchItems();
      setIsDialogOpen(false);
      setForm({ title: '', content: '', type: 'project', status: 'not_started' });
    }
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from('second_brain_items').delete().eq('id', id);
    if (!error) {
      toast.success('Item deleted');
      fetchItems();
    }
  };

  const moveToArchive = async (item: SecondBrainItem) => {
    const { error } = await supabase
      .from('second_brain_items')
      .update({ type: 'archive' })
      .eq('id', item.id);

    if (!error) {
      toast.success('Moved to archive');
      fetchItems();
    }
  };

  const filteredItems = items.filter(i => i.type === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'text-accent';
      case 'completed': return 'text-success';
      case 'on_hold': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary" />
          Second Brain
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gaming" className="gap-2">
              <Plus className="w-4 h-4" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add to Second Brain</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <Textarea
                placeholder="Content / Notes"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={4}
              />
              <Select 
                value={form.type} 
                onValueChange={(v) => setForm({ ...form, type: v as 'project' | 'area' | 'resource' | 'archive' })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                  <SelectItem value="resource">Resource</SelectItem>
                  <SelectItem value="archive">Archive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statusOptions.map(s => (
                    <SelectItem key={s} value={s}>
                      {s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button variant="gaming" onClick={handleSubmit}>Add</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* PARA Explanation */}
      <div className="card-gaming rounded-xl p-4">
        <p className="text-sm text-muted-foreground font-body">
          <span className="text-primary font-display">PARA Method:</span>{' '}
          <span className="text-foreground">Projects</span> (actionable with deadlines) → {' '}
          <span className="text-foreground">Areas</span> (ongoing responsibilities) → {' '}
          <span className="text-foreground">Resources</span> (topics of interest) → {' '}
          <span className="text-foreground">Archives</span> (inactive items)
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          {(['project', 'area', 'resource', 'archive'] as const).map((type) => {
            const config = typeConfig[type];
            const count = items.filter(i => i.type === type).length;
            return (
              <TabsTrigger key={type} value={type} className="gap-2">
                <config.icon className={cn("w-4 h-4", config.color)} />
                <span className="hidden sm:inline">{config.label}</span>
                <span className="text-xs text-muted-foreground">({count})</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {(['project', 'area', 'resource', 'archive'] as const).map((type) => (
          <TabsContent key={type} value={type} className="mt-6">
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div key={item.id} className="card-gaming rounded-xl p-4 group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-foreground">{item.title}</h3>
                        <span className={cn("text-xs capitalize font-body", getStatusColor(item.status))}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                      {item.content && (
                        <p className="text-sm text-muted-foreground font-body mt-1 line-clamp-2">
                          {item.content}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground/70 font-body mt-2">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {type !== 'archive' && (
                        <button 
                          onClick={() => moveToArchive(item)} 
                          className="p-1 hover:text-muted-foreground"
                          title="Move to Archive"
                        >
                          <FolderArchive className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => deleteItem(item.id)} className="p-1 hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredItems.length === 0 && !loading && (
                <div className="text-center py-12 text-muted-foreground font-body">
                  No {type}s yet. Add your first one!
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
