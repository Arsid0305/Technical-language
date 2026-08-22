# Контекст проекта для Claude

## ⛔ ГЛАВНОЕ ПРАВИЛО

Никаких изменений без явного согласования с пользователем.
Заметил баг или улучшение — сообщи и жди разрешения. Не трогай.

> Правило для Claude: Читай этот файл в начале чата. В конце чата — обновляй раздел «Открытые баги».

---

## LLM_Wiki — Общий контекст экосистемы

В начале каждой сессии прочитать из репо `arsid0305/llm_wiki` (ветка `main`):
- `wiki/lessons.md` — кросс-проектные уроки
- `wiki/decisions.md` — ключевые архитектурные решения

Даёт контекст по всем проектам без объяснений от пользователя.

---

## Стиль общения Claude

Канон — `AI_OS/SYSTEM.md §4` + `AI_OS/CLAUDE.md` («Правила краткости»).

---

## TEMPLATE репо

Всегда читать в начале чата:
```bash
git clone https://github.com/Arsid0305/TEMPLATE /tmp/arsid-template
```
Затем прочитать все `.md` файлы из `/tmp/arsid-template/`.

---

## Инфраструктура

_Проверено: 2026-08-19._

- Фронтенд: Vercel — автодеплой при пуше в `main` (⚠️ статус: до августа 2026 работал; проверить свежий деплой в Vercel Dashboard перед тем как считать что рабочий, из-за общего T&S-флага у аккаунта `Arsid0305` — см. Kino-app/CLAUDE.md TEMPORARY-блок).
- Бэкенд: Supabase Edge Functions — деплой через GitHub Actions или Supabase MCP (`deploy_edge_function`), если Actions не срабатывают.
- Репо: github.com/Arsid0305/Technical-language
- Supabase: общий проект с Kino-app — `ovhwxfdtkzwxfomdlgjv`, схема `technical_language` (⚠️ не тащить чужие миграции — см. `AI_OS/MEMORY/tasks/cross-repo-todo.md`).

---

## Стек

- React + Vite + TypeScript + Tailwind + shadcn/ui
- Supabase Edge Functions (Deno) — `generate-lesson`, `lookup-word`
- Supabase PostgreSQL — проект `ovhwxfdtkzwxfomdlgjv`, схема `technical_language`
- Таблицы: `technical_language.lessons` (кэш AI-уроков), `technical_language.glossary` (словарь пользователя), `technical_language.rate_limits`
- Анонимная идентификация: `device_id` UUID в localStorage (`vibe-eng-device-id`)
- Ключ фронтенда: `VITE_SUPABASE_PUBLISHABLE_KEY` (Supabase переименовал anon key)

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

## Subagents и выбор модели

Канон — `AI_OS/CLAUDE.md` (Subagents) + `llm_wiki/wiki/workflow.md` (таблица `haiku`/`sonnet`/`opus`).

---

## Среда Claude

- node_modules: нет (npm ci)
- Supabase CLI: не работает
- Deno: не установлен

---

## Рабочий процесс

Схема: `ветки` → PR → `main` (после ревью автомержем) → Vercel

1. Claude пишет код → пушит в ветку `claude/...`
2. Создаётся PR → `automerge.yml` автоматически мержит его в `main` через GitHub API (squash)
3. Vercel деплоит фронтенд (1-2 мин)
4. GitHub Actions деплоит Edge Functions (1-2 мин)
5. Тестируем на проде

**Требует:** Settings → General → «Allow auto-merge» включён в репо.

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

