# Repository Audit — Reference Prompt

Вставить этот файл целиком в начало аудита любому AI.  
Перед запуском — убедиться что блок «Контекст проекта» актуален.

---

## Перед началом — синхронизация

Аудит на устаревшем snapshot бесполезен. До чтения кода:
1. Прочитать последние 10 коммитов: `git log --oneline -10 main`
2. Зафиксировать HEAD: `git rev-parse main` — указать SHA в начале отчёта
3. Пробежать по `tasks/lessons.md` и `git log --grep=fix` за последний месяц — не повторять уже починенное

Если найден баг — убедиться что он **есть в текущем HEAD**, а не в кеше.

---

## Контекст проекта

```
Тип проекта: веб-приложение для изучения технического английского
Стек: React + Vite + TypeScript + Tailwind + shadcn/ui
Главный язык: TypeScript
Бэкенд: Supabase Edge Functions (Deno): generate-lesson, lookup-word
БД: Supabase PostgreSQL — таблицы: lessons (кэш AI-уроков), glossary (словарь пользователя)
Идентификация: анонимная — device_id UUID в localStorage (vibe-eng-device-id)
Деплой: Vercel (фронтенд, main) + GitHub Actions (Edge Functions)
Тесты: Vitest (npm test)

CI/CD: automerge.yml (claude/** и cursor/** → main напрямую)
После push: npm ci + lint + test + build → merge в main

SSOT этого проекта:
  контент уроков → src/data/dailyContent.ts
  сервисы        → src/lib/lessonService.ts, src/lib/wordService.ts
  AI-функции     → supabase/functions/ (generate-lesson, lookup-word)
  git workflow   → .github/workflows/automerge.yml (claude/**, cursor/** → main)

Вторичные источники (должны совпадать с SSOT):
  CLAUDE.md §Рабочий процесс → должен совпадать с automerge.yml (без dev)
  scripts/check_consistency.py → проверяет соответствия
```

**НЕ проверять** (нерелевантно для персонального проекта):
- multi-user RBAC и изоляция тенантов
- GDPR / compliance
- Docker / Kubernetes / horizontal scaling

---

## Pipeline — 3 pass

Один pass не справляется с объёмом. Запускать как отдельные сессии:

| Pass | Секции | Фокус |
|------|--------|-------|
| 1 — Корректность | §1, §3, §8 | SSOT sync, чистота слоёв, обработка ошибок |
| 2 — Безопасность + документация | §6, §7, §5 | security, dead code, docs vs reality |
| 3 — CI + архитектура | §4, §9, §11, §12 | CI/CD, производительность, freshness |

Каждый pass — свой мини-отчёт в формате §«Формат отчёта».

---

## Чеклист аудита

### 1. СИНХРОНИЗАЦИЯ (SSOT → вторичные источники)

SSOT: `src/data/dailyContent.ts`, `src/lib/lessonService.ts`, `src/lib/wordService.ts`, `supabase/functions/`, `automerge.yml`

- [ ] `automerge.yml` использует `branches: [claude/**, cursor/**]`, не `branches-ignore`
- [ ] `automerge.yml` мержит напрямую в `main` (нет dev-стейджа)
- [ ] `CLAUDE.md §Рабочий процесс` описывает `claude/... → main` напрямую
- [ ] Типы данных в Edge Functions соответствуют типам фронтенда
- [ ] `lessonService.ts` и `wordService.ts` — единственные места обращения к Supabase Edge Functions
- [ ] `scripts/check_consistency.py` проверяет все ключевые соответствия автоматически

### 2. ВНЕШНИЕ API И КЛИЕНТЫ

- [ ] `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY` — единственные публичные ключи во фронтенде
- [ ] AI-ключи (OPENAI и т.д.) — только в Supabase Secrets, не в фронтенде
- [ ] Rate limiting на `generate-lesson` (вызывает платный AI) — есть или нет (зафиксировать)
- [ ] `force=true` требует авторизации, иначе любой может сбрасывать кэш и тратить квоту
- [ ] CORS ограничен реальным доменом, не `*`

### 3. ЧИСТОТА СЛОЁВ

- [ ] `lessonService.ts` содержит только логику — не UI
- [ ] `wordService.ts` содержит только логику — не UI
- [ ] Edge Functions не содержат бизнес-логику фронтенда
- [ ] Компоненты React не содержат прямых fetch к Supabase — через сервисы

