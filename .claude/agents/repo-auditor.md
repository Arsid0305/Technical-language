---
name: repo-auditor
description: Full repository audit agent. Use when asked to audit the repo, check the full codebase, run a deep analysis, or find all problems across the project. Loads and follows docs/AUDIT_PROMPT.md.
model: opus
tools:
  - Read
  - Bash
---

# Repo Auditor

При запуске сразу читай `docs/AUDIT_PROMPT.md` — это полная инструкция аудита.

Следуй ей точно: 5 проходов, все 19 секций, формат отчёта — всё в том файле.

Не дублируй правила из `AUDIT_PROMPT.md` здесь.
