import { Category, CATEGORY_COLORS, CATEGORY_ICONS } from '@/types/game';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

const colorClasses: Record<Category, string> = {
  health: 'bg-neon-green/20 text-neon-green border-neon-green/30',
  productivity: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
  social: 'bg-neon-magenta/20 text-neon-magenta border-neon-magenta/30',
  learning: 'bg-neon-purple/20 text-neon-purple border-neon-purple/30',
  creative: 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30',
};

export const CategoryBadge = ({ 
  category, 
  size = 'sm', 
  showIcon = true 
}: CategoryBadgeProps) => {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full border font-body uppercase tracking-wider",
      colorClasses[category],
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
    )}>
      {showIcon && <span>{CATEGORY_ICONS[category]}</span>}
      {category}
    </span>
  );
};
