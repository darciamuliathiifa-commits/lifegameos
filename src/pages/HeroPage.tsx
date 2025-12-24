import { ArrowRight, Zap, Target, Flame, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import heroBanner from '@/assets/hero-banner.jpg';
import { Helmet } from 'react-helmet-async';

const features = [
  {
    icon: Target,
    title: 'Daily Quests',
    description: 'Transform your tasks into epic adventures',
  },
  {
    icon: Flame,
    title: 'Habit Streaks',
    description: 'Build consistency with visual streak tracking',
  },
  {
    icon: Trophy,
    title: 'Achievements',
    description: 'Unlock badges and rewards as you progress',
  },
  {
    icon: Zap,
    title: 'Level Up',
    description: 'Earn XP and watch your character grow',
  },
];

const HeroPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>LifeGame OS - Gamify Your Life</title>
        <meta name="description" content="Transform your daily routine into an epic adventure. Track quests, build habits, achieve goals, and level up your life." />
      </Helmet>

      <div className="min-h-screen bg-background overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroBanner}
              alt="LifeGame OS Hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/50" />
          </div>

          {/* Glowing Orb */}
          <div className="absolute bottom-20 left-10 w-4 h-4 rounded-full bg-primary animate-pulse-glow" />

          {/* Content */}
          <div className="relative z-10 container mx-auto px-6 py-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6 animate-slide-up">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-body text-primary uppercase tracking-wider">
                  Your Life Operating System
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-display text-foreground mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
                LIFE<span className="text-glow text-primary">GAME</span>
                <span className="block text-3xl md:text-4xl mt-2 text-muted-foreground">
                  OS HUB
                </span>
              </h1>

              <p className="text-lg md:text-xl font-body text-muted-foreground mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: '200ms' }}>
                All your thoughts in one private place. Transform your daily routine into an epic adventure with quests, habits, goals, and achievements.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
                <Button
                  variant="gaming"
                  size="xl"
                  onClick={() => navigate('/dashboard')}
                  className="gap-3"
                >
                  Enter Your OS
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
            <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
              <div className="w-1 h-2 rounded-full bg-primary animate-bounce" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
          
          <div className="relative z-10 container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
                Level Up Your <span className="text-primary text-glow">Life</span>
              </h2>
              <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
                Powerful tools to help you stay organized, build habits, and achieve your goals
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="card-gaming rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary/20 flex items-center justify-center group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all duration-300">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display text-lg text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm font-body text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Button
                variant="gaming"
                size="xl"
                onClick={() => navigate('/dashboard')}
                className="gap-3"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-border">
          <div className="container mx-auto px-6 text-center">
            <p className="text-sm text-muted-foreground font-body">
              © 2024 LifeGame OS Hub. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HeroPage;
