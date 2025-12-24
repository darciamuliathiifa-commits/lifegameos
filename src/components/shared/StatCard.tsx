import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'accent' | 'success';
  className?: string;
}

const colorClasses = {
  primary: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    shadow: 'shadow-[0_0_20px_hsl(var(--primary)/0.2)]',
  },
  secondary: {
    bg: 'bg-secondary/10',
    text: 'text-secondary',
    shadow: 'shadow-[0_0_20px_hsl(var(--secondary)/0.2)]',
  },
  accent: {
    bg: 'bg-accent/10',
    text: 'text-accent',
    shadow: 'shadow-[0_0_20px_hsl(var(--accent)/0.2)]',
  },
  success: {
    bg: 'bg-success/10',
    text: 'text-success',
    shadow: 'shadow-[0_0_20px_hsl(var(--success)/0.2)]',
  },
};

export const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  color = 'primary',
  className 
}: StatCardProps) => {
  const colors = colorClasses[color];

  return (
    <div className={cn(
      "card-gaming rounded-xl p-5 transition-all duration-300 hover:scale-[1.02]",
      colors.shadow,
      className
    )}>
      <div className="flex items-start justify-between">
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center",
          colors.bg
        )}>
          <Icon className={cn("w-6 h-6", colors.text)} />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-display px-2 py-1 rounded-full",
            trend.isPositive 
              ? "bg-success/20 text-success" 
              : "bg-destructive/20 text-destructive"
          )}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className={cn("text-3xl font-display", colors.text)}>{value}</p>
        <p className="text-sm font-body text-muted-foreground mt-1 uppercase tracking-wider">
          {label}
        </p>
      </div>
    </div>
  );
};
