-- Lesson cache: AI-generated lessons keyed by lesson_number.
-- Populated exclusively by the generate-lesson Edge Function (service_role).
CREATE TABLE IF NOT EXISTS lessons (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_number INTEGER     NOT NULL UNIQUE,
  content       JSONB       NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Anon users may only read cached lessons.
-- INSERT / UPDATE / DELETE are blocked (no policy → denied).
CREATE POLICY "read lessons"
  ON lessons FOR SELECT
  USING (true);
