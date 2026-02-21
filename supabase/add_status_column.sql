-- Add status to profiles for live streaming feature
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'offline';
