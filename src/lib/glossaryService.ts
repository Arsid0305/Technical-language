import type { GlossaryEntry } from '@/hooks/useProgress'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

const DB_SCHEMA = 'technical_language'

// Один словарь на все устройства — как прогресс (SYNC_KEY в progressService, SEC-9).
// Пользовательница одна, входа по логину нет. Раньше ключом был UUID устройства,
// и словарь расползался: 722 строки на 92 слова по 12 устройствам.
const GLOSSARY_KEY = 'user'

export function getGlossaryKey(): string {
  return GLOSSARY_KEY
}

const baseHeaders = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
}

export async function fetchGlossaryFromSupabase(
  deviceId: string
): Promise<Record<string, GlossaryEntry>> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/glossary?device_id=eq.${encodeURIComponent(deviceId)}&select=*`,
    { headers: { ...baseHeaders, 'Accept-Profile': DB_SCHEMA } }
  )
  if (!res.ok) return {}
  const rows: {
    word: string
    translation: string
    explanation: string | null
    explanation_ru: string | null
    example: string | null
    example_ru: string | null
    manual: boolean
  }[] = await res.json()
  return Object.fromEntries(
    rows.map((r) => [
      r.word,
      {
        translation: r.translation,
        explanation: r.explanation ?? undefined,
        explanationRu: r.explanation_ru ?? undefined,
        example: r.example ?? undefined,
        exampleRu: r.example_ru ?? undefined,
        manual: r.manual,
      } satisfies GlossaryEntry,
    ])
  )
}

export async function upsertGlossaryWord(
  deviceId: string,
  word: string,
  entry: GlossaryEntry
): Promise<void> {
  // on_conflict обязателен: без него merge-duplicates сравнивает по первичному ключу id,
  // которого нет в теле, и каждое сохранение создаёт новую строку-дубль.
  await fetch(`${SUPABASE_URL}/rest/v1/glossary?on_conflict=device_id,word`, {
    method: 'POST',
    headers: { ...baseHeaders, 'Content-Profile': DB_SCHEMA, Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify({
      device_id: deviceId,
      word,
      translation: entry.translation,
      explanation: entry.explanation ?? null,
      explanation_ru: entry.explanationRu ?? null,
      example: entry.example ?? null,
      example_ru: entry.exampleRu ?? null,
      manual: entry.manual ?? false,
    }),
  })
}

export async function deleteGlossaryWord(
  deviceId: string,
  word: string
): Promise<void> {
  await fetch(
    `${SUPABASE_URL}/rest/v1/glossary?device_id=eq.${encodeURIComponent(deviceId)}&word=eq.${encodeURIComponent(word)}`,
    { method: 'DELETE', headers: { ...baseHeaders, 'Content-Profile': DB_SCHEMA } }
  )
}
