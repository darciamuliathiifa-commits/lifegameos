-- Create notes table (Knowledge Vault)
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT DEFAULT 'general',
  tags TEXT[],
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create finance_transactions table
CREATE TABLE public.finance_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT DEFAULT 'other',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory_items table
CREATE TABLE public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'other',
  quantity INTEGER DEFAULT 1,
  location TEXT,
  image_url TEXT,
  purchase_date DATE,
  purchase_price DECIMAL(12,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prayers table (Doa Harian)
CREATE TABLE public.prayers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  arabic_text TEXT,
  translation TEXT,
  transliteration TEXT,
  category TEXT DEFAULT 'daily',
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create second_brain_items table (PARA method)
CREATE TABLE public.second_brain_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT NOT NULL CHECK (type IN ('project', 'area', 'resource', 'archive')),
  status TEXT DEFAULT 'not_started',
  parent_id UUID REFERENCES public.second_brain_items(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.second_brain_items ENABLE ROW LEVEL SECURITY;

-- Notes policies
CREATE POLICY "Users can view own notes" ON public.notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notes" ON public.notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON public.notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON public.notes FOR DELETE USING (auth.uid() = user_id);

-- Finance policies
CREATE POLICY "Users can view own transactions" ON public.finance_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.finance_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON public.finance_transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON public.finance_transactions FOR DELETE USING (auth.uid() = user_id);

-- Inventory policies
CREATE POLICY "Users can view own inventory" ON public.inventory_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own inventory" ON public.inventory_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own inventory" ON public.inventory_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own inventory" ON public.inventory_items FOR DELETE USING (auth.uid() = user_id);

-- Prayers policies
CREATE POLICY "Users can view own prayers" ON public.prayers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own prayers" ON public.prayers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own prayers" ON public.prayers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own prayers" ON public.prayers FOR DELETE USING (auth.uid() = user_id);

-- Second brain policies
CREATE POLICY "Users can view own second_brain" ON public.second_brain_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own second_brain" ON public.second_brain_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own second_brain" ON public.second_brain_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own second_brain" ON public.second_brain_items FOR DELETE USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON public.inventory_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_second_brain_updated_at BEFORE UPDATE ON public.second_brain_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();