// deploy: 2026-05-27
const ALLOWED_ORIGINS = new Set([
  'https://technical-language.vercel.app',
])

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('Origin') ?? ''
  const allowed = ALLOWED_ORIGINS.has(origin) || /^http:\/\/localhost(:\d+)?$/.test(origin)
  return {
    'Access-Control-Allow-Origin': allowed ? origin : '',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for') ?? req.headers.get('cf-connecting-ip') ?? 'unknown'
  return forwarded.split(',')[0].trim()
}

async function verifySupabaseJwt(token: string, secret: string): Promise<boolean> {
  const parts = token.split('.')
  if (parts.length !== 3) return false
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )
    const data = new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
    const b64 = parts[2].replace(/-/g, '+').replace(/_/g, '/')
    const sig = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
    return await crypto.subtle.verify('HMAC', key, sig, data)
  } catch {
    return false
  }
}

async function checkRateLimit(
  supabaseUrl: string,
  serviceKey: string,
  req: Request,
  fnName: string,
  limitPerHour: number
): Promise<boolean> {
  const ip = getClientIp(req)
  const now = new Date()
  now.setMinutes(0, 0, 0, 0)
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/check_rate_limit`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p_key: `${fnName}:${ip}`,
        p_window: now.toISOString(),
        p_limit: limitPerHour,
      }),
    })
    if (!res.ok) {
      console.error(`checkRateLimit RPC failed for lookup-word: HTTP ${res.status}`)
      return false
    }
    return await res.json() as boolean
  } catch (e) {
    console.error(`checkRateLimit exception for lookup-word:`, e)
    return false
  }
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req)

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!openaiKey) {
      return new Response(JSON.stringify({ error: 'Service misconfigured' }), { status: 503, headers: corsHeaders })
    }

    const jwtSecret = Deno.env.get('SUPABASE_JWT_SECRET')
    if (jwtSecret) {
      const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '')
      if (!token || !(await verifySupabaseJwt(token, jwtSecret))) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    if (supabaseUrl && serviceKey) {
      const allowed = await checkRateLimit(supabaseUrl, serviceKey, req, 'lookup-word', 50)
      if (!allowed) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Try again in an hour.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '3600' } }
        )
      }
    }

    const body = await req.json().catch(() => null)
    if (!body) {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: corsHeaders })
    }

    const word = body.word
    if (!word || typeof word !== 'string' || word.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid word' }), { status: 400, headers: corsHeaders })
    }

    const sanitizedWord = word.trim().slice(0, 100)

    const prompt = `You are a bilingual technical English dictionary for Russian developers.

The user searched for: ${JSON.stringify(sanitizedWord)}

This may be in Russian or English. Your job:
1. Identify the correct ENGLISH technical term (even if the input is in Russian, e.g. "стек" → "stack", "деплой" → "deploy")
2. Return the canonical English term in the "word" field — always in English, never in Russian

Return ONLY a JSON object, no markdown:
{
  "word": "canonical English term (ALWAYS in English)",
  "translation": "перевод на русский (1–4 слова)",
  "explanation": "Definition in English: 1-2 clear sentences explaining what this term means in a developer context.",
  "explanationRu": "То же по-русски: 1–2 предложения.",
  "example": "One real English sentence showing this word in a developer context (GitHub comment, terminal, error message, or docs).",
  "exampleRu": "Перевод примера на русский."
}`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    })

    clearTimeout(timeout)

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))    
      throw new Error(`OpenAI error ${res.status}: ${err.error?.message ?? 'unknown'}`)
    }

    const data = await res.json()

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Empty response from OpenAI')
    }

    const result = JSON.parse(data.choices[0].message.content)

    result.word = (result.word as string).toLowerCase().trim()

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
