import { useState, useEffect } from 'react';
import { Wallet, Plus, TrendingUp, TrendingDown, DollarSign, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  notes: string | null;
}

const categories = ['food', 'transport', 'entertainment', 'bills', 'shopping', 'salary', 'freelance', 'other'];

export const FinancePage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    title: '', amount: '', type: 'expense' as 'income' | 'expense',
    category: 'other', date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('finance_transactions')
      .select('*')
      .order('date', { ascending: false });

    if (!error && data) setTransactions(data as Transaction[]);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!user || !form.title.trim() || !form.amount) return;

    const { error } = await supabase
      .from('finance_transactions')
      .insert({
        user_id: user.id,
        title: form.title,
        amount: parseFloat(form.amount),
        type: form.type,
        category: form.category,
        date: form.date,
      });

    if (!error) {
      toast.success('Transaction added!');
      fetchTransactions();
      setIsDialogOpen(false);
      setForm({ title: '', amount: '', type: 'expense', category: 'other', date: new Date().toISOString().split('T')[0] });
    }
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase.from('finance_transactions').delete().eq('id', id);
    if (!error) {
      toast.success('Transaction deleted');
      fetchTransactions();
    }
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
          <Wallet className="w-8 h-8 text-primary" />
          Finance Manager
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gaming" className="gap-2">
              <Plus className="w-4 h-4" /> Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Transaction</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Transaction title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
              <Select value={form.type} onValueChange={(v: 'income' | 'expense') => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button variant="gaming" onClick={handleSubmit}>Add</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card-gaming rounded-xl p-4">
          <div className="flex items-center gap-2 text-success mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-body">Income</span>
          </div>
          <p className="text-2xl font-display text-success">Rp {totalIncome.toLocaleString()}</p>
        </div>
        <div className="card-gaming rounded-xl p-4">
          <div className="flex items-center gap-2 text-destructive mb-2">
            <TrendingDown className="w-5 h-5" />
            <span className="text-sm font-body">Expense</span>
          </div>
          <p className="text-2xl font-display text-destructive">Rp {totalExpense.toLocaleString()}</p>
        </div>
        <div className="card-gaming rounded-xl p-4">
          <div className="flex items-center gap-2 text-primary mb-2">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-body">Balance</span>
          </div>
          <p className={cn("text-2xl font-display", balance >= 0 ? "text-success" : "text-destructive")}>
            Rp {balance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Transactions */}
      <div className="card-gaming rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/30">
            <tr className="text-left text-xs text-muted-foreground font-body uppercase tracking-wider">
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b border-border/30 hover:bg-muted/20">
                <td className="p-3 font-body text-foreground">{t.title}</td>
                <td className="p-3 text-sm text-muted-foreground capitalize">{t.category}</td>
                <td className="p-3 text-sm text-muted-foreground">{new Date(t.date).toLocaleDateString()}</td>
                <td className={cn("p-3 text-right font-display", t.type === 'income' ? 'text-success' : 'text-destructive')}>
                  {t.type === 'income' ? '+' : '-'}Rp {Number(t.amount).toLocaleString()}
                </td>
                <td className="p-3">
                  <button onClick={() => deleteTransaction(t.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && !loading && (
          <div className="p-8 text-center text-muted-foreground font-body">
            No transactions yet.
          </div>
        )}
      </div>
    </div>
  );
};
