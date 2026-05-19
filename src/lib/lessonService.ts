import type { DailyLesson } from '@/data/dailyContent';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

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
