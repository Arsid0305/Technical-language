const ALLOWED_ORIGINS = [
  'https://technical-language.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
]

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') ?? ''
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req)

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { word } = await req.json()
    const openaiKey = Deno.env.get('OPENAI_API_KEY')!

    const prompt = `You are a bilingual technical English dictionary for Russian developers.

The user searched for: "${word}"

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

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    })

    const data = await res.json()
    const result = JSON.parse(data.choices[0].message.content)

    result.word = (result.word as string).toLowerCase().trim()

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    })
  }
})
