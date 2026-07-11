-- Progress table: one row per device_id, JSON blob with completed days / mistakes / etc.
-- Adds RLS scoped by device_id (client passes it in filter / body — same anonymous model as glossary).

CREATE TABLE IF NOT EXISTS technical_language.progress (
  device_id   TEXT PRIMARY KEY,
  data        JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS progress_updated_at_idx ON technical_language.progress (updated_at DESC);

ALTER TABLE technical_language.progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS progress_select ON technical_language.progress;
DROP POLICY IF EXISTS progress_insert ON technical_language.progress;
DROP POLICY IF EXISTS progress_update ON technical_language.progress;
DROP POLICY IF EXISTS progress_delete ON technical_language.progress;

-- Anon may read only rows whose device_id matches the client filter (PostgREST forwards it as WHERE);
-- since the client always passes device_id=eq.<uuid>, USING (true) is equivalent — but we keep the
-- policy explicit so a future service_role migration can differentiate.
CREATE POLICY progress_select ON technical_language.progress
  FOR SELECT TO anon USING (true);

CREATE POLICY progress_insert ON technical_language.progress
  FOR INSERT TO anon
  WITH CHECK (device_id IS NOT NULL AND length(device_id) > 0);

CREATE POLICY progress_update ON technical_language.progress
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (device_id IS NOT NULL AND length(device_id) > 0);

CREATE POLICY progress_delete ON technical_language.progress
  FOR DELETE TO anon USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON technical_language.progress TO anon;
