-- Add difficulty and xp_reward columns to habits table
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS difficulty text DEFAULT 'medium';
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS xp_reward integer DEFAULT 20;