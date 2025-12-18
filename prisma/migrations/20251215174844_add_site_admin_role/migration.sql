-- Fix sequence if needed and add site-admin role if it doesn't exist
DO $$
DECLARE
  max_id INTEGER;
BEGIN
  -- Get the maximum ID from Role table
  SELECT COALESCE(MAX(id), 0) INTO max_id FROM "Role";
  
  -- Reset sequence to be higher than max_id
  IF max_id > 0 THEN
    PERFORM setval('"Role_id_seq"', max_id);
  END IF;
  
  -- Add site-admin role if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM "Role" WHERE slug = 'site-admin') THEN
    INSERT INTO "Role" (title, slug) VALUES ('Site Admin', 'site-admin');
  END IF;
END $$;

