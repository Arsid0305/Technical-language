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
    if (!res.ok) return true
    return await res.json() as boolean
  } catch {
    return true
  }
}

async function verifyJWT(supabaseUrl: string, anonKey: string, req: Request): Promise<boolean> {
  const auth = req.headers.get('Authorization')
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return false
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
    })
    return res.ok
  } catch {
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
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

    if (!openaiKey || !supabaseUrl) {
      return new Response(JSON.stringify({ error: 'Service misconfigured' }), { status: 503, headers: corsHeaders })
    }

    const authed = await verifyJWT(supabaseUrl, anonKey, req)
    if (!authed) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (serviceKey) {
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
    if (!word || typeof word !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid word' }), { status: 400, headers: corsHeaders })
    }

    const sanitizedWord = word
      .replace(/[\x00-\x1f\x7f-\x9f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 100)

    if (sanitizedWord.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid word' }), { status: 400, headers: corsHeaders })
    }

    const systemPrompt = `You are a bilingual technical English dictionary for Russian developers.
The user will provide a technical term (in English or Russian transliteration).
Your job:
1. Identify the correct canonical ENGLISH technical term (e.g. "стек" → "stack", "деплой" → "deploy").
2. Return ONLY a JSON object — no markdown, no extra text:
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
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: sanitizedWord },
        ],
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
