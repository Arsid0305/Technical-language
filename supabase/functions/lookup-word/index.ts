const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { word } = await req.json()
    const openaiKey = Deno.env.get('OPENAI_API_KEY')!

    const prompt = `You are a technical English dictionary for Russian developers learning to read dev docs and code.

Look up this term: "${word}"

Return ONLY a JSON object, no markdown:
{
  "word": "${word}",
  "translation": "перевод на русский (1–4 слова)",
  "explanation": "2–3 предложения по-русски: что это такое, зачем используется, где встретишь в разработке",
  "example": "Одно предложение на английском: реальный пример из GitHub, терминала, документации или комментария разработчика"
}

If "${word}" is not a technical term, still explain it in a developer context.`

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
