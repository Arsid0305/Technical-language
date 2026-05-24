import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

let _token: Promise<string> | null = null

export function getAuthToken(): Promise<string> {
  if (!_token) {
    _token = (async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) return session.access_token
      const { data, error } = await supabase.auth.signInAnonymously()
      if (error || !data.session) throw new Error('Anonymous auth failed')
      return data.session.access_token
    })()
  }
  return _token
}
