-- Grant service_role USAGE on technical_language schema
-- Fixes: Edge Function getting 403 on all /rest/v1/lessons requests
GRANT USAGE ON SCHEMA technical_language TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA technical_language TO service_role;

-- Unique constraint on lesson_number enables correct upsert in the Edge Function
-- (Prefer: resolution=merge-duplicates needs a unique column to conflict on)
ALTER TABLE technical_language.lessons
  ADD CONSTRAINT lessons_lesson_number_unique UNIQUE (lesson_number);

-- RLS policies for memories table (had RLS enabled but no policies)
CREATE POLICY IF NOT EXISTS "memories_select" ON technical_language.memories FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "memories_insert" ON technical_language.memories FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "memories_update" ON technical_language.memories FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "memories_delete" ON technical_language.memories FOR DELETE USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON technical_language.memories TO anon, authenticated;
