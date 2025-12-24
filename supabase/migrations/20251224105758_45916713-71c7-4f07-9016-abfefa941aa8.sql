-- Add currency column to finance_transactions
ALTER TABLE public.finance_transactions 
ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'IDR';

-- Update existing records to use IDR as default
UPDATE public.finance_transactions SET currency = 'IDR' WHERE currency IS NULL;