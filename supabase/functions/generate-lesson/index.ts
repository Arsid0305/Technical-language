const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const TOPICS = [
  { title: 'The Terminal — Your First Tool', detail: 'cd, ls/dir, pwd, mkdir, rm; what a file path is; flags and arguments; tab completion; running scripts from the terminal' },
  { title: 'Git: Saving Your Work', detail: 'what version control solves; git init, git status, git add, git commit -m; the staging area; .gitignore; reading git log' },
  { title: 'Git Branches: Working in Parallel', detail: 'why branches exist; git branch, git checkout, git switch; HEAD pointer; merging with git merge; fast-forward vs merge commit; git log --graph' },
  { title: 'GitHub: Your Code in the Cloud', detail: 'remote vs local repository; git push, git pull, git clone; what origin means; how GitHub adds collaboration on top of Git; the GitHub UI' },
  { title: 'Pull Requests: Proposing Changes', detail: 'what a PR is and why teams use them; base vs head branch; opening a PR; reading a diff; review comments; merge vs squash vs rebase options in GitHub' },
  { title: 'npm and package.json: Managing Dependencies', detail: 'what a package manager solves; dependencies vs devDependencies; npm install vs npm ci; the scripts section; what node_modules is; package-lock.json' },
  { title: 'GitHub Actions: Automating Your Workflow', detail: 'what CI/CD means; workflow yml structure; on: triggers (push, pull_request); jobs and steps; runners; using secrets; why developers automate builds and deploys' },
  { title: 'Vercel: Deploying Your Frontend', detail: 'what deployment means; how Vercel connects to GitHub; automatic deploys on push to main; preview deployments on PRs; environment variables in Vercel dashboard' },
  { title: 'TypeScript: Adding Types to JavaScript', detail: 'why types catch bugs early; type annotations; interfaces; type vs interface; optional properties with ?; how TypeScript compiles to JavaScript; tsconfig basics' },
  { title: 'React Components and Props', detail: 'what a component is; JSX syntax; passing props down; the children prop; component composition; when to split into smaller components; naming conventions' },
  { title: 'React Hooks: useState and useEffect', detail: 'what hooks solve; useState for reactive data; useEffect for side effects; the dependency array; cleanup functions; common mistakes and how to avoid them' },
  { title: 'Supabase: Your Database and Backend', detail: 'what a relational database is; tables, rows and columns; Supabase dashboard; anon vs service role keys; making queries via the REST API; Row Level Security concept' },
  { title: 'Supabase Edge Functions: Serverless Logic', detail: 'what serverless means; when to use Edge Functions instead of frontend code; Deno runtime differences from Node; deploying with Supabase CLI; accessing secrets safely' },
  { title: 'Tailwind CSS: Styling Without Writing CSS', detail: 'utility-first approach; common class patterns for flex, grid, spacing, colors; responsive prefixes (sm:, md:, lg:); dark: prefix; customizing tailwind.config' },
  { title: 'Git Advanced: Stash, Rebase, and Conflicts', detail: 'git stash and git stash pop; rebase vs merge explained clearly; interactive rebase with git rebase -i; how to read and resolve a merge conflict step by step' },
  { title: 'shadcn/ui: Ready-Made Components', detail: 'what a component library is; adding components with npx shadcn-ui add; theming with CSS variables; customizing component source; when to use vs build your own' },
  { title: 'Supabase Auth: Email OTP and RLS', detail: 'how authentication works in Supabase; email OTP vs magic link; signInWithOtp and verifyOtp; RLS policies; the auth.uid() function; protecting data by user' },
  { title: 'Claude Code: Working with AI Coding Assistants', detail: 'how to write effective prompts for code tasks; being specific about what you want; what MCP tools are; reading AI-generated code critically; iterating on results' },
  { title: 'Vite: The Modern Build Tool', detail: 'what a bundler does; Vite dev server and Hot Module Replacement; building for production with vite build; path aliases (@/); the difference between dev and prod builds' },
  { title: 'PowerShell: The Windows Terminal', detail: 'PowerShell vs bash/zsh key differences; common PowerShell commands (Get-ChildItem, Set-Location, Copy-Item); running npm scripts; execution policy; Windows path conventions' },
  { title: 'Zod: Validating Data at Runtime', detail: 'why runtime validation matters beyond TypeScript types; defining schemas with z.object; .parse() vs .safeParse(); combining Zod with TypeScript; validating API responses' },
  { title: 'Environment Variables: Configuration Done Right', detail: 'what env vars are; .env files and .env.example; VITE_ prefix for browser access; keeping secrets out of code; different values per environment; always .gitignore your .env' },
  { title: 'GitHub Actions: Secrets and Deploy Workflows', detail: 'adding GitHub Secrets; using secrets in yml with ${{ secrets.NAME }}; deploying to Vercel and Supabase via Actions; workflow triggers on path changes; reading action logs' },
  { title: 'TypeScript Advanced: Generics and Utility Types', detail: 'what generics solve; writing a generic function; generic React components; built-in utility types: Partial, Omit, Pick, ReturnType, Record; the satisfies operator' },
  { title: 'React Advanced: Custom Hooks and useCallback', detail: 'extracting reusable logic into custom hooks; naming convention use*; when useCallback prevents unnecessary re-renders; when NOT to over-optimize; React.memo basics' },
]

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { lessonNumber, mistakeCount = 0 } = await req.json()

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Return cached lesson if it exists
    const existingRes = await fetch(
      `${supabaseUrl}/rest/v1/lessons?lesson_number=eq.${lessonNumber}&select=content`,
      { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
    )
    const existing = await existingRes.json()
    if (existing.length > 0) {
      return new Response(JSON.stringify(existing[0].content), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const topic = TOPICS[(lessonNumber - 1) % TOPICS.length]
    const openaiKey = Deno.env.get('OPENAI_API_KEY')!

    const difficultyHint =
      mistakeCount > 3
        ? 'The student made many mistakes on the previous lesson — use simpler sentence structures and include more vocabulary hints.'
        : mistakeCount === 0 && lessonNumber > 1
        ? 'The student did perfectly on the previous lesson — you can use slightly more advanced phrasing.'
        : ''

    const prompt = `You are creating English reading lessons for a Russian developer who already knows these tools in Russian and uses them daily. They want to learn to READ technical English — docs, GitHub comments, Stack Overflow answers, error messages.

Lesson ${lessonNumber}
Topic: ${topic.title}
Key concepts: ${topic.detail}
${difficultyHint}

Return ONLY a JSON object, no markdown, no explanation:
{
  "text": {
    "id": "day-${lessonNumber}",
    "day": ${lessonNumber},
    "focus": "One sentence in English: what reading skill this lesson builds",
    "focusRu": "То же по-русски",
    "title": "Lesson title in English",
    "content": "Reading text 320-400 words. Write like a developer explains to a colleague — natural technical English. Include real commands (git commit -m, npm ci), actual error message phrasing, real patterns from docs. Do NOT oversimplify or use classroom language.",
    "vocabulary": [
      {"word": "term or phrase from the text", "translation": "перевод"}
    ]
  },
  "tasks": [
    {
      "id": "t${lessonNumber}-1",
      "type": "meaning",
      "question": "Question in English testing reading comprehension",
      "options": ["option A", "option B", "option C", "option D"],
      "correctIndex": 0,
      "explanationRu": "Объяснение по-русски почему этот ответ правильный"
    }
  ],
  "extraPractice": [
    {
      "id": "e${lessonNumber}-1",
      "type": "meaning",
      "question": "Vocabulary question: what does X mean in this context?",
      "options": ["option A", "option B", "option C"],
      "correctIndex": 1,
      "explanationRu": "Объяснение по-русски"
    }
  ],
  "consolidation": [
    {
      "id": "c${lessonNumber}-1",
      "type": "meaning",
      "question": "Question about the main concept from the lesson",
      "options": ["option A", "option B", "option C"],
      "correctIndex": 0,
      "explanationRu": "Объяснение по-русски"
    }
  ]
}

Requirements:
- vocabulary: 8-12 items (real phrases and collocations from your text)
- tasks: 4-5 comprehension questions
- extraPractice: 5-6 vocabulary questions
- consolidation: exactly 3 questions on the core concept
- All questions in English, all explanationRu in Russian
- Text must feel authentic: real commands, real error phrasing, the kind of English developers actually write`

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    })

    const openaiData = await openaiRes.json()
    const lessonContent = JSON.parse(openaiData.choices[0].message.content)

    // Cache in DB
    await fetch(`${supabaseUrl}/rest/v1/lessons`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ lesson_number: lessonNumber, content: lessonContent }),
    })

    return new Response(JSON.stringify(lessonContent), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
