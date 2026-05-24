-- Per-device vocabulary glossary.
-- device_id is a random UUID stored in localStorage (no real auth).
CREATE TABLE IF NOT EXISTS glossary (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id      TEXT        NOT NULL,
  word           TEXT        NOT NULL,
  translation    TEXT        NOT NULL,
  explanation    TEXT,
  explanation_ru TEXT,
  example        TEXT,
  example_ru     TEXT,
  manual         BOOLEAN     DEFAULT false,
  created_at     TIMESTAMPTZ DEFAULT now(),
  UNIQUE (device_id, word)
);

CREATE INDEX IF NOT EXISTS glossary_device_idx ON glossary (device_id);

ALTER TABLE glossary ENABLE ROW LEVEL SECURITY;

-- Explicit per-operation policies (replaces the original 'allow all').
-- TODO: once anonymous auth (SEC-3) is implemented, scope USING/WITH CHECK
-- to auth.uid()::text = device_id for true row-level isolation.
CREATE POLICY "glossary_select"
  ON glossary FOR SELECT
  USING (true);

CREATE POLICY "glossary_insert"
  ON glossary FOR INSERT
  WITH CHECK (device_id IS NOT NULL AND length(device_id) > 0);

CREATE POLICY "glossary_update"
  ON glossary FOR UPDATE
  USING (true)
  WITH CHECK (device_id IS NOT NULL AND length(device_id) > 0);

CREATE POLICY "glossary_delete"
  ON glossary FOR DELETE
  USING (true);
