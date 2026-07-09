# Repository Audit — Technical-language

Универсальные проверки — см. **`llm_wiki/wiki/audit-universal.md`** (canon для всех репо).

Этот файл — тонкий overlay с проектной спецификой Technical-language.

---

## Контекст проекта

```
Тип: веб-приложение для изучения технического английского
Стек: React + Vite + TypeScript + Tailwind + shadcn/ui
Бэкенд: Supabase Edge Functions (Deno): generate-lesson, lookup-word
БД: Supabase PostgreSQL (схема `technical_language`) — lessons, glossary, rate_limits
Идентификация: анонимная, device_id UUID в localStorage
Деплой: Vercel (frontend) + GitHub Actions (Edge Functions)
Тесты: Vitest (npm test)
```

## Проектные проверки (в дополнение к universal)

**Supabase Edge Functions:**
- [ ] Обе функции (`generate-lesson`, `lookup-word`) имеют `verify_jwt: true` — см. `supabase/config.toml`
- [ ] JWT-верификация внутри функции через `SUPABASE_JWT_SECRET` (HMAC)
- [ ] CORS whitelist: `https://technical-language.vercel.app` + `localhost:*`, не `*`
- [ ] Rate limiting активен: `rate_limits` таблица + `check_rate_limit()` SQL
- [ ] `force=true` защищён отдельным rate-limit 3/час на IP

**Схема БД:**
- [ ] RLS включён на `technical_language.lessons` и `technical_language.glossary`
- [ ] `public.glossary` не существует (был удалён — теперь только `technical_language.glossary`)
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` используется во фронтенде (не anon key)
- [ ] `Accept-Profile` / `Content-Profile: technical_language` в клиенте PostgREST

**Прогресс пользователя:**
- [ ] Прогресс хранится не только в localStorage — есть sync с БД (иначе потеря при очистке браузера) — открытый баг [DATA-1]
- [ ] `upsertGlossaryWord` не `.catch(console.error)` fire-and-forget — открытый баг [DATA-2]

**Тесты / TypeScript:**
- [ ] Тесты не заглушки — не `expect(true).toBe(true)` — открытый баг [CI-2]
- [ ] `strict: true` в `tsconfig.json` — открытый баг [TS-1]

## Формат отчёта

Как в `llm_wiki/wiki/audit-universal.md`.
