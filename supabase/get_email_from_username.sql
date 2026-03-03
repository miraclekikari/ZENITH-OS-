
CREATE OR REPLACE FUNCTION get_email_from_username(p_username TEXT)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
  user_email text;
BEGIN
  -- 1. Find the user_id from the public profiles table based on the username
  SELECT id INTO user_id FROM public.profiles WHERE username = p_username LIMIT 1;

  -- If no profile is found, return NULL
  IF user_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- 2. Use the found user_id to get the email from the auth.users table
  SELECT email INTO user_email FROM auth.users WHERE id = user_id;

  RETURN user_email;
END;
$$;
