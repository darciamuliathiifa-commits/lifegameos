import { useState, useEffect } from 'react';
import { Package, Plus, Trash2, Search, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface InventoryItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  quantity: number;
  location: string | null;
  image_url: string | null;
}

const categories = ['electronics', 'clothing', 'books', 'furniture', 'kitchen', 'documents', 'collectibles', 'other'];

export const InventoryPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState({
    name: '', description: '', category: 'other', quantity: '1', location: ''
  });

  useEffect(() => {
    if (user) fetchItems();
  }, [user]);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setItems(data);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!user || !form.name.trim()) return;

    const itemData = {
      name: form.name,
      description: form.description || null,
      category: form.category,
      quantity: parseInt(form.quantity) || 1,
      location: form.location || null,
    };

    if (editingItem) {
      const { error } = await supabase
        .from('inventory_items')
        .update(itemData)
        .eq('id', editingItem.id);

      if (!error) {
        toast.success('Item updated!');
        fetchItems();
      }
    } else {
      const { error } = await supabase
        .from('inventory_items')
        .insert({ user_id: user.id, ...itemData });

      if (!error) {
        toast.success('Item added!');
        fetchItems();
      }
    }

    setIsDialogOpen(false);
    setEditingItem(null);
    setForm({ name: '', description: '', category: 'other', quantity: '1', location: '' });
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from('inventory_items').delete().eq('id', id);
    if (!error) {
      toast.success('Item deleted');
      fetchItems();
    }
  };

  const openEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      description: item.description || '',
      category: item.category,
      quantity: item.quantity.toString(),
      location: item.location || ''
    });
    setIsDialogOpen(true);
  };

  const filteredItems = items.filter(i =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryStats = categories.map(c => ({
    name: c,
    count: items.filter(i => i.category === c).length
  })).filter(c => c.count > 0);

  return (
    <div className="space-y-4 md:space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl md:text-3xl font-display text-foreground flex items-center gap-2 md:gap-3">
          <Package className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          Inventory
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingItem(null);
            setForm({ name: '', description: '', category: 'other', quantity: '1', location: '' });
          }
        }}>
          <DialogTrigger asChild>
            <Button variant="gaming" size="sm" className="gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base md:text-lg">{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 md:space-y-4 pt-3 md:pt-4">
              <Input
                placeholder="Item name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="text-sm"
              />
              <Textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="text-sm"
                rows={2}
              />
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="text-sm"
                />
                <Input
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)} className="flex-1">Cancel</Button>
                <Button variant="gaming" size="sm" onClick={handleSubmit} className="flex-1">
                  {editingItem ? 'Update' : 'Add'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="flex gap-2 flex-wrap">
        <div className="card-gaming rounded-lg px-3 py-1.5 md:px-4 md:py-2">
          <span className="text-xs md:text-sm text-muted-foreground font-body">Total: </span>
          <span className="font-display text-sm md:text-base text-primary">{items.length}</span>
        </div>
        {categoryStats.slice(0, 3).map(c => (
          <div key={c.name} className="card-gaming rounded-lg px-3 py-1.5 md:px-4 md:py-2">
            <span className="text-xs md:text-sm text-muted-foreground font-body capitalize">{c.name}: </span>
            <span className="font-display text-sm md:text-base text-foreground">{c.count}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 text-sm"
        />
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="card-gaming rounded-lg md:rounded-xl p-3 md:p-4 space-y-2 md:space-y-3 group">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-sm md:text-base text-foreground truncate">{item.name}</h3>
                <p className="text-[10px] md:text-xs text-primary capitalize">{item.category}</p>
              </div>
              <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(item)} className="p-1.5 hover:text-primary">
                  <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
                <button onClick={() => deleteItem(item.id)} className="p-1.5 hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              </div>
            </div>
            {item.description && (
              <p className="text-xs md:text-sm text-muted-foreground font-body line-clamp-2">{item.description}</p>
            )}
            <div className="flex justify-between text-xs md:text-sm font-body">
              <span className="text-muted-foreground">Qty: <span className="text-foreground">{item.quantity}</span></span>
              {item.location && (
                <span className="text-muted-foreground truncate ml-2">📍 {item.location}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && !loading && (
        <div className="text-center py-8 md:py-12 text-muted-foreground font-body text-sm">
          No items yet. Add your first inventory item!
        </div>
      )}
    </div>
  );
};
