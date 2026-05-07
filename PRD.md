# Biathlon Analytics Dashboard — PRD

## Problem Statement
Modern web dashboard for biathlon analytics (season **2025/2026**). Clean, data-focused dashboard analysing athlete performance with emphasis on shooting accuracy and skiing speed. Mock data only.

## User Personas
- **Coach / Analyst** — needs quick overview of athletes' shooting & skiing performance.
- **Fan / Viewer** — wants to explore race results and compare favourite athletes.

## Architecture
- **Backend**: FastAPI single-file app (`/backend/server.py`). Deterministic in-memory mock dataset built once at startup using `random.seed(26)`. Mongo client wired but unused.
- **Frontend**: React + React Router + Recharts + Tailwind + shadcn/ui. Dark-mode only. Sidebar layout.
- **Design language**: Sports-broadcast aesthetic — Barlow Condensed display, IBM Plex Sans body, sharp edges, palette `#050814 / #E63946 / #F4D03F / #00E5FF`.

## Core Requirements (all implemented)
- `/dashboard` — KPIs, season trend, top-5 ranking, ski-vs-shoot scatter, latest podium.
- `/athletes`, `/athletes/:id` — list + detail (prone/standing accuracy, misses, radar, accuracy-over-season line, last-5 recent form, rule-based insight).
- `/race`, `/race/:id` — race picker, leaderboard table with 1-0-2-1 shooting lines, target-dot bouts, fastest-skier + best-shooter highlights, podium cards.
- `/compare` — two athlete selectors, overlay radar, back-to-back bars, diff table.

## Implementation Log

### 2026-02 — MVP shipped
- 4 pages, 20 athletes × 10 races mock dataset.
- Recharts (line / bar / radar / scatter), `TargetDots` component, rule-based `InsightCard`.
- Dark biathlon palette, full responsive layout.
- Testing agent verified backend 100% / frontend 100%.

### 2026-02 — Roster realism pass
- Replaced random first/last/country mix with curated roster of 20 real biathletes paired with correct nations.
- Hard-coded per-athlete `base_shoot` and `base_ski` skill baselines tuned to 2025/26 World Cup final standings (Perrot champion, Laegreid #2, Botn #3, Bø removed — retired).

### 2026-02 — Handoff package
- Added `/memory/PRD.md` (project requirements + backlog).
- Added `/HANDOFF.md` (extension guide, conventions, sanity checks).
- Updated this PRD.

## Backlog

### P1
- Nations Cup / team standings page.
- Historical season comparison (24/25 vs 25/26 toggle).

### P2
- Live race-polling simulation (auto-incrementing leaderboard).
- Exportable PNG athlete card (`html-to-image`).
- LLM-generated coach insights via Claude (Emergent Universal Key) — replaces static rule-based string in `_athlete_summary`.
- Women's circuit toggle (`ATHLETE_ROSTER_W` + filter prop).

### Nice-to-have
- Cache `_athlete_summary` (currently recomputes on every request).
- Loading skeletons / explicit error boundaries.
- Filter races by venue or race type on the Races page.
- Pydantic response models on all routes.