- ~~**[SEC-1] Нет rate limiting**~~ ✅ **FIXED** (2026-05-24) — `rate_limits` таблица + `check_rate_limit()` SQL, 20/час для generate-lesson, 50/час для lookup-word
- ~~**[SEC-2] CORS wildcard `*`**~~ ✅ **FIXED** (PR #27, 2026-05-24) — whitelist `https://technical-language.vercel.app` + `localhost:*`
- ~~**[SEC-3] Нет JWT-верификации в Edge Functions**~~ ✅ **FIXED** (PR #39, 2026-05-28) — `verify_jwt: true` на уровне платформы Supabase + HMAC-верификация внутри функции через `SUPABASE_JWT_SECRET`.
- ~~**[SEC-4] RLS и схема БД**~~ ✅ **FIXED** (PR #30, 2026-05-27) — RLS политики для `technical_language.lessons` и `technical_language.glossary`; код переведён на `VITE_SUPABASE_PUBLISHABLE_KEY` и `Accept-Profile/Content-Profile: technical_language`; `public.glossary` удалён.
- ~~**[SEC-5] `force=true` без авторизации**~~ ✅ **FIXED** (PR #39, 2026-05-28) — отдельный rate limit 3/час на IP для `force=true`, предотвращает спам OpenAI.
- **[SEC-6] RLS glossary/progress широко открыт (`USING (true)`)** — любой с publishable-ключом может прочитать/удалить весь словарь всех устройств. Модель фундаментально анонимная (нет auth). Мера: перенести glossary/progress-IO в Edge Function с HMAC-проверкой device_id или ввести client-side JWT c device_id claim. Прецедент: audit 2026-07-11.

### 🟠 Высокие (надёжность/данные)

- ~~**[DATA-1] Прогресс хранится только в localStorage**~~ ✅ **FIXED** (2026-07-11, миграция `20260711_create_progress.sql`) — таблица `technical_language.progress` + `saveProgressToSupabase`/`fetchLatestProgress` в `src/lib/progressService.ts` (per device_id). Плюс beforeunload/visibilitychange flush в `useProgress.ts`.
- **[DATA-2] Glossary sync fire-and-forget** — `upsertGlossaryWord().catch(console.error)` молча теряет данные при сбое сети. Файл: `src/pages/Index.tsx:77-80`
- **[PERF-1] N+1 запросов при сохранении словаря** — `words.forEach(word => upsertGlossaryWord(...))` делает по 1 HTTP POST на каждое слово (10-15 запросов). Нужен bulk-upsert. Файл: `src/pages/Index.tsx:77`
- **[DATA-3] Race в generate-lesson при concurrent cache-miss** — два одновременных POST для одного `lessonNumber` → оба вызовут OpenAI, второй upsert затрёт. Нужен `pg_advisory_xact_lock(hashtext('lesson:' || lessonNumber))` в начале.

### 🟡 Средние (качество/CI)

- ~~**[CI-1] `automerge.yml` мержит напрямую в `main`**~~ ✅ **FIXED** (2026-05-25) — переведён на PR-based automerge через GitHub API (squash)
- ~~**[CI-2] Единственный тест — `expect(true).toBe(true)`**~~ частично — `automerge.yml` теперь блокирует merge при упавшем build/test (2026-07-11). Написать реальные тесты — TODO отдельно.
- ~~**[CI-3] `actions/setup-node@v4` закреплён по тегу, не SHA**~~ ✅ **FIXED** (2026-05-24) — закреплён на SHA `49933ea5288caeca8642d1e84afbd3f7d6820020` (v4.4.0)
- **[CI-4] Нет `npm audit` в CI**
- ~~**[CI-5] `supabase/setup-cli@v1` тег, не SHA**~~ ✅ **FIXED** (2026-07-11) — закреплён на SHA v1.1.1
- **[TS-1] TypeScript strict mode отключён**

### ℹ️ Низкие / технический долг

- **[DEPS-1] ~15 неиспользуемых shadcn/ui зависимостей**
- **[OPS-1] Нет observability** — ни Sentry, ни алертов на OpenAI-квоту.
- ~~**[ARCH-1] Нет схемы БД в репо**~~ ✅ **FIXED** (PR #30, 2026-05-27) + `progress` таблица покрыта миграцией 2026-07-11.
- ~~**[SEC-CONFIG] `supabase/config.toml` не в git**~~ ✅ **FIXED** (2026-07-11) — `verify_jwt=true` для обеих функций закоммичено, плюс продублирована HMAC-проверка в `lookup-word`.
- ~~**[SEC-ENV] `.env.production` в репо**~~ ✅ **FIXED** (2026-07-11) — переименован в `.env.production.example`, `.gitignore` обновлён.
