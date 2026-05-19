# Контекст проекта для Claude

## ⛔ ГЛАВНОЕ ПРАВИЛО

Никаких изменений без явного согласования с пользователем.
Заметил баг или улучшение — сообщи и жди разрешения. Не трогай.

> Правило для Claude: Читай этот файл в начале чата. В конце чата — обновляй раздел «Открытые баги».

---

## Стиль общения Claude
- Отвечать только результатом — без вступлений («сейчас сделаю», «давай разберёмся», «хороший вопрос»)
- Не рассуждать вслух, не объяснять что собираешься сделать до того как сделал
- Не заполнять контекстное окно внутренними рассуждениями
- Коротко и по делу — одно предложение вместо абзаца
- Без лишних объяснений если не просят
- Отвечать на языке пользователя

---

## TEMPLATE репо

Всегда читать в начале чата:
```bash
git clone https://github.com/Arsid0305/TEMPLATE /tmp/arsid-template
```
Затем прочитать все `.md` файлы из `/tmp/arsid-template/`.

---

## Инфраструктура

- Фронтенд: Vercel — автодеплой при пуше в `main`
- Бэкенд: Supabase Edge Functions — GitHub Actions
- Репо: github.com/Arsid0305/Technical-language

---

## Стек

- React + Vite + TypeScript + Tailwind + shadcn/ui
- Supabase Edge Functions (Deno) — `generate-lesson`, `lookup-word`
- Supabase PostgreSQL — таблицы: `lessons` (кэш AI-уроков), `glossary` (словарь пользователя)
- Анонимная идентификация: `device_id` UUID в localStorage (`vibe-eng-device-id`)

---

## Design System

Репо: `github.com/Arsid0305/design-system` — отдельный репо, наполняется через дизайн-процесс.
Внутри — папка для каждого проекта (`/kino-app/`, `/wb-bot/` и т.д.).
Подключён как git submodule — локальное имя смотреть в `.gitmodules`.
Инициализировать: `git submodule update --init`
Обновить: `git submodule update --remote`

Перед любым изменением UI — открыть нужный файл из `[submodule]/[PROJECT]/preview/`.
Не выдумывать UI с нуля — брать из design system.

---

## Subagents

Использовать для:
- Исследования и анализа кода (не засорять основной контекст)
- Параллельных независимых задач

Один subagent — одна фокусная задача.

---

## Выбор модели для subagents

При запуске subagent всегда явно указывать `model`:

| Модель | Когда использовать |
|---------|-------------------|
| `haiku` | Поиск файлов, чтение кода, grep, простые запросы — быстро и дёшево |
| `sonnet` | Написание кода, отладка, стандартные задачи — баланс качества и цены |
| `opus` | Архитектура, сложный анализ, планирование BIG-задач — максимальное качество |

По умолчанию — `sonnet`. Переключаться на `haiku` если задача простая, на `opus` только если требуется глубокое архитектурное решение.

---

## Среда Claude

- node_modules: нет (npm ci)
- Supabase CLI: не работает
- Deno: не установлен

---

## Рабочий процесс

Схема: `ветки` → `main` (после билда) → Vercel

1. Claude пишет код → пушит в ветку `claude/...`
2. `automerge.yml` делает `npm ci` + `npm run build`, затем мержит ветку в `main`
3. Vercel деплоит фронтенд (1-2 мин)
4. GitHub Actions деплоит Edge Functions (1-2 мин)
5. Тестируем на проде

---

## Правила Git

- Разрабатывать на ветке `claude/...`, никогда не пушить напрямую в `main`
- Никогда не использовать `--no-verify`, `--force`, `--no-gpg-sign`
- Синхронизация с основной: `git pull origin main`

---

## Ручные шаги (сообщать по мере необходимости)

- **GitHub Secret `SBP_ACCESS_TOKEN`** — при первом появлении `supabase/functions/`
- **GitHub Secret `SUPABASE_PROJECT_REF`** — то же самое
- **Vercel** — подключить репо на vercel.com при первом деплое фронтенда

---

## Открытые баги

### 🔴 Критические (финансовый/безопасность)

- **[SEC-1] Нет rate limiting на Edge Functions** — `generate-lesson` и `lookup-word` принимают любые запросы с публичным anon-ключом. Риск выжигания OpenAI-квоты. Файлы: `supabase/functions/generate-lesson/index.ts`, `supabase/functions/lookup-word/index.ts`
- **[SEC-2] CORS wildcard `*`** — оба Edge Functions разрешают запросы с любого домена. TEMPLATE требует ограничить до реального домена. Файлы: те же, строка 1.
- **[SEC-3] Нет JWT-верификации в Edge Functions** — anon-ключ публичен (в JS-бандле), любой может вызывать функции напрямую.
- **[SEC-4] RLS-статус таблиц неизвестен** — нет `supabase/migrations/`. Таблицы `lessons` и `glossary` скорее всего созданы вручную без RLS-политик.
- **[SEC-5] `force=true` без авторизации** — позволяет сбрасывать кэш уроков и вызывать платный OpenAI, передав `{"force": true}`.

### 🟠 Высокие (надёжность/данные)

- **[DATA-1] Прогресс хранится только в localStorage** — очистка браузера = полная потеря прогресса уроков. Словарь синхронизируется в Supabase, прогресс — нет. Файл: `src/hooks/useProgress.ts:39`
- **[DATA-2] Glossary sync fire-and-forget** — `upsertGlossaryWord().catch(console.error)` молча теряет данные при сбое сети. Нет retry, нет UI-индикации. Файл: `src/pages/Index.tsx:77-80`
- **[PERF-1] N+1 запросов при сохранении словаря** — `words.forEach(word => upsertGlossaryWord(...))` делает по 1 HTTP POST на каждое слово урока (10-15 запросов). Нужен bulk-upsert. Файл: `src/pages/Index.tsx:77`

### 🟡 Средние (качество/CI)

- **[CI-1] `automerge.yml` мержит напрямую в `main`** — любой пуш в `claude/...` при зелёном CI (который всегда зелёный) уходит в продакшн без ревью. TEMPLATE использует промежуточную `dev`-ветку.
- **[CI-2] Единственный тест — `expect(true).toBe(true)`** — CI всегда зелёный, нет реального покрытия. Файл: `src/test/example.test.ts`
- **[CI-3] Actions закреплены по тегу, не SHA** — `actions/checkout@v4` вместо SHA. Supply chain risk. Файл: `.github/workflows/automerge.yml:6`
- **[CI-4] Нет `npm audit` в CI** — уязвимые зависимости проходят в прод незамеченными.
- **[TS-1] TypeScript strict mode отключён** — `strict: false`, `strictNullChecks: false`, `noImplicitAny: false`. Файлы: `tsconfig.json`, `tsconfig.app.json`

### ℹ️ Низкие / технический долг

- **[DEPS-1] ~15 неиспользуемых shadcn/ui зависимостей** — recharts, vaul, cmdk, react-day-picker, embla-carousel и др. из шаблона. Раздувают бандл.
- **[OPS-1] Нет observability** — ни Sentry, ни метрик, ни алертов на OpenAI-квоту или ошибки Edge Functions.
- **[ARCH-1] Нет схемы БД в репо** — `supabase/migrations/` отсутствует. Воспроизвести базу с нуля невозможно.
