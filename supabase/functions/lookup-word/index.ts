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

    const prompt = `You are a bilingual technical English dictionary for Russian developers learning to read dev docs.

Look up this term: "${word}"

Return ONLY a JSON object, no markdown:
{
  "word": "${word}",
  "translation": "перевод на русский (1–4 слова)",
  "explanation": "Definition in English: 1-2 clear sentences explaining what this term means in a developer context.",
  "explanationRu": "То же по-русски: 1–2 предложения.",
  "example": "One real English sentence showing this word in a developer context (GitHub comment, terminal output, error message, or docs).",
  "exampleRu": "Перевод примера на русский."
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
