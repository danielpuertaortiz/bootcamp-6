# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todo-items`

**Created**: 2026-06-13

**Status**: Draft

**Input**: User description: "Support for Overdue Todo Items — Users need a clear, visual way to identify which todos have not been completed by their due date."

## Clarifications

### Session 2026-06-13

- Q: What should the overdue visual indicator consist of? → A: Warning icon (⚠ or clock) + color accent on the card (meets WCAG 1.4.1 non-color signal requirement)
- Q: Should the indicator show how many days overdue, or a binary signal? → A: Binary only — icon + color accent, no day count
- Q: Should the due date text itself change styling when overdue? → A: Yes — due date text is also styled in the accent/warning color alongside the card-level accent

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Overdue Indicator on Todo List (Priority: P1)

A user opens the todo list and immediately sees which items are overdue without
having to manually compare due dates to today's date. Overdue incomplete todos
are styled differently from non-overdue and completed todos, making them easy
to spot at a glance.

**Why this priority**: This is the core value of the feature. Without a visual
distinction, users gain no benefit — they must still read and mentally parse
every date. P1 delivers the entire user-facing value proposition independently.

**Independent Test**: Can be fully tested by seeding the list with todos having
past, future, and no due dates, then verifying the correct items receive the
overdue visual treatment and others do not.

**Acceptance Scenarios**:

1. **Given** an incomplete todo with a due date that is before today's date,
   **When** the user views the todo list,
   **Then** that todo displays a distinct visual indicator marking it as overdue.

2. **Given** an incomplete todo with a due date equal to today's date,
   **When** the user views the todo list,
   **Then** that todo does NOT display an overdue indicator (today is not overdue).

3. **Given** an incomplete todo with a due date in the future,
   **When** the user views the todo list,
   **Then** that todo does NOT display an overdue indicator.

4. **Given** an incomplete todo with no due date,
   **When** the user views the todo list,
   **Then** that todo does NOT display an overdue indicator.

5. **Given** a completed todo with a due date that is before today's date,
   **When** the user views the todo list,
   **Then** that todo does NOT display an overdue indicator (completed tasks are exempt).

---

### User Story 2 - Overdue State Clears When Todo Is Completed (Priority: P2)

A user marks an overdue todo as complete and the overdue visual indicator is
immediately removed, providing instant feedback that the task is resolved.

**Why this priority**: Without this behavior, completed tasks would incorrectly
appear overdue and create confusion. It is a correctness requirement that
depends on P1 being implemented first.

**Independent Test**: Can be fully tested by toggling completion on an
overdue todo and confirming the overdue styling disappears without a page
reload.

**Acceptance Scenarios**:

1. **Given** an overdue todo is visible in the list with its overdue indicator,
   **When** the user marks it as complete,
   **Then** the overdue visual indicator is immediately removed and the item
   appears in completed styling only.

2. **Given** a completed todo that has a past due date,
   **When** the user marks it as incomplete,
   **Then** the overdue visual indicator reappears immediately because the due
   date is still in the past.

---

### User Story 3 - Overdue Indicator Consistent Across Themes (Priority: P3)

A user who has switched to dark mode (or light mode) can still clearly identify
overdue todos, because the visual treatment is legible and meets contrast
requirements in both themes.

**Why this priority**: The app supports light/dark mode. The overdue indicator
must be visible in both; otherwise users in one theme receive a broken
experience. Depends on P1.

**Independent Test**: Can be fully tested by toggling the theme and confirming
the overdue indicator remains visible and distinguishable in both modes.

**Acceptance Scenarios**:

1. **Given** an overdue todo is displayed in light mode,
   **When** the user switches to dark mode,
   **Then** the overdue visual indicator remains clearly visible and
   distinguishable in dark mode.

2. **Given** an overdue todo is displayed in dark mode,
   **When** the user switches to light mode,
   **Then** the overdue visual indicator remains clearly visible and
   distinguishable in light mode.

---

### Edge Cases

- What happens when a todo's due date is exactly today? → It is NOT overdue;
  overdue is strictly defined as a date strictly before today's date.
- What happens when a completed todo's due date is in the past? → It is NOT
  shown as overdue; completion status takes precedence.
- What happens when a todo has no due date? → It is never overdue.
- What happens when the user's system clock changes? → The overdue calculation
  uses the current date at render time; the state reflects the new date on the
  next render.
- What happens if all todos are overdue? → All applicable items receive the
  overdue indicator; there is no cap or limit.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A todo item MUST be classified as overdue when ALL of the
  following are true: it has a due date set, the due date is strictly before
  today's date (not including today), and it is not yet marked as complete.
