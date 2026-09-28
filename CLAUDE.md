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

## Каноны (rules как атомы)

Универсальные правила — в `docs/rules/core/*.md` (SSOT в AI_OS, синкается автоматически):

- Начало / конец сессии — [`docs/rules/core/session-lifecycle.md`](docs/rules/core/session-lifecycle.md)
- Стиль общения / краткость — [`docs/rules/core/communication-style.md`](docs/rules/core/communication-style.md)
- Git flow, запрет флагов — [`docs/rules/core/git-flow.md`](docs/rules/core/git-flow.md)
- GitHub anti-abuse — [`docs/rules/core/github-anti-abuse.md`](docs/rules/core/github-anti-abuse.md)
- BIG / SMALL — [`docs/rules/core/task-classification.md`](docs/rules/core/task-classification.md)
- Принципы работы с кодом — [`docs/rules/core/code-principles.md`](docs/rules/core/code-principles.md)
- Subagents (worktree, JSON-schema контракты) — [`docs/rules/core/subagents.md`](docs/rules/core/subagents.md)
- Audit-триггер — [`docs/rules/core/audit-trigger.md`](docs/rules/core/audit-trigger.md)
- Выбор модели `haiku`/`sonnet`/`opus` — `llm_wiki/wiki/workflow.md`
- Context Mode — `llm_wiki/wiki/context-mode.md`

Архитектура rules и правила синка — [`docs/rules/README.md`](docs/rules/README.md).

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

## Среда Claude

- node_modules: нет (npm ci)
- Supabase CLI: не работает
- Deno: не установлен

---

## Рабочий процесс

Схема: `одна ветка` → `один PR` → ручной мерж → Vercel

1. **Вся работа сессии — в одну ветку и один PR.** Новая задача — коммит туда же,
   а не новый PR. Отдельный PR заводить только если владелица попросит.
2. **Мерж — только вручную**, кнопкой в веб-интерфейсе. Мерж через API запрещён,
   `mcp__github__merge_pull_request` не использовать. Автомерж удалён из репо
   (2026-09-12), `automerge.yml` остался только как CI — сборка и тесты.
3. **PR не draft** — владелица draft'ами не пользуется.
4. **Напоминать обязательно** — про мерж PR и про деплой, каждый раз, а не по случаю.
5. Vercel деплоит фронтенд сам после мержа в `main` (1-2 мин).
6. Edge Functions выкатывает `deploy.yml` автоматически при мерже в `main`, если
   правка затронула `supabase/functions/**`. Проверять результат в Actions —
   до 2026-09-28 этот workflow был сломан (см. CI-5). Запасные пути: Supabase MCP
   (`deploy_edge_function`) или вручную по инструкции ниже.

Каноны целиком — [`docs/rules/core/github-anti-abuse.md`](docs/rules/core/github-anti-abuse.md)
(ручной мерж, один PR, draft) и [`docs/rules/core/git-flow.md`](docs/rules/core/git-flow.md).

