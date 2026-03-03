-- Creates a trigger that automatically creates a profile for new users.

-- 1. Create the function to be called
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

-- 2. Create the trigger that calls the function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
