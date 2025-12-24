import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Gamepad2, Mail, Lock, User, Loader2 } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!isLogin && password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Welcome back!');
          navigate('/dashboard');
        }
      } else {
        const { error } = await signUp(email, password, name);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Try logging in.');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Account created! Welcome to LifeGame OS!');
          navigate('/dashboard');
        }
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isLogin ? 'Login' : 'Sign Up'} - LifeGame OS</title>
        <meta name="description" content="Join LifeGame OS and gamify your life. Track quests, habits, and goals." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-secondary/8" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/12 rounded-full blur-[80px]" />
        
        {/* Decorative ornaments */}
        <div className="absolute top-10 left-10 text-4xl opacity-20 text-secondary">❧</div>
        <div className="absolute top-10 right-10 text-4xl opacity-20 text-secondary transform scale-x-[-1]">❧</div>
        <div className="absolute bottom-10 left-10 text-4xl opacity-20 text-secondary transform rotate-180">❧</div>
        <div className="absolute bottom-10 right-10 text-4xl opacity-20 text-secondary transform rotate-180 scale-x-[-1]">❧</div>

        {/* Logo */}
        <div className="relative z-10 mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary via-amber-400 to-secondary flex items-center justify-center shadow-lg animate-pulse-glow border border-secondary/30">
              <span className="text-2xl">🌿</span>
            </div>
            <h1 className="text-4xl font-display text-foreground">
              Life<span className="text-secondary">Game</span> OS
            </h1>
          </div>
          <p className="text-muted-foreground font-body tracking-wide">Gamify Your Life</p>
          <div className="mt-3 mx-auto w-32 h-0.5 bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
        </div>

        {/* Auth Card */}
        <div className="relative z-10 w-full max-w-md">
          <div className="card-ornate rounded-2xl p-8 bg-card/95 backdrop-blur-sm">
            {/* Card top decoration */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-secondary to-amber-400 rounded-full text-xs font-display text-secondary-foreground shadow-md">
              {isLogin ? '✦ Welcome Back ✦' : '✦ Join Us ✦'}
            </div>
            
            <h2 className="text-2xl font-display text-foreground text-center mb-6 mt-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground font-body">Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="pl-10 bg-muted/50 border-secondary/20 focus:border-secondary/50 rounded-lg"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-body">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-10 bg-muted/50 border-secondary/20 focus:border-secondary/50 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-body">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 bg-muted/50 border-secondary/20 focus:border-secondary/50 rounded-lg"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="gaming"
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isLogin ? (
                  'Login'
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="mb-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-muted-foreground hover:text-secondary transition-colors font-body text-sm"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
