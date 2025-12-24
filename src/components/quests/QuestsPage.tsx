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
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            Misi Harian
          </h1>
          <p className="text-muted-foreground font-body mt-1">
            Selesaikan misi untuk mendapatkan XP dan naik level
          </p>
        </div>
        <Button variant="gaming" onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="w-5 h-5" />
          Misi Baru
        </Button>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="card-gaming rounded-lg px-4 py-3">
          <span className="text-2xl font-display text-primary">{activeCount}</span>
          <span className="text-sm text-muted-foreground font-body ml-2">Aktif</span>
        </div>
        <div className="card-gaming rounded-lg px-4 py-3">
          <span className="text-2xl font-display text-success">{completedCount}</span>
          <span className="text-sm text-muted-foreground font-body ml-2">Selesai</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-body">Filter:</span>
        </div>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-body uppercase tracking-wider transition-all",
              filter === cat
                ? "bg-primary text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.4)]"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {categoryLabels[cat]}
          </button>
        ))}
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm font-body transition-all ml-auto",
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