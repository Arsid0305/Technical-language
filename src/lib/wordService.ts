const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export interface WordLookup {
  word: string
  translation: string
  explanation: string
  explanationRu: string
  example: string
  exampleRu: string
}

export async function lookupWord(word: string): Promise<WordLookup> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/lookup-word`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ word: word.trim() }),
  })
  if (!res.ok) throw new Error('Failed to look up word')
  return res.json()
}
