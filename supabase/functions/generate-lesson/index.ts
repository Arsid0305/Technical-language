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

const TOPICS: { title: string; detail: string; beginner?: boolean }[] = [
  // ── BEGINNER VOCABULARY (lessons 1–8) ──────────────────────────────────────
  { beginner: true, title: 'Bug, Fix, Script, Run: Your First Dev Words', detail: 'bug (ошибка в коде), fix (исправить), script (файл с кодом для запуска), run / execute (запустить), error (ошибка), output (что напечатала программа), crash (упало), log (запись в консоли).' },
  { beginner: true, title: 'Push, Pull, Commit: Git Vocabulary', detail: 'commit (сохранить снимок кода), push (отправить на сервер), pull (получить чужие изменения), branch (ветка), merge (соединить ветки), clone (скачать репозиторий), fork (своя копия чужого репо), repository / repo (хранилище кода), staging area (что войдёт в коммит).' },
  { beginner: true, title: 'Deploy and Build: Getting Your App Live', detail: 'deploy (опубликовать приложение), build (собрать из исходников), release (выпустить версию), environment (dev/staging/production), production (живой сервер), preview (временная ссылка), pipeline (цепочка шагов), CI/CD.' },
  { beginner: true, title: 'Description, README, Comment: Reading Dev Docs', detail: 'description (краткое описание), README (главный файл документации), overview (обзор), getting started (как начать), usage (как использовать), install (установить), comment (комментарий в коде), TODO, FIXME, deprecated (устаревшее), returns (что возвращает), param / parameter.' },
  { beginner: true, title: 'Error Messages: What Went Wrong', detail: 'error, warning, failed, undefined, null, cannot find module, is not a function, expected … received …, traceback / stack trace.' },
  { beginner: true, title: 'GitHub: Issues, PRs, Reviews', detail: 'issue, pull request / PR, review, approve, request changes, merge, assign, label (bug/enhancement/good first issue), diff, conflict.' },
  { beginner: true, title: 'Auth: Sign In, Token, Magic Link', detail: 'authentication / auth, sign in / sign out, session, token, Magic Link, OTP, email verification, RLS — Row Level Security.' },
  { beginner: true, title: 'API, Fetch, Response: Talking to Servers', detail: 'API, request, response, fetch, endpoint, status code (200/404/500), JSON, payload, async / await, loading.' },

  // ── TOOL DEEP-DIVES (lessons 9+) ───────────────────────────────────────────
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
  { title: 'React Query: Async State Made Easy', detail: 'what TanStack React Query solves; useQuery and useMutation hooks; cache and staleTime; refetch and invalidate; loading / error / success states; why it replaces useEffect for data fetching' },
  { title: 'React Hook Form and Zod: Forms That Work', detail: 'why form state is hard; useForm and register; handleSubmit; validation with Zod resolver; displaying field errors; controlled vs uncontrolled inputs; the watch function' },
  { title: 'Data Formats: JSON, CSV, XLSX', detail: 'what JSON is and how to read it; JSON.parse and JSON.stringify; what CSV looks like; importing spreadsheet data (xlsx); what parse means; how data flows from file to app state' },
  { title: 'GitHub Actions: Secrets and Deploy Workflows', detail: 'adding GitHub Secrets; using secrets in yml with ${{ secrets.NAME }}; deploying to Vercel and Supabase via Actions; workflow triggers on path changes; reading action logs' },
  { title: 'TypeScript Advanced: Generics and Utility Types', detail: 'what generics solve; writing a generic function; generic React components; built-in utility types: Partial, Omit, Pick, ReturnType, Record; the satisfies operator' },
  { title: 'React Advanced: Custom Hooks and useCallback', detail: 'extracting reusable logic into custom hooks; naming convention use*; when useCallback prevents unnecessary re-renders; when NOT to over-optimize; React.memo basics' },

  // ── AI_OS / VIBE CODING WORKFLOW ──────────────────────────────────────────
  { title: 'Claude Code: Branches, Automerge, and CLAUDE.md', detail: 'claude/* branch naming; CLAUDE.md adapter file; automerge.yml workflow; "push to branch, CI merges to main"; subagent; haiku vs sonnet vs opus model; BIG task vs SMALL task; "разрабатывать на ветке claude/..., никогда не пушить напрямую в main"' },
  { title: 'Reading a Code Audit Report', detail: 'severity (critical / high / medium / low / info); root cause; consequence; recommended fix; confidence; "this will silently fail when…"; "the pattern X is vulnerable because…"; findings grouped by category (security / architecture / performance / code quality)' },
  { title: 'Vercel: Build Logs and Deployment Errors', detail: '"Build failed"; "Deployment ready"; "Error: Cannot find module"; preview deployment; production deployment; build minutes; install command; build command; environment variable; "Function Logs" in Vercel dashboard; redeploy; rollback deployment' },
  { title: 'GitHub Actions: Reading CI Workflow Logs', detail: 'workflow trigger (push / pull_request); job; step; runner; "Run npm ci"; "Process completed with exit code 1"; "Run npm run build"; workflow badge; re-run failed jobs; reading step output; "Error: …" vs "Warning: …"' },
  { title: 'TypeScript Compiler Errors: Decoding the Messages', detail: 'Type \'X\' is not assignable to type \'Y\'; Property \'X\' does not exist on type \'Y\'; Argument of type \'X\' is not assignable to parameter; Object is possibly \'undefined\'; Cannot find name \'X\'; strict null checks; ts(2345) / ts(2339)' },
  { title: 'Supabase Edge Functions: Deploy Logs and Runtime', detail: '"Function deployed successfully"; "Function failed to deploy"; Deno.env.get; CORS headers; cold start; service role key vs anon key; "Unhandled error"; AbortController timeout; response status 503; "Invalid JSON"' },
  { title: 'Supabase Dashboard: SQL Editor and Migrations', detail: 'SQL editor; migration file; ALTER TABLE; CREATE INDEX; RLS — Row Level Security; CREATE POLICY; USING (auth.uid() = user_id); WITH CHECK; supabase db push; "migration applied"; table editor; foreign key; transaction; rollback' },
  { title: 'Git Submodules: Design System Workflow', detail: 'git submodule; .gitmodules file; git submodule update --init; git submodule update --remote; detached HEAD in submodule; parent repository; nested repository; submodule path; "preview/" folder; "changes not staged for commit" in submodule' },
  { title: 'Cursor IDE: AI-Powered Coding Workflow', detail: 'Cursor IDE; Composer (multi-file AI edit); inline edit (Cmd+K); Accept suggestion (Tab); Reject (Esc); chat panel; @file mention; @codebase; diff view; .cursorrules file; Apply; "generating…"; context window in Cursor' },
  { title: 'Conventional Commits: Reading Your Git History', detail: 'feat: / fix: / chore: / refactor: / docs: / test: / build:; scope in parentheses — feat(auth):; BREAKING CHANGE:; commit SHA; git log --oneline; git blame; co-authored-by; "squash and merge"; semantic versioning (v1.2.3)' },
  { title: 'Telegram Bot API: WB_Bot Context', detail: 'bot token; BotFather; /setwebhook; getUpdates (polling); sendMessage; chat_id; message object; update; inline keyboard; callback_query; reply_markup; parse_mode (Markdown/HTML); bot username (@my_bot); "Forbidden: bot was blocked by the user"' },
  { title: 'Wildberries API: Marketplace Vocabulary', detail: 'marketplace; SKU (Stock Keeping Unit); barcode; warehouse; supply; listing; commission; FBO vs FBS (Fulfilled by Operator / by Seller); nomenclature (номенклатура); seller cabinet; analytics; stock; shipment; rate limit; API key' },
  { title: 'Movie Database API: kino-app Context', detail: 'TMDB (The Movie Database); query params (?query=…&page=1); pagination; genre; cast; rating; overview; release date; poster path; bearer token; "No results found"; search endpoint (/search/movie); similar movies; watchlist; IMDb ID' },
  { title: 'AI Prompting: System Messages and Context', detail: 'prompt; system message; user message; context window; temperature; token; "Return ONLY JSON"; few-shot example; chain-of-thought; hallucination; grounding; "You are a…"; task decomposition; response_format; role: "user" / "assistant" / "system"' },
  { title: 'React Error Messages: What They Really Mean', detail: '"Each child in a list should have a unique key prop"; "Cannot update a component while rendering a different component"; "React Hook is called conditionally"; "Too many re-renders"; "Can\'t perform a React state update on an unmounted component"; StrictMode double-invoke' },
  { title: 'Skincare Ingredient Vocabulary (English)', detail: 'ingredient; formula; routine (skincare routine); moisturiser; serum; toner; SPF / sunscreen; retinol; hyaluronic acid; niacinamide; exfoliant; AHA/BHA; skin type (oily / dry / combination / sensitive); skin concern; patch test; INCI name' },
  { title: 'Tavily: AI Search and Web Extraction API', detail: 'Tavily Search API; search query; search_depth (basic / advanced); include_answer; include_raw_content; max_results; tavily_search vs tavily_extract vs tavily_crawl vs tavily_research; MCP tool; API key; results array; url / title / content / score fields; grounding AI responses with web results' },
]

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req)

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json().catch(() => null)
    if (!body) {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: corsHeaders })
    }

    const lessonNumber = Number(body.lessonNumber)
    const mistakeCount = Number(body.mistakeCount ?? 0)
    const force = body.force === true

    if (!Number.isInteger(lessonNumber) || lessonNumber < 1 || lessonNumber > 10000) {
      return new Response(JSON.stringify({ error: 'Invalid lessonNumber' }), { status: 400, headers: corsHeaders })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const openaiKey = Deno.env.get('OPENAI_API_KEY')

    if (!supabaseUrl || !serviceKey || !openaiKey) {
      return new Response(JSON.stringify({ error: 'Service misconfigured' }), { status: 503, headers: corsHeaders })
    }

    if (!force) {
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
    }

    const topic = TOPICS[(lessonNumber - 1) % TOPICS.length]

    const difficultyHint =
      mistakeCount > 3
        ? 'The student made many mistakes — use simpler sentences.'
        : mistakeCount === 0 && lessonNumber > 1
        ? 'The student did perfectly — use slightly more natural phrasing.'
        : ''

    const isBeginnerLesson = topic.beginner === true

    const vocabItem = `{"word": "exact term", "translation": "перевод (1–4 слова)", "explanation": "1–2 предложения по-русски: что это значит и где встретишь", "example": "One real English sentence showing the word in a dev context"}` 

    const prompt = isBeginnerLesson
      ? `You are creating English vocabulary lessons for a Russian beginner developer. She uses these words in Russian daily but wants to recognise them in technical English.

Lesson ${lessonNumber} — VOCABULARY
Topic: ${topic.title}
Words: ${topic.detail}
${difficultyHint}

Write a SHORT text (180–220 words) using ALL vocabulary words naturally — like a GitHub comment thread, Slack message, or README section.

Return ONLY JSON:
{
  "text": {
    "id": "day-${lessonNumber}",
    "day": ${lessonNumber},
    "focus": "What vocabulary this lesson covers (English)",
    "focusRu": "То же по-русски",
    "title": "Lesson title",
    "content": "180–220 word natural developer text using all vocabulary words.",
    "vocabulary": [${vocabItem}]
  },
  "tasks": [{"id": "t${lessonNumber}-1", "type": "meaning", "question": "What does [word] mean?", "options": ["A","B","C","D"], "correctIndex": 0, "explanationRu": "По-русски"}],
  "extraPractice": [{"id": "e${lessonNumber}-1", "type": "meaning", "question": "Which sentence uses [word] correctly?", "options": ["A","B","C"], "correctIndex": 0, "explanationRu": "По-русски"}],
  "consolidation": [{"id": "c${lessonNumber}-1", "type": "meaning", "question": "Question on vocabulary", "options": ["A","B","C"], "correctIndex": 0, "explanationRu": "По-русски"}]
}

Requirements:
- vocabulary: 10–14 items, every word with translation + explanation + example
- tasks: 4 questions (what does X mean)
- extraPractice: 5 questions (correct usage)
- consolidation: exactly 3 questions
- All questions in English, all explanationRu in Russian`
      : `You are creating English reading lessons for a Russian developer who uses these tools daily. Goal: read technical English — docs, GitHub, error messages.

Lesson ${lessonNumber}
Topic: ${topic.title}
Concepts: ${topic.detail}
${difficultyHint}

Return ONLY JSON:
{
  "text": {
    "id": "day-${lessonNumber}",
    "day": ${lessonNumber},
    "focus": "What reading skill this lesson builds (English)",
    "focusRu": "То же по-русски",
    "title": "Lesson title",
    "content": "320–400 words. Natural dev English. Format to match the topic — e.g. a GitHub PR description with review thread, a CI workflow run log with step output, a Vercel build failure, TypeScript compiler errors in a code diff, a Supabase Edge Function with comments, a Telegram Bot API handler, a Claude Code audit section, a Conventional Commits git log. Pick the format that makes the vocabulary feel real and immediately recognisable.",
    "vocabulary": [${vocabItem}]
  },
  "tasks": [{"id": "t${lessonNumber}-1", "type": "meaning", "question": "Comprehension question", "options": ["A","B","C","D"], "correctIndex": 0, "explanationRu": "По-русски"}],
  "extraPractice": [{"id": "e${lessonNumber}-1", "type": "meaning", "question": "Vocabulary question", "options": ["A","B","C"], "correctIndex": 0, "explanationRu": "По-русски"}],
  "consolidation": [{"id": "c${lessonNumber}-1", "type": "meaning", "question": "Core concept question", "options": ["A","B","C"], "correctIndex": 0, "explanationRu": "По-русски"}]
}

Requirements:
- vocabulary: 8–12 items, each with translation + explanation + example
- tasks: 4–5 comprehension questions
- extraPractice: 5–6 vocabulary questions
- consolidation: exactly 3 questions
- All questions English, all explanationRu Russian`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 45000)

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    })

    clearTimeout(timeout)

    if (!openaiRes.ok) {
      const err = await openaiRes.json().catch(() => ({}))
      throw new Error(`OpenAI error ${openaiRes.status}: ${err.error?.message ?? 'unknown'}`)
    }

    const openaiData = await openaiRes.json()

    if (!openaiData.choices?.[0]?.message?.content) {
      throw new Error('Empty response from OpenAI')
    }

    const lessonContent = JSON.parse(openaiData.choices[0].message.content)

    if (
      !lessonContent.text?.content ||
      !lessonContent.text?.vocabulary?.length ||
      !Array.isArray(lessonContent.tasks) || lessonContent.tasks.length < 1 ||
      !Array.isArray(lessonContent.consolidation) || lessonContent.consolidation.length < 1
    ) {
      throw new Error('Invalid lesson structure from AI')
    }

    await fetch(`${supabaseUrl}/rest/v1/lessons`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
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
