# Контекст проекта для Claude

## ⛔ ГЛАВНОЕ ПРАВИЛО

Никаких изменений без явного согласования с пользователем.
Заметил баг или улучшение — сообщи и жди разрешения. Не трогай.

> Правило для Claude: Читай этот файл в начале чата. В конце чата — обновляй раздел «Открытые баги».

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

## Среда Claude

- node_modules: нет (npm ci)
- Supabase CLI: не работает
- Deno: не установлен

---

## Рабочий процесс

Схема: `ветки` → `dev` (авто) → `main` (после билда) → Vercel

1. Claude пишет код → пушит в ветку `claude/...`
2. `automerge.yml` мержит ветку в `dev` автоматически
3. `promote.yml` мержит `dev` → `main` после успешного билда
4. Vercel деплоит фронтенд (1-2 мин)
5. GitHub Actions деплоит Edge Functions (1-2 мин)
6. Тестируем на проде

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

_(пусто)_
