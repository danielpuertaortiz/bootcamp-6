# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todo-items` | **Date**: 2026-06-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-overdue-todo-items/spec.md`

## Summary

Add visual overdue identification to the todo list. Incomplete todos whose due
date is strictly before today display a warning icon (⚠) plus a color accent
(using `--danger-color`) on the card, and the due date text is also styled in
that color. The overdue state is a pure frontend derived computation — no
backend or API changes are required. A single reusable `isOverdue` utility
function drives all detection logic.

## Technical Context

**Language/Version**: JavaScript (ES2020+); React 18 (frontend); Node.js 18+
with Express (backend)

**Primary Dependencies**: React, React Testing Library, Jest (frontend);
Express, better-sqlite3, Jest (backend); no new dependencies for this feature

**Storage**: SQLite via better-sqlite3 — N/A for this feature; `dueDate` field
already persisted as ISO `YYYY-MM-DD` string; no schema changes required

**Testing**: Jest + React Testing Library (frontend); Jest (backend); unit tests
for utility function + component tests for indicator rendering

**Target Platform**: Desktop browser (Chrome/Firefox/Safari); no mobile
optimization required per constitution

**Project Type**: Web application — npm monorepo (`packages/frontend`,
`packages/backend`)

**Performance Goals**: Overdue indicator update is a synchronous React state
transition — well under the 500 ms SC-003 threshold; no async work involved

**Constraints**: Pure frontend change; 2-space indentation; DRY/KISS; single-
responsibility modules; theme CSS variables only (no hard-coded colors)

**Scale/Scope**: Single-user; small list size; O(n) linear scan over todo array
is sufficient

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Scope Fidelity**: PASS — the feature derives overdue status from the
  existing `dueDate` field. No filtering, search, bulk operations, or other
  out-of-scope capabilities are introduced. The overdue state is a display-only
  derived property; the data model is unchanged.

- **API-Backed Integrity**: PASS — no new mutations or API calls are introduced.
  The due date already persists through the backend API. Toggling completion
  (existing feature) persists through the API, and the overdue indicator
  recalculates on the next render from the updated `completed` field. No
  client-only state diverges from backend truth.

- **Code Quality**: PASS — overdue detection is isolated in a single named
  utility function (`isOverdue`). Visual treatment is isolated to one CSS block
  (`.todo-card.overdue`). No duplication of date-comparison logic. 2-space
  indentation, descriptive naming, and single-responsibility structure are
  maintained throughout.

- **Test-First Verification**: PASS — required tests:
  (a) Unit tests for `isOverdue` covering all boundary cases (past/today/future/
  no-date × incomplete/complete);
  (b) Component tests for `TodoCard` verifying `overdue` CSS class presence
  and warning icon rendering for overdue items, and absence for non-overdue;
  (c) Component tests verifying overdue class removed when `completed = 1`.
  All repository tests must pass before merge; 80%+ coverage target maintained.

- **UX and Accessibility**: PASS — overdue indicator uses warning icon (⚠) as
  non-color signal (satisfies WCAG 1.4.1) plus `--danger-color` accent (meets
  WCAG AA contrast in both themes). Card layout and interactive controls
  (checkbox, edit, delete) are not reordered or obscured. Keyboard navigation
  and visible focus states are preserved. All color values use existing CSS
  variables.

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todo-items/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/frontend/
├── src/
│   ├── components/
│   │   ├── TodoCard.js                  # MODIFY: add isOverdue call + overdue class + ⚠ icon
│   │   └── __tests__/
│   │       └── TodoCard.test.js         # MODIFY: add overdue rendering tests
│   ├── utils/
│   │   ├── todoUtils.js                 # CREATE: isOverdue() utility function
│   │   └── __tests__/
│   │       └── todoUtils.test.js        # CREATE: unit tests for isOverdue
│   └── App.css                          # MODIFY: add .todo-card.overdue styles
```

**Structure Decision**: Option 2 (web application monorepo). All changes are
isolated to `packages/frontend`. No backend files are modified. New utility
goes in `packages/frontend/src/utils/` to keep single-responsibility and enable
reuse from other components if needed.

## Complexity Tracking

No constitution violations — table omitted.