- **FR-002**: The todo list MUST visually distinguish overdue items from
  non-overdue incomplete items and completed items using: (a) a warning icon
  (⚠ or clock symbol) on the todo card, (b) a color accent applied to the
  todo card, and (c) the due date text styled in the same accent/warning color.
  The indicator MUST include a non-color signal (the icon) to satisfy WCAG
  1.4.1 (Use of Color). The signal is binary — no day count or quantitative
  text is shown.
- **FR-003**: The overdue visual indicator MUST be applied automatically on
  every render based on the current date; no user action is required to trigger
  it.
- **FR-004**: Completed todo items MUST NOT display an overdue indicator,
  regardless of their due date.
- **FR-005**: Todo items with no due date MUST NOT display an overdue indicator.
- **FR-006**: When a user toggles an overdue todo to complete, the overdue
  indicator MUST be removed immediately without a page reload.
- **FR-007**: When a user toggles a completed todo (that has a past due date)
  back to incomplete, the overdue indicator MUST reappear immediately.
- **FR-008**: The overdue visual treatment MUST be legible in both the light and
  dark themes, consistent with the existing Halloween-themed design system.
- **FR-009**: The overdue indicator MUST NOT interfere with existing interactive
  controls (checkbox/toggle, edit, delete) or keyboard navigation.

### Key Entities

- **Todo Item**: Represents a task with a title, optional due date, and
  completion status. The overdue state is a derived property — not stored —
  computed by comparing the due date to the current date and checking completion
  status.
- **Overdue State**: A transient, computed boolean on a Todo Item. True when
  due date is set, due date < today, and the item is incomplete. Stored nowhere;
  recalculated on every render.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can identify all overdue todos within 5 seconds of opening
  the todo list, without manually reading or comparing any dates. The indicator
  is binary (overdue or not); no day count or quantitative text is displayed.
- **SC-002**: The overdue indicator is applied correctly (present or absent) for
  100% of todo items on every page load, covering all combinations of due date
  and completion status.
- **SC-003**: Marking an overdue todo as complete removes the overdue visual
  indicator in under 500 ms (perceived as immediate).
- **SC-004**: The overdue visual treatment meets WCAG AA contrast requirements
  in both light and dark modes.
- **SC-005**: Existing todo operations (create, edit, toggle, delete) continue
  to function correctly; no regression is introduced by this feature.

## Assumptions

- Overdue is defined strictly as: due date < today (a task due today is not
  overdue until tomorrow).
- The due date comparison uses the user's local date (browser/device date); no
  server-side time zone conversion is required for v1.
- No new backend API fields or schema changes are required — the overdue state
  is computed entirely on the frontend from the existing due date field.
- The visual indicator is applied at the todo card/list item level; a separate
  "overdue" section or filter is out of scope for this feature.
- The feature applies to the main todo list view only; no other views exist in
  scope.
- Mobile-specific optimization remains out of scope consistent with the
  existing functional requirements.

## Constitution Alignment *(mandatory)*

- **Scope Fidelity**: This feature operates entirely within the existing in-scope
  due date field and the todo list view. It introduces no new data models,
  filtering, search, bulk actions, or other out-of-scope capabilities. The
  overdue state is a derived display property of existing data.
- **API-Backed Integrity**: No new API endpoints or data persistence is required.
  The due date is already stored in and retrieved from the backend. Overdue
  detection is a pure frontend computation; no backend state diverges from
  backend truth.
- **Code Quality**: The overdue detection logic MUST be implemented as a single,
  named, reusable utility function. Visual treatment MUST be isolated to the
  relevant component styles. No duplication of date-comparison logic across
  components.
- **Test-First Verification**: Required tests include: (a) unit tests for the
  overdue date-comparison utility covering all boundary conditions (past date,
  today, future date, no date, completed status); (b) component tests verifying
  the overdue indicator renders for overdue items and does not render for
  non-overdue items; (c) component tests verifying the indicator is removed when
  a todo is toggled to complete. Coverage impact: adds unit and component
  coverage to frontend package, expected to maintain or exceed 80% threshold.
- **UX and Accessibility**: The overdue indicator MUST consist of a warning
  icon (⚠ or clock) plus a color accent on the todo card, with the due date
  text also rendered in the same accent/warning color. This three-part treatment
  satisfies WCAG 1.4.1 by providing a non-color signal (icon). The icon, card
  accent, and date text color MUST all meet WCAG AA contrast requirements in
  both light and dark themes. The indicator MUST NOT obscure or reorder existing
  interactive elements. Keyboard navigation and visible focus states on all
  existing controls MUST be preserved. All color values MUST use theme CSS
  variables rather than hard-coded colors.
