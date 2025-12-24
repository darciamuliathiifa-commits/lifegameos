import { useState } from 'react';
import { Plus, Target, Filter } from 'lucide-react';
import { Quest, Category } from '@/types/game';
import { Button } from '@/components/ui/button';
import { QuestCard } from './QuestCard';
import { AddQuestDialog } from './AddQuestDialog';
import { EditQuestDialog } from './EditQuestDialog';
import { cn } from '@/lib/utils';

interface QuestsPageProps {
  quests: Quest[];
  onComplete: (id: string) => void;
  onAdd: (quest: Omit<Quest, 'id' | 'completed'>) => void;
  onEdit?: (id: string, updates: { title?: string; description?: string; xpReward?: number; category?: string }) => void;
  onDelete: (id: string) => void;
  onImageUpload: (id: string, image: string) => void;
}

const categories: (Category | 'all')[] = ['all', 'health', 'productivity', 'social', 'learning', 'creative'];

const categoryLabels: Record<Category | 'all', string> = {
  all: 'Semua',
  health: 'Kesehatan',
  productivity: 'Produktivitas',
  social: 'Sosial',
  learning: 'Pembelajaran',
  creative: 'Kreativitas',
};

export const QuestsPage = ({ 
  quests, 
  onComplete, 
  onAdd,
  onEdit,
  onDelete,
  onImageUpload 
}: QuestsPageProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [showCompleted, setShowCompleted] = useState(false);

  const filteredQuests = quests.filter(quest => {
    if (filter !== 'all' && quest.category !== filter) return false;
    if (!showCompleted && quest.completed) return false;
    return true;
  });

  const activeCount = quests.filter(q => !q.completed).length;
  const completedCount = quests.filter(q => q.completed).length;

  const handleEdit = (quest: Quest) => {
    setEditingQuest(quest);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (questId: string, updates: { title?: string; description?: string; xpReward?: number; category?: string }) => {
    if (onEdit) {
      onEdit(questId, updates);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between md:gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-display text-foreground flex items-center gap-2 md:gap-3">
            <Target className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            Misi Harian
          </h1>
          <p className="text-muted-foreground font-body text-xs md:text-base mt-1">
            Selesaikan misi untuk mendapatkan XP dan naik level
          </p>
        </div>
        <Button variant="gaming" onClick={() => setIsDialogOpen(true)} className="gap-2 w-full md:w-auto">
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          Misi Baru
        </Button>
      </div>

      {/* Stats */}
      <div className="flex gap-2 md:gap-4">
        <div className="card-gaming rounded-lg px-3 md:px-4 py-2 md:py-3 flex-1 md:flex-none">
          <span className="text-lg md:text-2xl font-display text-primary">{activeCount}</span>
          <span className="text-xs md:text-sm text-muted-foreground font-body ml-1 md:ml-2">Aktif</span>
        </div>
        <div className="card-gaming rounded-lg px-3 md:px-4 py-2 md:py-3 flex-1 md:flex-none">
          <span className="text-lg md:text-2xl font-display text-success">{completedCount}</span>
          <span className="text-xs md:text-sm text-muted-foreground font-body ml-1 md:ml-2">Selesai</span>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="w-3 h-3 md:w-4 md:h-4" />
          <span className="text-xs md:text-sm font-body">Filter:</span>
        </div>
        <div className="flex flex-wrap gap-1.5 md:gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[10px] md:text-sm font-body uppercase tracking-wider transition-all",
                filter === cat
                  ? "bg-primary text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.4)]"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className={cn(
            "px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[10px] md:text-sm font-body transition-all",
            showCompleted
              ? "bg-success/20 text-success"
              : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          Tampilkan Selesai
        </button>
      </div>

      {/* Quest List */}
      <div className="space-y-4">
        {filteredQuests.map((quest, index) => (
          <div 
            key={quest.id} 
            style={{ animationDelay: `${index * 50}ms` }}
            className="animate-slide-up"
          >
            <QuestCard 
              quest={quest} 
              onComplete={onComplete}
              onEdit={handleEdit}
              onDelete={onDelete}
              onImageUpload={onImageUpload}
              showImageUpload
            />
          </div>
        ))}
        {filteredQuests.length === 0 && (
          <div className="card-gaming rounded-xl p-12 text-center">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-body text-lg">Tidak ada misi ditemukan</p>
            <p className="text-muted-foreground font-body text-sm mt-1">
              Tambahkan misi baru untuk memulai!
            </p>
          </div>
        )}
      </div>

      <AddQuestDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onAdd={onAdd}
      />

      <EditQuestDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        quest={editingQuest}
        onSave={handleSaveEdit}
      />
    </div>
  );
};