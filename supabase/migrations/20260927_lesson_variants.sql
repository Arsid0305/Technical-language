-- Несколько вариантов генерации на один урок.
--
-- Было: lesson_number UNIQUE, одна строка на урок. Кнопка «перегенерировать»
-- затирала прежний вариант через upsert (Prefer: resolution=merge-duplicates).
-- Стало: на урок сколько угодно строк, каждая генерация — новая. Пользовательница
-- переключает варианты в интерфейсе, старые не пропадают.
--
-- Порядок выката важен: merge-duplicates требует уникального ограничения, поэтому
-- эта миграция применяется вместе с новой версией generate-lesson (она пишет
-- обычным INSERT). В переходном окне худшее, что бывает, — урок не попадёт
-- в кэш: функция не проверяет ответ на запись и всё равно отдаёт урок клиенту.

ALTER TABLE technical_language.lessons
  DROP CONSTRAINT IF EXISTS lessons_lesson_number_unique;

-- Выборка последнего варианта урока и списка вариантов идёт по (номер, дата).
CREATE INDEX IF NOT EXISTS lessons_number_created_idx
  ON technical_language.lessons (lesson_number, created_at DESC);
