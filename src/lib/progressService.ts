const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string
const DB_SCHEMA = 'technical_language'
const SYNC_KEY = 'user'

const baseHeaders = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
}

export async function fetchLatestProgress(): Promise<Record<string, unknown> | null> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/progress?device_id=eq.${SYNC_KEY}&select=data`,
    { headers: { ...baseHeaders, 'Accept-Profile': DB_SCHEMA } }
  )
  if (!res.ok) {
    console.error('[progress] fetch failed:', res.status, await res.text().catch(() => ''))
    return null
  }
  const rows = await res.json()
  return rows[0]?.data ?? null
}

export async function saveProgressToSupabase(
  data: Record<string, unknown>
): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/progress`, {
    method: 'POST',
    headers: { ...baseHeaders, 'Content-Profile': DB_SCHEMA, Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify({ device_id: SYNC_KEY, data, updated_at: new Date().toISOString() }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error('[progress] save failed:', res.status, text)
  }
}
