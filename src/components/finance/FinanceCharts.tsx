import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  currency: string;
}

interface FinanceChartsProps {
  transactions: Transaction[];
}

const categories = [
  { value: 'food', label: 'Makanan', color: '#f97316' },
  { value: 'transport', label: 'Transportasi', color: '#3b82f6' },
  { value: 'entertainment', label: 'Hiburan', color: '#8b5cf6' },
  { value: 'bills', label: 'Tagihan', color: '#ef4444' },
  { value: 'shopping', label: 'Belanja', color: '#ec4899' },
  { value: 'salary', label: 'Gaji', color: '#22c55e' },
  { value: 'freelance', label: 'Freelance', color: '#14b8a6' },
  { value: 'investment', label: 'Investasi', color: '#eab308' },
  { value: 'health', label: 'Kesehatan', color: '#06b6d4' },
  { value: 'education', label: 'Pendidikan', color: '#6366f1' },
  { value: 'other', label: 'Lainnya', color: '#64748b' },
];

const getCategoryColor = (category: string) => {
  return categories.find(c => c.value === category)?.color || '#64748b';
};

const getCategoryLabel = (category: string) => {
  return categories.find(c => c.value === category)?.label || category;
};

export const FinanceCharts = ({ transactions }: FinanceChartsProps) => {
  // Monthly data for bar chart (last 6 months)
  const monthlyData = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 5);
    const months = eachMonthOfInterval({ start: startOfMonth(sixMonthsAgo), end: endOfMonth(now) });
    
    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthTransactions = transactions.filter(t => {
        const date = parseISO(t.date);
        return date >= monthStart && date <= monthEnd;
      });
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      return {
        month: format(month, 'MMM', { locale: id }),
        fullMonth: format(month, 'MMMM yyyy', { locale: id }),
        income,
        expense,
        balance: income - expense,
      };
    });
  }, [transactions]);

  // Category breakdown for radar chart (expenses only)
  const categoryData = useMemo(() => {
    const expensesByCategory: Record<string, number> = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const cat = t.category || 'other';
        expensesByCategory[cat] = (expensesByCategory[cat] || 0) + Number(t.amount);
      });
    
    return categories
      .filter(c => expensesByCategory[c.value] > 0)
      .map(c => ({
        category: getCategoryLabel(c.value),
        value: expensesByCategory[c.value] || 0,
        fullMark: Math.max(...Object.values(expensesByCategory)) * 1.2,
      }));
  }, [transactions]);

  // Pie chart data
  const pieData = useMemo(() => {
    const expensesByCategory: Record<string, number> = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const cat = t.category || 'other';
        expensesByCategory[cat] = (expensesByCategory[cat] || 0) + Number(t.amount);
      });
    
    return Object.entries(expensesByCategory)
      .map(([category, value]) => ({
        name: getCategoryLabel(category),
        value,
        color: getCategoryColor(category),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [transactions]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `Rp ${(value / 1000).toFixed(0)}K`;
    }
    return `Rp ${value}`;
  };

  const chartConfig = {
    income: { label: 'Pemasukan', color: 'hsl(142, 76%, 36%)' },
    expense: { label: 'Pengeluaran', color: 'hsl(0, 84%, 60%)' },
    balance: { label: 'Saldo', color: 'hsl(217, 91%, 60%)' },
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="font-display text-base md:text-lg text-foreground flex items-center gap-2">
        📊 Laporan Keuangan
      </h2>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Monthly Income vs Expense Bar Chart */}
        <Card className="border-border/50">
          <CardHeader className="p-3 md:p-4">
            <CardTitle className="text-sm md:text-base font-display">Pemasukan vs Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent className="p-2 md:p-4">
            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tickFormatter={formatCurrency}
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      `Rp ${value.toLocaleString()}`,
                      name === 'income' ? 'Pemasukan' : 'Pengeluaran'
                    ]}
                    labelFormatter={(label, payload) => payload[0]?.payload?.fullMonth || label}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="income" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} name="income" />
                  <Bar dataKey="expense" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} name="expense" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-success" />
                <span className="text-muted-foreground">Pemasukan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-destructive" />
                <span className="text-muted-foreground">Pengeluaran</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Balance Trend Line Chart */}
        <Card className="border-border/50">
          <CardHeader className="p-3 md:p-4">
            <CardTitle className="text-sm md:text-base font-display">Tren Saldo Bulanan</CardTitle>
          </CardHeader>
          <CardContent className="p-2 md:p-4">
            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tickFormatter={formatCurrency}
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Saldo']}
                    labelFormatter={(label, payload) => payload[0]?.payload?.fullMonth || label}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="hsl(217, 91%, 60%)" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(217, 91%, 60%)', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expense Radar Chart */}
        <Card className="border-border/50">
          <CardHeader className="p-3 md:p-4">
            <CardTitle className="text-sm md:text-base font-display">Radar Pengeluaran per Kategori</CardTitle>
          </CardHeader>
          <CardContent className="p-2 md:p-4">
            <div className="h-48 md:h-64">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={categoryData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis 
                      dataKey="category" 
                      tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 'dataMax']}
                      tick={{ fontSize: 8, fill: 'hsl(var(--muted-foreground))' }}
                      tickFormatter={formatCurrency}
                    />
                    <Radar
                      name="Pengeluaran"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Pengeluaran']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  Belum ada data pengeluaran
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expense Pie Chart */}
        <Card className="border-border/50">
          <CardHeader className="p-3 md:p-4">
            <CardTitle className="text-sm md:text-base font-display">Distribusi Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent className="p-2 md:p-4">
            <div className="h-48 md:h-64">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`Rp ${value.toLocaleString()}`, '']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  Belum ada data pengeluaran
                </div>
              )}
            </div>
            {pieData.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-1 text-[10px] md:text-xs">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
                    <span className="text-muted-foreground">{entry.name}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
