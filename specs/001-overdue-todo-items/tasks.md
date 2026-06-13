# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `specs/001-overdue-todo-items/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | quickstart.md ✅

**Tests**: Test tasks are included for every behavioral change per Constitution
Principle IV (Test-First Verification). Unit tests for the `isOverdue` utility
and component tests for `TodoCard` overdue rendering are required before merge.

**Organization**: Tasks are grouped by user story to enable independent
implementation and testing of each story. All changes are in
`packages/frontend/` — no backend files are modified.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependency on incomplete tasks)
- **[Story]**: User story scope — US1, US2, or US3
- Exact file paths are included in every task description

---

## Phase 1: Setup

**Purpose**: Establish a clean, passing baseline before any changes are made.

- [ ] T001 Run existing frontend test suite and confirm all tests pass before starting: `npm test --workspace=packages/frontend`

**Checkpoint**: All existing tests green — ready to implement.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the `isOverdue()` utility function and its unit tests. This
single function is the core computation engine that all three user stories
depend on. No user story work can proceed until this phase is complete.

**⚠️ CRITICAL**: Write tests (T002) before implementation (T003) so they fail
first — proving the tests are meaningful before the implementation makes them
pass.

- [ ] T002 [P] Create `packages/frontend/src/utils/__tests__/todoUtils.test.js` with unit tests for all `isOverdue` boundary cases:
  - past due date + incomplete → `true`
  - today's date + incomplete → `false`
  - future due date + incomplete → `false`
  - null due date + incomplete → `false`
  - past due date + completed (value `1`) → `false`
  - past due date + completed (value `0`) → `true`
  (Tests must FAIL before T003 is implemented)

- [ ] T003 Create `packages/frontend/src/utils/todoUtils.js` exporting `isOverdue(todo)` function that: (1) returns `false` if `todo.dueDate` is null, (2) parses `dueDate` using `new Date(year, month-1, day)` for local-time comparison (avoids UTC timezone off-by-one), (3) returns `true` only when parsed date is strictly before today's local midnight AND `todo.completed !== 1`

**Checkpoint**: `npm test --workspace=packages/frontend -- --testPathPattern=todoUtils` — all 6 boundary-case unit tests pass.

---

## Phase 3: User Story 1 — Visual Overdue Indicator on Todo List (Priority: P1) 🎯 MVP

**Goal**: Incomplete todos with a past due date display a ⚠ warning icon, a
`--danger-color` accent on the card, and the due date text styled in the same
color. Non-overdue and completed todos are unaffected.

**Independent Test**: Seed the list with todos covering all boundary cases
(past/today/future/no-date dates, complete/incomplete status) and confirm only
the correct subset shows the overdue indicator. See `quickstart.md` Scenario 1.

### Tests for User Story 1 ⚠️

- [ ] T004 [P] [US1] Add overdue-rendering tests to `packages/frontend/src/components/__tests__/TodoCard.test.js`:
  - overdue incomplete todo (past date, `completed: 0`) → card has CSS class `overdue`
  - overdue incomplete todo → ⚠ icon element is present in rendered output
  - overdue incomplete todo → due-date text element has `overdue-date` class (or equivalent)
  - incomplete todo due today → card does NOT have class `overdue`
  - incomplete todo with future date → card does NOT have class `overdue`
  - incomplete todo with no due date → card does NOT have class `overdue`
  - completed todo with past due date (`completed: 1`) → card does NOT have class `overdue`
  (Write tests first; they must FAIL before T005 and T006 are complete)

### Implementation for User Story 1

- [ ] T005 [P] [US1] Add `.todo-card.overdue` CSS block and `.todo-card.overdue .todo-due-date` rule to `packages/frontend/src/App.css`:
  - `.todo-card.overdue`: add `border-left: 3px solid var(--danger-color)` and a subtle background tint (`background-color` using `--danger-color` at ~8% opacity via `rgba` or CSS `color-mix` if supported, else a low-opacity inline definition)
  - `.todo-card.overdue .todo-due-date`: set `color: var(--danger-color)` and `font-weight: 600`
  - Use only `--danger-color` (defined in both light and dark themes in `packages/frontend/src/styles/theme.css`) — no hard-coded hex values

- [ ] T006 [US1] Modify `packages/frontend/src/components/TodoCard.js` to add overdue indicator:
  - Import `isOverdue` from `../utils/todoUtils`
  - Compute `const overdue = isOverdue(todo)` inside the render function (before the `if (isEditing)` branch)
  - Change card `className` from `` `todo-card ${todo.completed ? 'completed' : ''}` `` to `` `todo-card ${todo.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}` ``
  - Inside the `{todo.dueDate && (...)}` block, prepend a `<span aria-label="Overdue" role="img" className="overdue-icon">⚠</span>` before the due date text when `overdue` is true
  - Apply `className="todo-due-date overdue-date"` (or `className={overdue ? 'todo-due-date overdue-date' : 'todo-due-date'}`) to the `<p>` element

**Checkpoint**: `npm test --workspace=packages/frontend -- --testPathPattern=TodoCard` — all US1 tests green. Manual check via `quickstart.md` Scenario 1.

---

