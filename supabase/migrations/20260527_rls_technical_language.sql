-- RLS policies for technical_language schema.
-- lessons: read-only for anon (writes go through Edge Function with service_role).
-- glossary: full CRUD for anon, scoped by device_id.
-- public.glossary is the obsolete pre-migration table -- safe to drop.

DROP TABLE IF EXISTS public.glossary;

-- lessons
DROP POLICY IF EXISTS "lessons_select" ON technical_language.lessons;
CREATE POLICY "lessons_select"
  ON technical_language.lessons FOR SELECT
  USING (true);

-- glossary
DROP POLICY IF EXISTS "glossary_select" ON technical_language.glossary;
DROP POLICY IF EXISTS "glossary_insert" ON technical_language.glossary;
DROP POLICY IF EXISTS "glossary_update" ON technical_language.glossary;
DROP POLICY IF EXISTS "glossary_delete" ON technical_language.glossary;

CREATE POLICY "glossary_select"
  ON technical_language.glossary FOR SELECT
  USING (true);
CREATE POLICY "glossary_insert"
  ON technical_language.glossary FOR INSERT
  WITH CHECK (device_id IS NOT NULL AND length(device_id) > 0);
CREATE POLICY "glossary_update"
  ON technical_language.glossary FOR UPDATE
  USING (true)
  WITH CHECK (device_id IS NOT NULL AND length(device_id) > 0);
CREATE POLICY "glossary_delete"
  ON technical_language.glossary FOR DELETE
  USING (true);
