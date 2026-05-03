const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const TOPICS: { title: string; detail: string; beginner?: boolean }[] = [
  // ── BEGINNER VOCABULARY (lessons 1–8) ──────────────────────────────────────
  {
    beginner: true,
    title: 'Bug, Fix, Script, Run: Your First Dev Words',
    detail: 'bug (ошибка в коде), fix (исправить), script (файл с кодом для запуска), run / execute (запустить), error (ошибка), output (что напечатала программа), crash (упало), log (запись в консоли). Show each word in 1–2 real sentences a developer would actually write — GitHub comments, commit messages, terminal output.',
  },
  {
    beginner: true,
    title: 'Push, Pull, Commit: Git Vocabulary',
    detail: 'commit (сохранить снимок кода), push (отправить на сервер), pull (получить чужие изменения), branch (ветка), merge (соединить ветки), clone (скачать репозиторий), fork (своя копия чужого репо), repository / repo (хранилище кода), staging area (что войдёт в коммит). Show each word in realistic git workflow sentences.',
  },
  {
    beginner: true,
    title: 'Deploy and Build: Getting Your App Live',
    detail: 'deploy (опубликовать приложение), build (собрать из исходников), release (выпустить версию), environment (окружение: dev / staging / production), production (живой сервер), preview (временная ссылка для проверки), pipeline (цепочка шагов автоматизации), CI/CD (непрерывная интеграция и деплой). Show each word in Vercel dashboard text, GitHub Actions logs, team Slack messages.',
  },
  {
    beginner: true,
    title: 'Description, README, Comment: Reading Dev Docs',
    detail: 'description (краткое описание), README (главный файл документации), overview (обзор), getting started (как начать), usage (как использовать), install (установить), comment (комментарий в коде), TODO (задача прямо в коде), FIXME (известный баг в коде), deprecated (устаревшее — не использовать), returns (что возвращает функция), param / parameter (аргумент функции). Show each in real README snippets and code comments.',
  },
  {
    beginner: true,
    title: 'Error Messages: What Went Wrong',
    detail: 'error (ошибка), warning (предупреждение, не критично), failed (провалилось), undefined (переменная не объявлена), null (специально пусто), cannot find module (модуль не найден — npm install?), is not a function (вызываешь не функцию), expected … received … (TypeScript говорит что ожидал и что получил), traceback / stack trace (цепочка вызовов до ошибки). Use real terminal / browser console output as examples.',
  },
  {
    beginner: true,
    title: 'GitHub: Issues, PRs, Reviews',
    detail: 'issue (задача или сообщение об ошибке), pull request / PR (предложение изменений для проверки), review (проверка кода), approve (одобрить), request changes (попросить переделать), merge (принять изменения), assign (назначить на кого-то), label (метка: bug / enhancement / good first issue), diff (что изменилось), conflict (два человека изменили одно место). Use GitHub UI text and real PR comment phrasing.',
  },
  {
    beginner: true,
    title: 'Auth: Sign In, Token, Magic Link',
    detail: 'authentication / auth (авторизация), sign in / sign out (войти / выйти), session (сессия — «ты залогинен»), token (ключ доступа), Magic Link (ссылка для входа без пароля на почту), OTP (одноразовый код), email verification (подтверждение почты), RLS — Row Level Security (пользователь видит только свои данные). Use Supabase docs phrasing and real auth error messages.',
  },
  {
    beginner: true,
    title: 'API, Fetch, Response: Talking to Servers',
    detail: 'API (интерфейс для общения с сервером), request (запрос), response (ответ), fetch (сделать запрос из кода), endpoint (конкретный адрес API), status code (200 OK, 404 Not Found, 500 Server Error), JSON (формат данных), payload (данные внутри запроса), async / await (ждём ответ не блокируя страницу), loading (пока ждём ответа). Use real fetch() code snippets and API response examples.',
  },

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
]

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { lessonNumber, mistakeCount = 0 } = await req.json()

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

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
        ? 'The student made many mistakes — use even simpler sentences and add more translation hints in parentheses.'
        : mistakeCount === 0 && lessonNumber > 1
        ? 'The student did perfectly — you can use slightly more natural phrasing.'
        : ''

    const isBeginnerLesson = topic.beginner === true

    const vocabFormat = `{"word": "exact term from text", "translation": "перевод", "explanation": "1–2 предложения по-русски: что это значит и где встретишь"}`

    const prompt = isBeginnerLesson
      ? `You are creating English vocabulary lessons for a Russian beginner developer. She already uses these words in Russian daily (баг, деплой, пуш, etc.) but wants to recognise and understand them when reading technical English.

Lesson ${lessonNumber} — VOCABULARY LESSON
Topic: ${topic.title}
Words to cover: ${topic.detail}
${difficultyHint}

Write a SHORT reading text (180–220 words) that naturally uses ALL the vocabulary words listed. The text should feel like a real developer message — a GitHub comment thread, a team Slack message, a short README section, or a developer blog intro. DO NOT write a dictionary. Embed the words in context. Keep sentences short and clear.

Return ONLY a JSON object, no markdown:
{
  "text": {
    "id": "day-${lessonNumber}",
    "day": ${lessonNumber},
    "focus": "One sentence in English: what vocabulary this lesson covers",
    "focusRu": "То же по-русски",
    "title": "Lesson title in English",
    "content": "180–220 word text. Natural developer English. Use ALL vocabulary words from the topic naturally in context.",
    "vocabulary": [
      ${vocabFormat}
    ]
  },
  "tasks": [
    {
      "id": "t${lessonNumber}-1",
      "type": "meaning",
      "question": "What does [word from text] mean?",
      "options": ["option A", "option B", "option C", "option D"],
      "correctIndex": 0,
      "explanationRu": "Объяснение по-русски"
    }
  ],
  "extraPractice": [
    {
      "id": "e${lessonNumber}-1",
      "type": "meaning",
      "question": "Which sentence uses [word] correctly?",
      "options": ["option A", "option B", "option C"],
      "correctIndex": 1,
      "explanationRu": "Объяснение по-русски"
    }
  ],
  "consolidation": [
    {
      "id": "c${lessonNumber}-1",
      "type": "meaning",
      "question": "Question checking understanding of the vocabulary in context",
      "options": ["option A", "option B", "option C"],
      "correctIndex": 0,
      "explanationRu": "Объяснение по-русски"
    }
  ]
}

Requirements:
- vocabulary: list EVERY word from the topic (10–14 items), each with word + translation + explanation
- explanation: 1–2 sentences in Russian — practical, what it means in action, where you see it
- tasks: 4 questions — each asks what a specific word means
- extraPractice: 5 questions — choose the correct usage of a word
- consolidation: exactly 3 questions testing overall understanding
- All questions in English, all explanationRu in Russian
- Questions must be SIMPLE — this is lesson ${lessonNumber}, a complete beginner`
      : `You are creating English reading lessons for a Russian developer who already knows these tools in Russian and uses them daily. They want to learn to READ technical English — docs, GitHub comments, Stack Overflow answers, error messages.

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
    "content": "Reading text 320-400 words. Write like a developer explains to a colleague — natural technical English. Include real commands (git commit -m, npm ci), actual error message phrasing, real patterns from docs.",
    "vocabulary": [
      ${vocabFormat}
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
- vocabulary: 8-12 items, each with word + translation + explanation (1–2 sentences Russian, practical)
- tasks: 4-5 comprehension questions
- extraPractice: 5-6 vocabulary questions
- consolidation: exactly 3 questions on the core concept
- All questions in English, all explanationRu in Russian`

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    })

    const openaiData = await openaiRes.json()
    const lessonContent = JSON.parse(openaiData.choices[0].message.content)

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
