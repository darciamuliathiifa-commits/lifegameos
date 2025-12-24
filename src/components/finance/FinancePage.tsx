import { useState, useEffect } from 'react';
import { Wallet, Plus, TrendingUp, TrendingDown, DollarSign, Trash2, Edit2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
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
  currency: string;
}

const categories = [
  { value: 'food', label: 'Makanan', icon: '🍔' },
  { value: 'transport', label: 'Transportasi', icon: '🚗' },
  { value: 'entertainment', label: 'Hiburan', icon: '🎬' },
  { value: 'bills', label: 'Tagihan', icon: '📄' },
  { value: 'shopping', label: 'Belanja', icon: '🛒' },
  { value: 'salary', label: 'Gaji', icon: '💰' },
  { value: 'freelance', label: 'Freelance', icon: '💻' },
  { value: 'investment', label: 'Investasi', icon: '📈' },
  { value: 'health', label: 'Kesehatan', icon: '🏥' },
  { value: 'education', label: 'Pendidikan', icon: '📚' },
  { value: 'other', label: 'Lainnya', icon: '📌' },
];

const currencies = [
  { code: 'IDR', symbol: 'Rp', name: 'Rupiah Indonesia' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
];

const getCurrencySymbol = (code: string) => {
  return currencies.find(c => c.code === code)?.symbol || code;
};

export const FinancePage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [displayCurrency, setDisplayCurrency] = useState('IDR');
  const [form, setForm] = useState({
    title: '', 
    amount: '', 
    type: 'expense' as 'income' | 'expense',
    category: 'other', 
    date: new Date().toISOString().split('T')[0],
    notes: '',
    currency: 'IDR',
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

    const transactionData = {
      title: form.title,
      amount: parseFloat(form.amount),
      type: form.type,
      category: form.category,
      date: form.date,
      notes: form.notes || null,
      currency: form.currency,
    };

    if (editingTransaction) {
      const { error } = await supabase
        .from('finance_transactions')
        .update(transactionData)
        .eq('id', editingTransaction.id);

      if (!error) {
        toast.success('Transaksi diperbarui!');
        fetchTransactions();
      }
    } else {
      const { error } = await supabase
        .from('finance_transactions')
        .insert({ user_id: user.id, ...transactionData });

      if (!error) {
        toast.success('Transaksi ditambahkan!');
        fetchTransactions();
      }
    }

    closeDialog();
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingTransaction(null);
    setForm({ 
      title: '', amount: '', type: 'expense', category: 'other', 
      date: new Date().toISOString().split('T')[0], notes: '', currency: 'IDR' 
    });
  };

  const openEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setForm({
      title: transaction.title,
      amount: transaction.amount.toString(),
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
      notes: transaction.notes || '',
      currency: transaction.currency || 'IDR',
    });
    setIsDialogOpen(true);
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase.from('finance_transactions').delete().eq('id', id);
    if (!error) {
      toast.success('Transaksi dihapus');
      fetchTransactions();
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    if (filterType !== 'all' && t.type !== filterType) return false;
    return true;
  });

  // Calculate totals per currency
  const getCurrencyTotals = () => {
    const totals: Record<string, { income: number; expense: number }> = {};
    
    transactions.forEach(t => {
      const curr = t.currency || 'IDR';
      if (!totals[curr]) {
        totals[curr] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        totals[curr].income += Number(t.amount);
      } else {
        totals[curr].expense += Number(t.amount);
      }
    });
    
    return totals;
  };

  const currencyTotals = getCurrencyTotals();
  const displayTotals = currencyTotals[displayCurrency] || { income: 0, expense: 0 };
  const balance = displayTotals.income - displayTotals.expense;

  const formatAmount = (amount: number, currency: string) => {
    const symbol = getCurrencySymbol(currency);
    return `${symbol} ${amount.toLocaleString()}`;
  };

  const getCategoryInfo = (categoryValue: string) => {
    return categories.find(c => c.value === categoryValue) || { label: categoryValue, icon: '📌' };
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
          <Wallet className="w-8 h-8 text-primary" />
          Manajer Keuangan
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) closeDialog();
          else setIsDialogOpen(true);
        }}>
          <DialogTrigger asChild>
            <Button variant="gaming" className="gap-2">
              <Plus className="w-4 h-4" /> Tambah Transaksi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingTransaction ? 'Edit Transaksi' : 'Transaksi Baru'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Judul transaksi"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="Jumlah"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
                <Select value={form.currency} onValueChange={(v) => setForm({ ...form, currency: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Mata uang" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(c => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.symbol} {c.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Select value={form.type} onValueChange={(v: 'income' | 'expense') => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">💰 Pemasukan</SelectItem>
                  <SelectItem value="expense">💸 Pengeluaran</SelectItem>
                </SelectContent>
              </Select>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.icon} {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              <Textarea
                placeholder="Catatan (opsional)"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={closeDialog} className="flex-1">Batal</Button>
                <Button variant="gaming" onClick={handleSubmit} className="flex-1">
                  {editingTransaction ? 'Perbarui' : 'Tambah'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Currency Selector for Stats */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Tampilkan dalam:</span>
        <Select value={displayCurrency} onValueChange={setDisplayCurrency}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(currencyTotals).length > 0 
              ? Object.keys(currencyTotals).map(code => (
                  <SelectItem key={code} value={code}>
                    {getCurrencySymbol(code)} {code}
                  </SelectItem>
                ))
              : currencies.slice(0, 3).map(c => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </SelectItem>
                ))
            }
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-gaming rounded-xl p-4">
          <div className="flex items-center gap-2 text-success mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-body">Pemasukan</span>
          </div>
          <p className="text-2xl font-display text-success">
            {formatAmount(displayTotals.income, displayCurrency)}
          </p>
        </div>
        <div className="card-gaming rounded-xl p-4">
          <div className="flex items-center gap-2 text-destructive mb-2">
            <TrendingDown className="w-5 h-5" />
            <span className="text-sm font-body">Pengeluaran</span>
          </div>
          <p className="text-2xl font-display text-destructive">
            {formatAmount(displayTotals.expense, displayCurrency)}
          </p>
        </div>
        <div className="card-gaming rounded-xl p-4">
          <div className="flex items-center gap-2 text-primary mb-2">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-body">Saldo</span>
          </div>
          <p className={cn("text-2xl font-display", balance >= 0 ? "text-success" : "text-destructive")}>
            {formatAmount(balance, displayCurrency)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter:</span>
        </div>
        <Select value={filterType} onValueChange={(v: 'all' | 'income' | 'expense') => setFilterType(v)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="income">Pemasukan</SelectItem>
            <SelectItem value="expense">Pengeluaran</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories.map(c => (
              <SelectItem key={c.value} value={c.value}>
                {c.icon} {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Transactions */}
      <div className="card-gaming rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/30">
              <tr className="text-left text-xs text-muted-foreground font-body uppercase tracking-wider">
                <th className="p-3">Transaksi</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3 text-right">Jumlah</th>
                <th className="p-3 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => {
                const categoryInfo = getCategoryInfo(t.category);
                return (
                  <tr key={t.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <div>
                        <p className="font-body text-foreground">{t.title}</p>
                        {t.notes && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{t.notes}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-muted-foreground">
                        {categoryInfo.icon} {categoryInfo.label}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {new Date(t.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className={cn("p-3 text-right font-display", t.type === 'income' ? 'text-success' : 'text-destructive')}>
                      {t.type === 'income' ? '+' : '-'}{formatAmount(Number(t.amount), t.currency || 'IDR')}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => openEdit(t)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteTransaction(t.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredTransactions.length === 0 && !loading && (
          <div className="p-8 text-center text-muted-foreground font-body">
            Belum ada transaksi.
          </div>
        )}
      </div>
    </div>
  );
};