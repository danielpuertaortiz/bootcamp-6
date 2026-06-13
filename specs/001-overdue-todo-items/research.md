# Research: Support for Overdue Todo Items

**Phase**: 0 | **Date**: 2026-06-13 | **Plan**: [plan.md](./plan.md)

## Summary

No external unknowns required third-party research. All decisions are resolved
from direct codebase inspection of `packages/frontend/` and from JavaScript
date handling best practices. No new dependencies are needed.

---

## Decision 1: JavaScript Date Comparison Strategy

**Question**: How should the `isOverdue` utility compare `dueDate` (ISO string
`YYYY-MM-DD`) against today's date without timezone-related off-by-one errors?

**Decision**: Parse `dueDate` into a local-time `Date` object using year/month/
day components and compare against today's date at midnight local time.

```text
[year, month, day] = dueDate.split('-').map(Number)
dueDate = new Date(year, month - 1, day)   // local midnight
today   = new Date(); today.setHours(0,0,0,0)  // local midnight
overdue = dueDate < today && todo.completed !== 1
```

**Rationale**: `new Date("2025-12-25")` parses an ISO date-only string as UTC
midnight, which can shift the day backward by up to 12 hours for users in
negative UTC offsets (e.g., UTC-5 sees 2025-12-24 at 7pm). Constructing
`new Date(year, month-1, day)` always creates a local-time date and avoids
the timezone shift entirely. No external library (e.g., date-fns, moment.js)
is needed — this single comparison is straightforward with native Date.

**Alternatives considered**:
- `new Date(dueDate) < new Date()` — Rejected: UTC parse causes off-by-one
  for users in negative UTC offsets.
- `date-fns` library — Rejected: adds a dependency for a two-line computation;
  KISS principle applies.
- `dayjs` library — Rejected: same rationale as date-fns.

---

## Decision 2: Overdue Color Token — New Variable vs. Reuse Existing

**Question**: Should a new `--overdue-color` CSS variable be introduced in
`theme.css`, or should an existing token (`--danger-color`, `--color-primary`)
be reused for the overdue indicator?

**Decision**: Reuse `--danger-color` directly. No new CSS variable is added.

**Rationale**: `--danger-color` already carries the correct semantic meaning
("something is wrong / needs attention"), is defined for both light
(`#c62828`) and dark (`#ef5350`) modes with appropriate contrast, and is used
elsewhere (error banners, delete button) for consistent design language.
Adding `--overdue-color` that maps to the same value would add indirection
without benefit. If the design needs to diverge later, the variable can be
added at that point.

**Alternatives considered**:
- `--color-primary` (orange) — Rejected: orange is the brand accent used for
  interactive/positive elements; red carries clearer "alert" semantics for
  overdue.
- New `--overdue-color` variable — Rejected: YAGNI; it would alias
  `--danger-color` with no current differentiation need.

---

## Decision 3: Utility Function Location

**Question**: Where should the `isOverdue` utility function live?

**Decision**: `packages/frontend/src/utils/todoUtils.js` (new file).

**Rationale**: Placing it in a `utils/` module keeps `TodoCard.js` focused on
rendering concerns (single-responsibility), makes the function independently
testable, and allows any other component (e.g., a future `TodoList` filter or
`TodoForm` preview) to import it without coupling through a component. This
aligns with the constitution's DRY and single-responsibility requirements.

**Alternatives considered**:
- Inline in `TodoCard.js` — Rejected: mixes business logic into a render
  component, harder to unit test in isolation, and couples the logic to
  a single component.
- Add to existing `todoService.js` (frontend) — Rejected: that module handles
  API communication; date logic is a different concern.

---

## Decision 4: Warning Icon — Unicode vs. SVG/Icon Library

**Question**: Should the overdue warning icon be a Unicode character (⚠) or
an SVG/icon from a library?

**Decision**: Unicode character `⚠` (U+26A0, WARNING SIGN), rendered in a
`<span>` with an `aria-label`.

**Rationale**: The existing codebase uses Unicode characters for all icons
(✎ for edit, ✕ for delete, 🎃 for the app header) — no icon library is
present. Introducing one for a single icon violates KISS and adds a dependency.
The `⚠` character renders across all target browsers, is recognizable as a
warning signal, and is semantically annotated with `aria-label="Overdue"` so
screen readers surface the meaning regardless of how the glyph renders.

**Alternatives considered**:
- SVG inline icon — Rejected: adds complexity for no user-visible benefit given
  existing Unicode icon pattern.
- react-icons / heroicons — Rejected: adds a new dependency for a single icon;
  inconsistent with the rest of the codebase.

---

## Decision 5: CSS Class Approach for Overdue State

**Question**: How should the overdue visual state be applied — CSS class on the
card, inline styles, or CSS custom properties toggled via JS?

**Decision**: CSS class `overdue` added to the `.todo-card` element when
`isOverdue(todo)` is true, mirroring the existing `completed` class pattern.

**Rationale**: The existing `TodoCard.js` already uses `className={`todo-card
${todo.completed ? 'completed' : ''}`}` as its pattern for state-based styling.
Applying `overdue` as an additional class is consistent with this convention,
keeps styles in CSS (not JS), and allows cascading rules like
`.todo-card.overdue .todo-due-date` without any style prop manipulation.

**Alternatives considered**:
- Inline styles — Rejected: diverges from the established class-based pattern
  and makes theming harder.
- CSS custom property toggled in JS — Rejected: over-engineered for a simple
  binary state.