### 4. CI/CD

- [ ] `automerge.yml` триггер ограничен `claude/**` и `cursor/**`, не `branches-ignore`
- [ ] `npm ci && npm run lint && npm test && npm run build` выполняется до merge
- [ ] При конфликте мержа — abort + exit 1, не зависает
- [ ] Нет `-X theirs` в automerge.yml
- [ ] Нет `--no-verify`, нет force push в main

### 5. ДОКУМЕНТАЦИЯ vs РЕАЛЬНОСТЬ

**Сканировать ВСЕ `.md` файлы:**
```
find . -name '*.md' -not -path './.git/*'
```

- [ ] `CLAUDE.md §Рабочий процесс` — не упоминает `dev` как промежуточный стейдж
- [ ] `CLAUDE.md §Стек` — актуален (нет упоминания устаревших пакетов)
- [ ] Все пути в `.md` реально существуют в репо

### 6. БЕЗОПАСНОСТЬ

- [ ] Нет `service_role` ключа в `VITE_` переменных
- [ ] `.env` не попал в историю git: `git log --all -- .env`
- [ ] Каждая Edge Function верифицирует запрос (анонимный `device_id` валидирован)
- [ ] Входные данные валидируются через `zod` до обращения к БД
- [ ] RLS включён на `lessons` и `glossary` таблицах — или явно задокументировано что его нет
- [ ] `vite.config.ts` — нет `build.sourcemap: true`
- [ ] Секреты не выводятся в `run:` шагах CI через `echo`

### 7. МЁРТВЫЙ КОД

- [ ] Нет неиспользуемых Edge Functions в `supabase/functions/`
- [ ] Нет устаревших workflow файлов в `.github/workflows/`
- [ ] Нет компонентов в `src/` которые не импортируются нигде

### 8. ОБРАБОТКА ОШИБОК

- [ ] Edge Functions возвращают понятный HTTP-код при ошибке
- [ ] `lessonService.ts` и `wordService.ts` обрабатывают ошибки сети — не падают скрытно
- [ ] Frontend отображает ошибки AI/сети пользователю, не зависает
- [ ] `automerge.yml` abort при конфликте, не зависает

### 9. НАБЛЮДАЕМОСТЬ

- [ ] Ошибки Edge Functions логируются в Supabase Logs
- [ ] Нет секретов в `console.log` фронтенда

### 10. ЗАВИСИМОСТИ

- [ ] `npm audit --audit-level=high` — нет критических уязвимостей
- [ ] Нет явно неиспользуемых зависимостей

### 11. АРХИТЕКТУРНЫЙ СМЫСЛ

- [ ] Что можно удалить без потери функциональности
- [ ] Добавление нового урока: сколько мест трогать? (`dailyContent.ts`) — это норма
- [ ] `device_id` стратегия — покрывает ли сценарий смены браузера?

### 12. AUDIT FRESHNESS

- [ ] Указать HEAD main SHA в начале отчёта
- [ ] Если пункт чеклиста «уже починено» — отметить, не выписывать как новую проблему

---

## Формат отчёта

**Калибровка severity до написания:**

```
SEVERITY:
  BLOCKER  = потеря данных / runtime не работает / дыра в безопасности
  HIGH     = silent degradation / неверный результат / неверный биллинг
  MEDIUM   = риск maintainability / drift который выстрелит через месяц
  LOW      = косметика / расхождение в docs / стиль

CONFIDENCE:
  HIGH    = нашёл в коде, строку указал, воспроизводимо
  MEDIUM  = паттерн виден, точная строка не проверена
  LOW     = подозрение — помечать явно, не выписывать как факт
```

Каждая проблема строго в формате:

```
[SEVERITY] [CONFIDENCE]
Файл: path/to/file:line
Проблема: что конкретно не так
Последствие: что сломается в реальном использовании
Фикс: конкретное исправление
```

Завершить отчёт тремя блоками:
1. **Блокеры** — что мешает работе прямо сейчас
2. **Что сделано хорошо** — не пропускать
3. **Следующие 3 приоритета** — конкретные задачи в порядке важности

**Не писать:**
- общие советы без привязки к файлу
- «рассмотреть использование паттерна X»
- enterprise-рекомендации

---

## Вывод

Отчёт одним markdown файлом.
