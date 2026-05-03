import type { GlossaryEntry } from '@/hooks/useProgress'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

const DEVICE_ID_KEY = 'vibe-eng-device-id'

export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(DEVICE_ID_KEY, id)
  }
  return id
}

const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
}

export async function fetchGlossaryFromSupabase(
  deviceId: string
): Promise<Record<string, GlossaryEntry>> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/glossary?device_id=eq.${encodeURIComponent(deviceId)}&select=*`,
    { headers }
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
  await fetch(`${SUPABASE_URL}/rest/v1/glossary`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'resolution=merge-duplicates' },
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
    { method: 'DELETE', headers }
  )
}