_Состояние на 2026-09-27: T&S-флаг с аккаунта снят, GitHub Actions снова работают
(прогон #100, production-деплой Vercel прошёл). Правила ручного мержа и одного PR
сохранены по прямому указанию владелицы — это её постоянное предпочтение,
а не обход блокировки._

---

## Ручные шаги (сообщать по мере необходимости)

- **GitHub Secret `SBP_ACCESS_TOKEN`** — при первом появлении `supabase/functions/`
- **GitHub Secret `SUPABASE_PROJECT_REF`** — то же самое
- **Vercel** — подключить репо на vercel.com при первом деплое фронтенда

**Деплой Edge Functions вручную** — если Supabase MCP недоступен. Пользователь на Windows, PowerShell:
```powershell
npm install -g supabase
supabase login                      # токен: supabase.com/dashboard → Account → Access Tokens
cd C:\Users\arols\Technical-language
git pull
supabase functions deploy generate-lesson --project-ref ovhwxfdtkzwxfomdlgjv
supabase functions deploy lookup-word    --project-ref ovhwxfdtkzwxfomdlgjv
```
Запускать **из корня репо** — CLI ищет `supabase/functions/<name>/index.ts` относительно cwd, иначе `Entrypoint path does not exist`. `WARNING: Docker is not running` — безвредно, для remote-деплоя Docker не нужен. Проверено 2026-09-12.

---

## Открытые баги

### 🔴 Критические (финансовый/безопасность)

- ~~**[SEC-1] Нет rate limiting**~~ ✅ **FIXED** (2026-05-24) — `rate_limits` таблица + `check_rate_limit()` SQL, 20/час для generate-lesson, 50/час для lookup-word
- ~~**[SEC-7] `checkRateLimit` fail-open при отказе БД**~~ ✅ **FIXED** (2026-08-22) — обе функции возвращали `true` при HTTP-ошибке RPC или сетевом сбое, что снимало лимит на платные LLM-вызовы при отказе `rate_limits`. Инвертировано на fail-closed (`return false` → клиент получает 429). Правило зафиксировано в `AI_OS/MEMORY/tasks/cross-repo-todo.md` (Kino-app прецедент 2026-08-16).
- ~~**[SEC-8] `error.message` от OpenAI утекал клиенту**~~ ✅ **FIXED** (2026-08-23) — общий `catch` в обеих edge functions отдавал `error.message`, а внутренние `throw` включали `err.error?.message` из ответа OpenAI. Утекали org_id, request_id, детали квоты. Клиенту теперь `'Service temporarily unavailable'` (500) или `upstream_${status}` (без тела). Полное сообщение — в `console.error`. Правило — `AI_OS/MEMORY/tasks/cross-repo-todo.md` (Kino-app прецедент 2026-08-16).
- ~~**[SEC-2] CORS wildcard `*`**~~ ✅ **FIXED** (PR #27, 2026-05-24) — whitelist `https://technical-language.vercel.app` + `localhost:*`
- ~~**[SEC-3] Нет JWT-верификации в Edge Functions**~~ ✅ **FIXED** (PR #39, 2026-05-28) — `verify_jwt: true` на уровне платформы Supabase + HMAC-верификация внутри функции через `SUPABASE_JWT_SECRET`.
- ~~**[SEC-4] RLS и схема БД**~~ ✅ **FIXED** (PR #30, 2026-05-27) — RLS политики для `technical_language.lessons` и `technical_language.glossary`; код переведён на `VITE_SUPABASE_PUBLISHABLE_KEY` и `Accept-Profile/Content-Profile: technical_language`; `public.glossary` удалён.
- ~~**[SEC-5] `force=true` без авторизации**~~ ✅ **FIXED** (PR #39, 2026-05-28) — отдельный rate limit 3/час на IP для `force=true`, предотвращает спам OpenAI.
- **[SEC-6] RLS glossary/progress широко открыт (`USING (true)`)** — любой с publishable-ключом может прочитать/удалить весь словарь всех устройств. Модель фундаментально анонимная (нет auth). Мера: перенести glossary/progress-IO в Edge Function с HMAC-проверкой device_id или ввести client-side JWT c device_id claim. Прецедент: audit 2026-07-11.
- **[SEC-9] Прогресс синхронизируется по общему ключу `device_id = 'user'`** — ⚠️ **ТАК ЗАДУМАНО, НЕ «ЧИНИТЬ»**. `src/lib/progressService.ts`, константа `SYNC_KEY`. У программы одна пользовательница с двумя устройствами (телефон + ноутбук) и нет входа по логину, поэтому прогресс намеренно живёт в одной строке на всех. Ключ угадывается, но в связке с SEC-6 (RLS `USING (true)`) это ничего не добавляет: база и так открыта любому, у кого есть публичный ключ из сборки. Настоящая изоляция возможна только с auth — это BIG-задача, пока не нужна.
  **История, чтобы не повторять:** общий ключ введён осознанно (`e56e34a`, июнь 2026, «use shared key 'user' for all devices»). Аудит 2026-07-11 (PR #48) счёл это багом и перевёл на `getDeviceId()`. Регресс всплыл 2026-09-27, когда прод впервые пересобрался: каждое устройство завело свою строку и открывало урок 1 при целом прогрессе на уроке 8. Возвращено на `SYNC_KEY`. **Не переводить обратно на `device_id` без явного согласия владелицы.**
  Словарь (`glossaryService.ts`) остался per-device — отдельный вопрос, прогресс тянет свою копию словаря в своём blob.

### 🟠 Высокие (надёжность/данные)

- ~~**[DATA-1] Прогресс хранится только в localStorage**~~ ✅ **FIXED** (2026-07-11, миграция `20260711_create_progress.sql`) — таблица `technical_language.progress` + `saveProgressToSupabase`/`fetchLatestProgress` в `src/lib/progressService.ts` (per device_id). Плюс beforeunload/visibilitychange flush в `useProgress.ts`.
- **[DATA-2] Glossary sync fire-and-forget** — `upsertGlossaryWord().catch(console.error)` молча теряет данные при сбое сети. Файл: `src/pages/Index.tsx:77-80`
- **[PERF-1] N+1 запросов при сохранении словаря** — `words.forEach(word => upsertGlossaryWord(...))` делает по 1 HTTP POST на каждое слово (10-15 запросов). Нужен bulk-upsert. Файл: `src/pages/Index.tsx:77`
- **[DATA-3] Race в generate-lesson при concurrent cache-miss** — два одновременных POST для одного `lessonNumber` → оба вызовут OpenAI, второй upsert затрёт. Нужен `pg_advisory_xact_lock(hashtext('lesson:' || lessonNumber))` в начале.
- ~~**[DATA-4] Race при старте: `defaultProgress` затирал прогресс в Supabase**~~ ✅ **FIXED** (PR #50, 2026-09-12) — на старте state = `defaultProgress` (`currentDay: 1`), это запускало save-таймер на 1500 мс; если `fetchLatestProgress()` не успевал ответить — в Supabase уходил `currentDay: 1` и пустой `days`. Добавлен `hasLoaded` ref в `useProgress.ts`: запись в Supabase заблокирована до ответа remote-фетча. **Прецедент:** прогресс пользователя дважды сбрасывался с урока 8 на урок 1; восстановлен вручную SQL-апдейтом `technical_language.progress` (словарь уцелел, `days` пришлось восстанавливать синтетически — реальные отметки и ошибки уроков 1-7 потеряны).
- ~~**[DATA-5] Валидация словаря в `generate-lesson` проверяла несуществующее поле**~~ ✅ **FIXED** (PR #51, 2026-09-12) — проверялось `v.term`, а промпт возвращает `v.word` → любой некэшированный урок падал с 502. Файл: `supabase/functions/generate-lesson/index.ts:325`

### 🟡 Средние (качество/CI)

- ~~**[CI-1] `automerge.yml` мержит напрямую в `main`**~~ ✅ **FIXED** (2026-05-25) — переведён на PR-based automerge через GitHub API (squash)
- ~~**[CI-2] Единственный тест — `expect(true).toBe(true)`**~~ частично — `automerge.yml` теперь блокирует merge при упавшем build/test (2026-07-11). Написать реальные тесты — TODO отдельно.
- ~~**[CI-3] `actions/setup-node@v4` закреплён по тегу, не SHA**~~ ✅ **FIXED** (2026-05-24) — закреплён на SHA `49933ea5288caeca8642d1e84afbd3f7d6820020` (v4.4.0)
- **[CI-4] Нет `npm audit` в CI**
- ~~**[CI-6] GitHub Actions заблокированы на аккаунте**~~ ✅ **СНЯТО** (2026-09-27) — T&S-флаг аккаунта `Arsid0305` снят, Actions работают (прогон #100), Vercel снова собирает production. Держалось с 26 июня: всё это время `automerge.yml` и `deploy.yml` не запускались, а прод жил на июньской сборке. **Но:** ручной мерж и один PR остаются по прямому указанию владелицы — это предпочтение, а не обход блокировки, см. `docs/rules/core/github-anti-abuse.md`. Job `automerge` удалён из workflow, `deploy.yml` для Edge Functions не восстанавливали — деплоим через Supabase MCP.
- ~~**[CI-5] `supabase/setup-cli@v1` тег, не SHA**~~ ✅ **FIXED по-настоящему** (2026-09-28) — аудит 2026-07-11 «закрепил» действие на SHA `2b81a2f…` с пометкой v1.1.1, но такого коммита в `supabase/setup-cli` нет. GitHub не мог скачать действие, и `deploy.yml` падал на первом шаге за 5 секунд — с июля автодеплой функций не сработал ни разу, а после снятия флага это маскировалось под «всё ещё не работает». Закреплено на реальном `1dedf2c…` (v1.7.3), SHA проверен через `git ls-remote`. **Урок: SHA для закрепления брать только из `git ls-remote --tags`, не из памяти модели.**
- **[TS-1] TypeScript strict mode отключён**

### ℹ️ Низкие / технический долг

- **[DEPS-1] ~15 неиспользуемых shadcn/ui зависимостей**
- **[OPS-1] Нет observability** — ни Sentry, ни алертов на OpenAI-квоту.
- **[OPS-2] Две причины «прод не работает», проверять первыми** (прецедент 2026-09-27, прод лежал с 12.09):
  1. **Переменная `VITE_SUPABASE_PUBLISHABLE_KEY` в Vercel.** Её годами не было — в Vercel лежала `VITE_SUPABASE_ANON_KEY` под старым именем, а работал прод на июньской сборке с ключом, зашитым из `.env.production`. Как только файл убрали из репо (SEC-ENV) и прод пересобрался, ключ стал `undefined` → 401 на всё. **Признак:** в бандле `apikey:X` где `X=void 0`. **Проверка:** скачать `/assets/index-*.js` и найти `rest/v1/progress` — рядом видно значение. Тип переменной должен быть **Config**, не Secret: с префиксом `VITE_` Vercel сам не даёт сохранить Secret.
  2. **Проект Supabase усыпляется** после ~недели простоя (`status: INACTIVE`). Тогда падает всё, включая Edge Functions, и никакой ключ не спасёт. Будится через MCP `restore_project`, поднимается 2–4 минуты (`COMING_UP` → `ACTIVE_HEALTHY`).
  **Диагностика по симптому:** короткое «Type error» в интерфейсе — это WebKit про сорванный запрос, то есть ответа не было вовсе (битый токен, CORS, спящая база). Если бы ответила функция, в тексте был бы её JSON вида `{"error":"…"}`. Ещё грабля: значение переменной склеилось из двух вставок (376 символов вместо 208) — токен невалиден, ответ без CORS-заголовков, симптом тот же. Длину видно в бандле.
- ~~**[ARCH-1] Нет схемы БД в репо**~~ ✅ **FIXED** (PR #30, 2026-05-27) + `progress` таблица покрыта миграцией 2026-07-11.
- ~~**[SEC-CONFIG] `supabase/config.toml` не в git**~~ ✅ **FIXED** (2026-07-11) — `verify_jwt=true` для обеих функций закоммичено, плюс продублирована HMAC-проверка в `lookup-word`.
- ~~**[SEC-ENV] `.env.production` в репо**~~ ✅ **FIXED** (2026-07-11) — переименован в `.env.production.example`, `.gitignore` обновлён.
