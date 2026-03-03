-- This script safely drops the existing trigger and function
-- and then recreates them to ensure they are up-to-date.

-- 1. Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Create the function to be called by the trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create a new profile for the new user
  INSERT INTO public.profiles (id, username)
  VALUES (
    new.id,
    -- Use the part of the email before the '@' as the initial username
    -- and add a random number to avoid collisions
    split_part(new.email, '@', 1) || '-' || floor(random() * 1000)
  );
  RETURN new;
END;
$$;

-- 3. Create the trigger that calls the function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
