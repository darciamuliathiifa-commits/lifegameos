import { useState } from 'react';
import { Plus, Pyramid, BookOpen, Video, Users, Lightbulb, Calendar, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SpaceCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  status?: string;
  statusColor?: string;
  bgGradient: string;
}

const menuCards: SpaceCard[] = [
  {
    id: '1',
    title: 'AI Learning Hub',
    subtitle: 'Belajar AI dari dasar!',
    description: 'Kursus & Tutorial AI',
    icon: '🤖',
    status: 'POPULER!',
    statusColor: 'treasure',
    bgGradient: 'from-amber-500 to-orange-600',
  },
  {
    id: '2',
    title: 'Prompt Engineering',
    subtitle: 'Kuasai seni prompting!',
    description: 'Panduan Prompt Engineering',
    icon: '✨',
    status: 'NEW!',
    statusColor: 'ocean',
    bgGradient: 'from-purple-600 to-indigo-700',
  },
  {
    id: '3',
    title: 'AI Tools Database',
    subtitle: '1000+ AI Tools!',
    description: 'Database AI Tools Terlengkap',
    icon: '🛠️',
    status: 'UPDATE!',
    statusColor: 'jungle',
    bgGradient: 'from-emerald-600 to-teal-700',
  },
  {
    id: '4',
    title: 'Community Hub',
    subtitle: 'Diskusi & Networking',
    description: 'AIGYPT Community',
    icon: '👥',
    status: 'ACTIVE!',
    statusColor: 'sunset',
    bgGradient: 'from-rose-600 to-pink-700',
  },
  {
    id: '5',
    title: 'AI News & Trends',
    subtitle: 'Update terbaru AI!',
    description: 'Berita & Tren AI Terkini',
    icon: '📰',
    status: 'DAILY!',
    statusColor: 'sky',
    bgGradient: 'from-cyan-600 to-blue-700',
  },
  {
    id: '6',
    title: 'Project Showcase',
    subtitle: 'Karya member AIGYPT',
    description: 'Galeri Project AI',
    icon: '🎨',
    status: 'INSPIRE!',
    statusColor: 'treasure',
    bgGradient: 'from-violet-600 to-purple-700',
  },
];

const quickLinks = [
  { name: 'AI Courses', icon: BookOpen },
  { name: 'Webinars', icon: Video },
  { name: 'Community Forum', icon: Users },
  { name: 'AI Ideas', icon: Lightbulb },
  { name: 'Events Calendar', icon: Calendar },
];

export const AIGYPTSpacePage = () => {
  const [cards] = useState<SpaceCard[]>(menuCards);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
            <Pyramid className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display text-foreground flex items-center gap-2">
              AIGYPT Space <Sparkles className="w-6 h-6 text-secondary" />
            </h1>
          </div>
        </div>
        
        <p className="text-muted-foreground font-body text-sm md:text-base">
          <span className="text-secondary font-semibold">AIGYPT</span> - Komunitas AI Indonesia di Mesir.{' '}
          Belajar, Berbagi, dan Berkembang bersama di era Artificial Intelligence!
        </p>
        
        <div className="flex items-center gap-2 text-sm font-body">
          <div className="w-1 h-6 bg-secondary rounded-full" />
          <span className="italic text-muted-foreground">Empowering Indonesian Students with AI! 🚀</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Quick Links Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardContent className="pt-5">
              <h3 className="text-secondary font-display font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <button className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors group w-full text-left">
                      <span className="text-primary">•</span>
                      <span className="group-hover:underline">{link.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {/* Logo Card */}
          <Card className="overflow-hidden">
            <div className="aspect-square bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center p-8">
              <div className="w-full h-full rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <Pyramid className="w-24 h-24 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Menu Cards Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display text-foreground">Menu AIGYPT</h2>
            <Button variant="adventure" size="sm" className="gap-2">
              <Plus className="w-4 h-4" /> New
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cards.map((card) => (
              <Card 
                key={card.id} 
                className="overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform group"
              >
                {/* Colored Header */}
                <div className={cn(
                  "p-4 bg-gradient-to-br text-white",
                  card.bgGradient
                )}>
                  <div className="flex items-center gap-2 mb-2 opacity-80">
                    <Pyramid className="w-4 h-4" />
                    <span className="text-xs font-body">aigypt</span>
                  </div>
                  <h3 className="font-display font-bold text-lg leading-tight">{card.title}</h3>
                  <p className="text-xs opacity-80 mt-1 font-body">{card.subtitle}</p>
                </div>
                
                {/* Content */}
                <CardContent className="pt-4">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{card.icon}</span>
                    <p className="text-sm font-body text-foreground leading-tight">{card.description}</p>
                  </div>
                  {card.status && (
                    <Badge 
                      variant={card.statusColor as any} 
                      className="mt-3 text-xs"
                    >
                      {card.status}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* New Page Card */}
            <Card className="border-dashed border-2 border-border/50 bg-transparent hover:bg-muted/30 cursor-pointer transition-colors">
              <CardContent className="h-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Plus className="w-8 h-8 mb-2" />
                <span className="text-sm font-body">New page</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};