# Project Context

> Technical-Language — приложение для изучения технического английского. React + Supabase + Vercel.

---

## 1. Tech Stack
- Frontend: React + Vite + TypeScript + Tailwind + shadcn/ui
- Animations: none
- Backend: Supabase Edge Functions (Deno) — `generate-lesson`, `lookup-word`
- DB & Auth: Supabase PostgreSQL — таблицы: `lessons`, `glossary`
- Design System: shadcn/ui

---

## 2. Infrastructure & CI/CD
- Frontend deploy: Vercel (из `main`)
- Repo: github.com/Arsid0305/Technical-language

Workflows:
- `automerge.yml` — `claude/** | cursor/**` → `main` авто + lint + test + build ✅
- `promote.yml` — не используется ❌
- `deploy.yml` — Supabase Edge Functions deploy (GitHub Actions)

---

## 3. AI Environment

| Tool | Status | Note |
|------|--------|------|
| Node.js / npm | ✅ | `npm ci` |
| Python | ❌ | не используется |
| Supabase CLI | ❌ | Edge Functions деплоятся через GitHub Actions |
| .env (real keys) | ✅ | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |

---

## 4. Design System

shadcn/ui — компоненты в `src/components/ui/`. Перед UI изменениями смотреть существующие компоненты там.

---

## 5. Project Structure

```
.github/workflows/
  automerge.yml        — авто-мерж ветки в main
docs/
  AUDIT_PROMPT.md      — контекст для аудита
scripts/
  check_consistency.py — CI-проверки консистентности
src/
  data/
    dailyContent.ts    — SSOT: ежедневный контент
  lib/
    lessonService.ts   — SSOT: логика уроков
    wordService.ts     — SSOT: логика словаря
  components/          — React компоненты
    ui/                — shadcn/ui компоненты
supabase/
  functions/           — SSOT: Edge Functions (Deno)
    generate-lesson/
    lookup-word/
tasks/
  todo.md
  lessons.md
```

---

## 6. Standard Packages

- `lucide-react` — иконки
- `@supabase/supabase-js` — Supabase клиент
- `sonner` — toast уведомления
- `zod` — валидация
- `vitest` — тесты (`npm test`)

---

## 7. Auth (Supabase OTP)

- Step 1: `supabase.auth.signInWithOtp({ email })` — отправляет код
- Step 2: `supabase.auth.verifyOtp({ email, token, type: 'email' })` — проверяет
- Код — **8 цифр** (не 6)

---

## 8. Open Bugs

_(empty)_
