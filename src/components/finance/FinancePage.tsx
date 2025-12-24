import { useState, useEffect, useRef } from 'react';
import { Wallet, Plus, TrendingUp, TrendingDown, DollarSign, Trash2, Edit2, Filter, Camera, Loader2, CreditCard, PiggyBank, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { FinanceCharts } from './FinanceCharts';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  notes: string | null;
  currency: string;
  wallet_id: string | null;
}

interface WalletType {
  id: string;
  name: string;
  currency: string;
  icon: string;
  color: string;
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

const walletIcons = ['💳', '💵', '🏦', '💰', '🪙', '💎', '📱', '🔐'];

const getCurrencySymbol = (code: string) => {
  return currencies.find(c => c.code === code)?.symbol || code;
};

export const FinancePage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<WalletType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [isEditWalletDialogOpen, setIsEditWalletDialogOpen] = useState(false);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingWallet, setEditingWallet] = useState<WalletType | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedWallet, setSelectedWallet] = useState<string>('all');
  const [parsingReceipt, setParsingReceipt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [form, setForm] = useState({
    title: '', 
    amount: '', 
    type: 'expense' as 'income' | 'expense',
    category: 'other', 
    date: new Date().toISOString().split('T')[0],
    notes: '',
    currency: 'IDR',
    wallet_id: '',
  });

  const [walletForm, setWalletForm] = useState({
    name: '',
    currency: 'IDR',
    icon: '💳',
    color: '#1e3a5f',
  });

  const [balanceForm, setBalanceForm] = useState({
    amount: '',
    type: 'set' as 'set' | 'add' | 'subtract',
  });

  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchWallets();
    }
  }, [user]);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('finance_transactions')
      .select('*')
      .order('date', { ascending: false });

    if (!error && data) setTransactions(data as Transaction[]);
    setLoading(false);
  };

  const fetchWallets = async () => {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) setWallets(data);
  };

  const getWalletBalance = (walletId: string) => {
    const walletTransactions = transactions.filter(t => t.wallet_id === walletId);
    const income = walletTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = walletTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
    return income - expense;
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
      wallet_id: form.wallet_id || null,
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

  const handleWalletSubmit = async () => {
    if (!user || !walletForm.name.trim()) return;

    if (editingWallet) {
      const { error } = await supabase
        .from('wallets')
        .update(walletForm)
        .eq('id', editingWallet.id);

      if (!error) {
        toast.success('Dompet berhasil diperbarui!');
        fetchWallets();
        closeWalletDialog();
      } else {
        toast.error('Gagal memperbarui dompet');
      }
    } else {
      const { error } = await supabase
        .from('wallets')
        .insert({ user_id: user.id, ...walletForm });

      if (!error) {
        toast.success('Dompet berhasil ditambahkan!');
        fetchWallets();
        closeWalletDialog();
      } else {
        toast.error('Gagal menambahkan dompet');
      }
    }
  };

  const closeWalletDialog = () => {
    setIsWalletDialogOpen(false);
    setIsEditWalletDialogOpen(false);
    setEditingWallet(null);
    setWalletForm({ name: '', currency: 'IDR', icon: '💳', color: '#1e3a5f' });
  };

  const openEditWallet = (wallet: WalletType) => {
    setEditingWallet(wallet);
    setWalletForm({
      name: wallet.name,
      currency: wallet.currency,
      icon: wallet.icon,
      color: wallet.color,
    });
    setIsEditWalletDialogOpen(true);
  };

  const openBalanceDialog = (wallet: WalletType) => {
    setEditingWallet(wallet);
    setBalanceForm({ amount: '', type: 'set' });
    setIsBalanceDialogOpen(true);
  };

  const handleBalanceSubmit = async () => {
    if (!user || !editingWallet || !balanceForm.amount) return;

    const amount = parseFloat(balanceForm.amount);
    const currentBalance = getWalletBalance(editingWallet.id);
    let adjustmentAmount = 0;
    let adjustmentType: 'income' | 'expense' = 'income';

    if (balanceForm.type === 'set') {
      adjustmentAmount = Math.abs(amount - currentBalance);
      adjustmentType = amount >= currentBalance ? 'income' : 'expense';
    } else if (balanceForm.type === 'add') {
      adjustmentAmount = amount;
      adjustmentType = 'income';
    } else {
      adjustmentAmount = amount;
      adjustmentType = 'expense';
    }

    if (adjustmentAmount > 0) {
      const { error } = await supabase
        .from('finance_transactions')
        .insert({
          user_id: user.id,
          title: balanceForm.type === 'set' ? 'Penyesuaian Saldo' : (balanceForm.type === 'add' ? 'Penambahan Saldo' : 'Pengurangan Saldo'),
          amount: adjustmentAmount,
          type: adjustmentType,
          category: 'other',
          date: new Date().toISOString().split('T')[0],
          currency: editingWallet.currency,
          wallet_id: editingWallet.id,
        });

      if (!error) {
        toast.success('Saldo berhasil diperbarui!');
        fetchTransactions();
        setIsBalanceDialogOpen(false);
        setEditingWallet(null);
      } else {
        toast.error('Gagal memperbarui saldo');
      }
    } else {
      toast.info('Saldo sudah sesuai');
      setIsBalanceDialogOpen(false);
    }
  };

  const handleReceiptUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setParsingReceipt(true);
    
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        
        const { data, error } = await supabase.functions.invoke('parse-receipt', {
          body: { imageBase64: base64 }
        });

        if (error) {
          toast.error('Gagal memproses struk');
          setParsingReceipt(false);
          return;
        }

        if (data.success && data.data?.transactions) {
          const parsedTransactions = data.data.transactions;
          const parsedDate = data.data.date || new Date().toISOString().split('T')[0];
          
          // Add all parsed transactions
          let addedCount = 0;
          for (const t of parsedTransactions) {
            const { error: insertError } = await supabase
              .from('finance_transactions')
              .insert({
                user_id: user?.id,
                title: t.title,
                amount: t.amount,
                type: t.type || 'expense',
                category: t.category || 'other',
                date: parsedDate,
                currency: 'IDR',
                wallet_id: selectedWallet !== 'all' ? selectedWallet : null,
              });

            if (!insertError) addedCount++;
          }

          toast.success(`${addedCount} transaksi berhasil ditambahkan dari struk!`);
          fetchTransactions();
        } else {
          toast.error(data.error || 'Tidak dapat membaca struk');
        }

        setParsingReceipt(false);
        setIsReceiptDialogOpen(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Receipt upload error:', error);
      toast.error('Gagal mengupload struk');
      setParsingReceipt(false);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingTransaction(null);
    setForm({ 
      title: '', amount: '', type: 'expense', category: 'other', 
      date: new Date().toISOString().split('T')[0], notes: '', currency: 'IDR', wallet_id: '' 
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
      wallet_id: transaction.wallet_id || '',
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

  const deleteWallet = async (id: string) => {
    const { error } = await supabase.from('wallets').delete().eq('id', id);
    if (!error) {
      toast.success('Dompet dihapus');
      fetchWallets();
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (selectedWallet !== 'all' && t.wallet_id !== selectedWallet) return false;
    return true;
  });

  // Calculate totals
  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  const formatAmount = (amount: number, currency: string = 'IDR') => {
    const symbol = getCurrencySymbol(currency);
    return `${symbol} ${amount.toLocaleString()}`;
  };

  const getCategoryInfo = (categoryValue: string) => {
    return categories.find(c => c.value === categoryValue) || { label: categoryValue, icon: '📌' };
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-xl md:text-3xl font-display text-foreground flex items-center gap-2 md:gap-3">
            <Wallet className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            Manajer Keuangan
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm mt-1">Kelola dompet dan transaksi Anda</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Camera className="w-4 h-4" /> Scan Struk
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Scan Struk Belanja</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  Upload foto struk belanja dan AI akan secara otomatis mengekstrak transaksi.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleReceiptUpload}
                  className="hidden"
                />
                <Button 
                  variant="gaming" 
                  className="w-full gap-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={parsingReceipt}
                >
                  {parsingReceipt ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Memproses...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" /> Pilih Foto Struk
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isWalletDialogOpen} onOpenChange={setIsWalletDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <PiggyBank className="w-4 h-4" /> Dompet Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Tambah Dompet Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Nama dompet (contoh: Bank BCA, Gopay)"
                  value={walletForm.name}
                  onChange={(e) => setWalletForm({ ...walletForm, name: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Select value={walletForm.currency} onValueChange={(v) => setWalletForm({ ...walletForm, currency: v })}>
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
                  <Select value={walletForm.icon} onValueChange={(v) => setWalletForm({ ...walletForm, icon: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ikon" />
                    </SelectTrigger>
                    <SelectContent>
                      {walletIcons.map(icon => (
                        <SelectItem key={icon} value={icon}>
                          {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsWalletDialogOpen(false)} className="flex-1">Batal</Button>
                  <Button variant="gaming" onClick={handleWalletSubmit} className="flex-1">Tambah</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            if (!open) closeDialog();
            else setIsDialogOpen(true);
          }}>
            <DialogTrigger asChild>
              <Button variant="gaming" size="sm" className="gap-1.5">
                <Plus className="w-4 h-4" /> Transaksi
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
                {wallets.length > 0 && (
                  <Select value={form.wallet_id} onValueChange={(v) => setForm({ ...form, wallet_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Pilih dompet (opsional)" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tanpa dompet</SelectItem>
                      {wallets.map(w => (
                        <SelectItem key={w.id} value={w.id}>
                          {w.icon} {w.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
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
      </div>

      {/* Edit Wallet Dialog */}
      <Dialog open={isEditWalletDialogOpen} onOpenChange={(open) => {
        if (!open) closeWalletDialog();
        else setIsEditWalletDialogOpen(true);
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Dompet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Nama dompet"
              value={walletForm.name}
              onChange={(e) => setWalletForm({ ...walletForm, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Select value={walletForm.currency} onValueChange={(v) => setWalletForm({ ...walletForm, currency: v })}>
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
              <Select value={walletForm.icon} onValueChange={(v) => setWalletForm({ ...walletForm, icon: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Ikon" />
                </SelectTrigger>
                <SelectContent>
                  {walletIcons.map(icon => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={closeWalletDialog} className="flex-1">Batal</Button>
              <Button variant="gaming" onClick={handleWalletSubmit} className="flex-1">Simpan</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Balance Adjustment Dialog */}
      <Dialog open={isBalanceDialogOpen} onOpenChange={setIsBalanceDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Atur Saldo - {editingWallet?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {editingWallet && (
              <p className="text-sm text-muted-foreground">
                Saldo saat ini: <span className="font-bold text-foreground">{formatAmount(getWalletBalance(editingWallet.id), editingWallet.currency)}</span>
              </p>
            )}
            <Select value={balanceForm.type} onValueChange={(v: 'set' | 'add' | 'subtract') => setBalanceForm({ ...balanceForm, type: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="set">📊 Atur Saldo Ke</SelectItem>
                <SelectItem value="add">➕ Tambah Saldo</SelectItem>
                <SelectItem value="subtract">➖ Kurangi Saldo</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Jumlah"
              value={balanceForm.amount}
              onChange={(e) => setBalanceForm({ ...balanceForm, amount: e.target.value })}
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsBalanceDialogOpen(false)} className="flex-1">Batal</Button>
              <Button variant="gaming" onClick={handleBalanceSubmit} className="flex-1">Simpan</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Wallets Grid */}
      {wallets.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base md:text-lg text-foreground">Dompet Saya</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {wallets.map((wallet) => {
              const balance = getWalletBalance(wallet.id);
              return (
                <Card 
                  key={wallet.id} 
                  className={cn(
                    "cursor-pointer transition-all border-border/50 hover:border-primary/30",
                    selectedWallet === wallet.id && "border-primary ring-1 ring-primary/20"
                  )}
                  onClick={() => setSelectedWallet(selectedWallet === wallet.id ? 'all' : wallet.id)}
                >
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl md:text-2xl">{wallet.icon}</span>
                      <div className="flex gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); openBalanceDialog(wallet); }}
                          className="p-1 text-muted-foreground hover:text-primary transition-colors"
                          title="Atur Saldo"
                        >
                          <DollarSign className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); openEditWallet(wallet); }}
                          className="p-1 text-muted-foreground hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteWallet(wallet.id); }}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">{wallet.name}</p>
                    <p className={cn(
                      "text-base md:text-lg font-display font-bold mt-1",
                      balance >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {formatAmount(balance, wallet.currency)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <div className="card-gaming rounded-lg md:rounded-xl p-3 md:p-4">
          <div className="flex items-center gap-1.5 md:gap-2 text-success mb-1 md:mb-2">
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-[10px] md:text-sm font-body">Pemasukan</span>
          </div>
          <p className="text-lg md:text-2xl font-display text-success truncate">
            {formatAmount(totalIncome)}
          </p>
        </div>
        <div className="card-gaming rounded-lg md:rounded-xl p-3 md:p-4">
          <div className="flex items-center gap-1.5 md:gap-2 text-destructive mb-1 md:mb-2">
            <TrendingDown className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-[10px] md:text-sm font-body">Pengeluaran</span>
          </div>
          <p className="text-lg md:text-2xl font-display text-destructive truncate">
            {formatAmount(totalExpense)}
          </p>
        </div>
        <div className="card-gaming rounded-lg md:rounded-xl p-3 md:p-4">
          <div className="flex items-center gap-1.5 md:gap-2 text-primary mb-1 md:mb-2">
            <DollarSign className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-[10px] md:text-sm font-body">Saldo</span>
          </div>
          <p className={cn("text-lg md:text-2xl font-display truncate", balance >= 0 ? "text-success" : "text-destructive")}>
            {formatAmount(balance)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap items-center">
        <div className="flex items-center gap-1.5 md:gap-2">
          <Filter className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
          <span className="text-[10px] md:text-sm text-muted-foreground">Filter:</span>
        </div>
        <Select value={filterType} onValueChange={(v: 'all' | 'income' | 'expense') => setFilterType(v)}>
          <SelectTrigger className="w-28 md:w-36 h-8 md:h-9 text-xs md:text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="income">Pemasukan</SelectItem>
            <SelectItem value="expense">Pengeluaran</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-32 md:w-40 h-8 md:h-9 text-xs md:text-sm">
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
      <div className="card-gaming rounded-lg md:rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/30">
              <tr className="text-left text-[10px] md:text-xs text-muted-foreground font-body uppercase tracking-wider">
                <th className="p-2 md:p-3">Transaksi</th>
                <th className="p-2 md:p-3 hidden sm:table-cell">Kategori</th>
                <th className="p-2 md:p-3 hidden md:table-cell">Tanggal</th>
                <th className="p-2 md:p-3 text-right">Jumlah</th>
                <th className="p-2 md:p-3 w-16 md:w-20"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.slice(0, 20).map((t) => {
                const categoryInfo = getCategoryInfo(t.category);
                const wallet = wallets.find(w => w.id === t.wallet_id);
                return (
                  <tr key={t.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="p-2 md:p-3">
                      <div>
                        <p className="font-body text-foreground text-sm">{t.title}</p>
                        {wallet && (
                          <p className="text-[10px] md:text-xs text-muted-foreground">{wallet.icon} {wallet.name}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-2 md:p-3 hidden sm:table-cell">
                      <span className="text-xs md:text-sm text-muted-foreground">
                        {categoryInfo.icon} {categoryInfo.label}
                      </span>
                    </td>
                    <td className="p-2 md:p-3 text-xs md:text-sm text-muted-foreground hidden md:table-cell">
                      {new Date(t.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className={cn("p-2 md:p-3 text-right font-display text-sm md:text-base", t.type === 'income' ? 'text-success' : 'text-destructive')}>
                      {t.type === 'income' ? '+' : '-'}{formatAmount(Number(t.amount), t.currency || 'IDR')}
                    </td>
                    <td className="p-2 md:p-3">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => openEdit(t)} className="p-1 md:p-1.5 text-muted-foreground hover:text-primary transition-colors">
                          <Edit2 className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                        <button onClick={() => deleteTransaction(t.id)} className="p-1 md:p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
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

      {/* Charts Section */}
      {transactions.length > 0 && (
        <FinanceCharts transactions={transactions} />
      )}
    </div>
  );
};