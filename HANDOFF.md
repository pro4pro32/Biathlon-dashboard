# Handoff Guide — Biathlon Analytics Dashboard

> **Read this first.** This document is the single source of truth for the next agent to continue work on the project.

---

## 1. Where We Are

- **MVP complete and tested end-to-end.** All four pages work: `/dashboard`, `/athletes`, `/race`, `/compare`.
- **Data is fully mocked** server-side (Python). 20 male athletes, 10 races, deterministic via `random.seed(26)`. Mongo is wired but unused.
- **Athlete roster reflects 2025/26 World Cup reality** — Eric Perrot is the season winner, top-10 names match the real final standings (with minor adjacent-rank variance from in-race RNG). Bø is **not** in the roster (retired post 24/25).
- **No authentication**, no third-party integrations, no LLM keys consumed.

### Live entry points

- Frontend: `REACT_APP_BACKEND_URL` (defined in `/frontend/.env`)
- Backend: `${REACT_APP_BACKEND_URL}/api/`
- Design tokens: `/design_guidelines.json`
- Product backlog: `/memory/PRD.md`

---

## 2. Architecture in 60 Seconds

```
React SPA (port 3000)
  └─ axios → /api/* → FastAPI (port 8001)
                         └─ in-memory mock dataset
                            (built once at startup from ATHLETE_ROSTER + races)
```

- All mock-data logic lives in **one file**: `/backend/server.py` (≈400 lines).
- Roster, skill baselines (per-athlete), and venue list are top-level constants.
- Race generation simulates 5-shot bouts per athlete, computes ski/range/penalty time,
  ranks results, picks `fastest_skier_id` + `best_shooter_id`.
- `/api/athletes` and `/api/dashboard/summary` recompute aggregates on every call
  (cheap at 20×10 — see "Known Trade-offs").

---

## 3. Key Files (in order of importance)

| File | Purpose | Notes |
|---|---|---|
| `/backend/server.py` | All API routes + mock data generator | Pure single file. Edit `ATHLETE_ROSTER` to tweak rankings. |
| `/frontend/src/App.js` | Router & layout shell | 4 routes; wraps in `AppLayout`. |
| `/frontend/src/lib/api.js` | Axios client | Uses `REACT_APP_BACKEND_URL`. |
| `/frontend/src/pages/Dashboard.jsx` | KPIs, trend, top-5, scatter, podium | Recharts heavy. |
| `/frontend/src/pages/Athletes.jsx` | List + detail with radar, line, recent form | Default-selects first athlete on mount. |
| `/frontend/src/pages/Race.jsx` | Race picker, leaderboard, podium | 1-0-2-1 format + `TargetDots`. |
| `/frontend/src/pages/Compare.jsx` | A vs B selectors, radar overlay, diff table | DiffRow auto-flips winner colour by `biggerBetter`. |
| `/frontend/src/components/TargetDots.jsx` | 5-dot bout widget | Reuse for any new shooting visual. |
| `/frontend/src/components/InsightCard.jsx` | Yellow-bordered insight banner | Re-use for any rule-based or LLM insight. |
| `/frontend/src/index.css` | Design tokens + Google Fonts | Edit here, **not** Tailwind config. |

---

## 4. How To Extend

### Add a new athlete attribute (e.g., gender, club)
1. Add the field to each tuple in `ATHLETE_ROSTER` **and** unpack it in `_generate_athletes()`.
2. Surface it in `_athlete_summary()` if it's part of season aggregates.
3. Render in `Athletes.jsx` profile hero or list row.

### Add a new race type or venue
1. Append to `VENUES` (must be 10 entries to match the loop) or expand the loop range.
2. Add to `RACE_TYPES` and `bouts_count` / `base_course` lookups in `_generate_races()`.

### Tweak season standings
- Increase a player's `base_shoot` (hit probability) and/or `base_ski` (speed index)
  in `ATHLETE_ROSTER`. Total time = ski + range + penalty(misses), so ski has
  the biggest impact on rank.
- After editing, restart backend: `sudo supervisorctl restart backend`.

### Add a new page
1. Create `/frontend/src/pages/MyPage.jsx`.
2. Register in `App.js` `<Routes>`.
3. Add a nav entry in `Sidebar.jsx` (`NAV` array — provide `to`, `label`, `icon`, `testid`).
4. Add `data-testid` to every interactive element. Use existing tokens / shadcn/ui.

---

## 5. Backlog (from PRD)

**P1**
- Nations Cup / team standings page.
- Historical season comparison (24/25 vs 25/26).

**P2**
- Live race-polling simulation (auto-incrementing leaderboard).
- Exportable PNG athlete card (html-to-image library).
- LLM-generated coach insights (Claude via Emergent Universal Key — replaces the rule-based `insight` string).
- Women's circuit toggle (separate `ATHLETE_ROSTER_W` + filter on all routes).

**Nice-to-have**
- Cache `_athlete_summary` results since `RACES` is built once.
- Loading skeletons / explicit error boundaries.
- Filter races by venue or race type on the Races page.

---

## 6. Known Trade-offs / Tech Debt

- `/api/athletes` and `/api/dashboard/summary` re-aggregate per request. Negligible at 20×10 but scales poorly — switch to memoized startup compute if dataset grows.
- Mongo is imported but never used; safe to remove if persistence is never added.
- Random in-race variance still causes ±1 rank wiggle vs real-world 25/26 standings (Botn/Laegreid, Samuelsson/Giacomel). Tightening would require hard-coding race results, which defeats the simulation.
- All API responses are `dict`/`list` — no Pydantic response models. Add them when surface stabilises.

---

## 7. Working Conventions

- **Always** restart backend after editing `server.py` (it does hot-reload but a manual `sudo supervisorctl restart backend` is reliable).
- **Always** use `yarn` for frontend deps. After `yarn add`, no restart needed (hot reload).
- **Always** run `mcp_lint_python` / `mcp_lint_javascript` before declaring done.
- **Always** call `testing_agent_v3` after a non-trivial feature — see existing test report at `/test_reports/iteration_1.json` and the regression suite at `/backend/tests/test_biathlon_api.py`.
- Edit existing files via `search_replace`, not `create_file` with overwrite, unless the change is structural.

---

## 8. First-Touch Sanity Checks

```bash
# Backend healthy
curl -s $REACT_APP_BACKEND_URL/api/ | jq .

# Roster reflects 25/26 reality (Perrot #1)
curl -s $REACT_APP_BACKEND_URL/api/athletes | python3 -c \"
import sys, json
for a in json.load(sys.stdin)[:5]:
    print(a['season_rank'], a['athlete_name'], a['country_code'], a['points'])
\"

# Frontend builds without lint errors
# (run by main agent, not user)
```

If any of these fail, start in `server.py` — that's where 95% of the logic lives.