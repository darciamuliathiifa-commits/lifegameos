-- Add repeat_frequency column to habits table
ALTER TABLE public.habits 
ADD COLUMN repeat_frequency text DEFAULT 'daily';

-- Add difficulty column to quests table  
ALTER TABLE public.quests
ADD COLUMN difficulty text DEFAULT 'medium';

COMMENT ON COLUMN public.habits.repeat_frequency IS 'Frequency: daily, weekly, monthly';
COMMENT ON COLUMN public.quests.difficulty IS 'Difficulty level: easy, medium, hard';