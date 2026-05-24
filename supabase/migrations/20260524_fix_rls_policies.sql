-- Applied 2026-05-24: replace glossary 'allow all' with explicit policies.
-- (Baseline table + policy creation is in 20260501_create_glossary.sql)

DROP POLICY IF EXISTS "allow all" ON glossary;

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
