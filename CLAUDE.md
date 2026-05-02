# Контекст проекта для Claude

## ⛔ ГЛАВНОЕ ПРАВИЛО

Никаких изменений без явного согласования с пользователем.
Заметил баг или улучшение — сообщи и жди разрешения. Не трогай.

> Правило для Claude: Читай этот файл в начале чата. В конце чата — обновляй раздел «Открытые баги».

## Инфраструктура

- Фронтенд: Vercel — автодеплой при пуше в main
- Репо: github.com/Arsid0305/Technical-language

## Стек

- React + Vite + TypeScript + Tailwind + shadcn/ui
- react-router-dom, TanStack Query, react-hook-form, zod, recharts

## Среда Claude

- node_modules: нет (npm ci)
- Supabase CLI: не работает
- Deno: не установлен

## Рабочий процесс

1. Claude пишет код → пушит в feature ветку
2. GitHub Actions мёрджит feature → dev (авто)
3. После успешного билда dev → main (авто)
4. Vercel деплоит фронтенд (1-2 мин)

## Открытые баги

_(пусто)_
