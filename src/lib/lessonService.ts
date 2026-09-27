import type { DailyLesson } from '@/data/dailyContent';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
const DB_SCHEMA = 'technical_language';

export interface LessonVariant {
  id: string;
  lesson: DailyLesson;
  createdAt: string;
}

/**
 * Все сохранённые генерации урока, от старой к новой.
 * Таблица уроков открыта на чтение (политика lessons_select), поэтому
 * список берём напрямую, без Edge Function.
 */
export async function fetchLessonVariants(lessonNumber: number): Promise<LessonVariant[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/lessons?lesson_number=eq.${lessonNumber}&select=id,content,created_at&order=created_at.asc`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Accept-Profile': DB_SCHEMA,
      },
    }
  );
  if (!res.ok) {
    console.error('[lessons] fetch variants failed:', res.status);
    return [];
  }
  const rows = await res.json();
  return rows.map((r: { id: string; content: DailyLesson; created_at: string }) => ({
    id: r.id,
    lesson: r.content,
    createdAt: r.created_at,
  }));
}

export async function fetchOrGenerateLesson(
  lessonNumber: number,
  mistakeCount = 0,
  force = false
): Promise<DailyLesson> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-lesson`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ lessonNumber, mistakeCount, force }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  return res.json();
}

/**
 * Варианты урока для показа. Если ни одного нет — генерируем первый.
 * Запасной путь на случай, если запись в кэш не прошла: отдаём то,
 * что вернула функция, чтобы урок всё равно открылся.
 */
export async function loadLessonVariants(
  lessonNumber: number,
  mistakeCount = 0
): Promise<LessonVariant[]> {
  const existing = await fetchLessonVariants(lessonNumber);
  if (existing.length > 0) return existing;

  const fresh = await fetchOrGenerateLesson(lessonNumber, mistakeCount);
  const saved = await fetchLessonVariants(lessonNumber);
  return saved.length > 0
    ? saved
    : [{ id: 'unsaved', lesson: fresh, createdAt: new Date().toISOString() }];
}