## Phase 4: User Story 2 — Overdue State Clears When Todo Is Completed (Priority: P2)

**Goal**: When an overdue todo is marked complete, the overdue indicator
disappears immediately. When re-opened (marked incomplete), it reappears.
No new implementation is needed — the indicator is derived from `todo.completed`
on every render, so toggling via `onToggle` → state update → re-render
automatically recalculates `isOverdue`. This phase adds the tests that prove
the behavior.

**Independent Test**: Render a `TodoCard` with `completed: 0` and a past date
— confirm overdue class present. Re-render with `completed: 1` — confirm
overdue class absent. See `quickstart.md` Scenario 2.

### Tests for User Story 2 ⚠️

- [ ] T007 [US2] Add toggle-state tests to `packages/frontend/src/components/__tests__/TodoCard.test.js`:
  - todo with past date + `completed: 0` → card has class `overdue` (baseline)
  - todo with past date + `completed: 1` → card does NOT have class `overdue`
  - todo with past date + `completed: 0` → ⚠ icon present; same todo with `completed: 1` → ⚠ icon absent
  (These tests rely on the component accepting `completed` as a prop — no `fireEvent.click` simulation of backend needed; just re-render with updated prop)

**Checkpoint**: `npm test --workspace=packages/frontend -- --testPathPattern=TodoCard` — all US2 tests green. Manual check via `quickstart.md` Scenario 2.

---

## Phase 5: User Story 3 — Overdue Indicator Consistent Across Themes (Priority: P3)

**Goal**: The overdue indicator (icon + color accent + date text) remains
clearly visible and distinguishable in both light and dark modes. `theme.css`
already defines `--danger-color` for both themes — no CSS variable changes are
needed. This phase verifies the implementation uses only theme variables and
adds a test confirming the `overdue` class is theme-independent.

**Independent Test**: Toggle app theme to dark mode and confirm the ⚠ icon and
color accent remain visible. See `quickstart.md` Scenario 3.

### Implementation for User Story 3

- [ ] T008 [P] [US3] Audit `packages/frontend/src/App.css` overdue CSS block added in T005: confirm zero hard-coded hex color values are present — all color references MUST use `var(--danger-color)`. Confirm `packages/frontend/src/styles/theme.css` `[data-theme="dark"]` block already defines `--danger-color: #ef5350` (no `theme.css` changes needed). Document this verification in a comment above the `.todo-card.overdue` block: `/* uses --danger-color; theme-aware: see theme.css */`

- [ ] T009 [US3] Add theme-consistency test to `packages/frontend/src/components/__tests__/TodoCard.test.js`: render an overdue `TodoCard` without any `data-theme` DOM attribute (light mode default) and confirm `overdue` class is present; then verify the same props produce `overdue` class regardless of external theme state (CSS class presence is theme-independent — the rendered color is theme-dependent but determined by CSS, not JS)

**Checkpoint**: `npm test --workspace=packages/frontend` — all tests green. Manual check via `quickstart.md` Scenario 3.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation sweep across all user stories.

- [ ] T010 [P] Run full frontend test suite and confirm no regressions: `npm test --workspace=packages/frontend` — all tests (existing + new) must pass

- [ ] T011 Complete the manual verification checklist in `specs/001-overdue-todo-items/quickstart.md` — check every item in the Verification Checklist section before marking the feature ready for PR

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational (T003 must be complete before T006)
- **US2 (Phase 4)**: Depends on US1 (T006 must be complete; T007 is test-only)
- **US3 (Phase 5)**: Depends on US1 (T005 must be complete before T008/T009)
- **Polish (Phase 6)**: Depends on all phases being complete

### User Story Dependencies

- **US1 (P1)**: Requires Foundational phase — no dependency on US2 or US3
- **US2 (P2)**: Requires US1 implementation (T006) — behavior derives from US1; only test tasks added
- **US3 (P3)**: Requires US1 CSS implementation (T005) — verification only

### Within Each Phase

- T002 (tests) MUST be written before T003 (implementation) — tests must fail first
- T004 (component tests) MUST be written before T006 (implementation) — tests must fail first
- T005 (CSS) and T004 (component tests) are [P] — touch different files, no dependency on each other
- T005 (CSS) and T006 (JS) are sequential — T006 references the CSS class; T005 should exist first

### Parallel Opportunities

| Parallel Group | Tasks | Notes |
|---|---|---|
| Phase 2 bootstrap | T002 (tests), can start T005 (CSS) early | T005 has no dependency on Foundational |
| Phase 3 | T004 + T005 | Different files — CSS and test file |
| Phase 6 | T010 + T011 | Independent validation tasks |

---

## Implementation Strategy

**MVP Scope** (just P1 — delivers full user-facing value):
Phase 1 → Phase 2 → Phase 3 = T001 → T002 → T003 → T004 → T005 → T006

**Full Delivery** (all three user stories):
All phases in order, T001 through T011.

**Estimated task count by story**:
- Setup: 1 task (T001)
- Foundational: 2 tasks (T002–T003)
- US1: 3 tasks (T004–T006)
- US2: 1 task (T007)
- US3: 2 tasks (T008–T009)
- Polish: 2 tasks (T010–T011)
- **Total: 11 tasks**
