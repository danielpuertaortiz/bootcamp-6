# Data Model: Support for Overdue Todo Items

**Phase**: 1 | **Date**: 2026-06-13 | **Plan**: [plan.md](./plan.md)

## Overview

This feature introduces no new persistent entities and no changes to the
backend data model or API schema. The overdue state is a derived, transient
property computed entirely on the frontend from two existing fields.

---

## Existing Entity: Todo Item (unchanged)

| Field       | Type              | Constraints                     | Notes                           |
|-------------|-------------------|---------------------------------|---------------------------------|
| `id`        | integer           | primary key, auto-increment     | Assigned by backend             |
| `title`     | string            | required, max 255 characters    | Display name of the task        |
| `dueDate`   | string (ISO date) | optional, format `YYYY-MM-DD`   | Null when no due date set       |
| `completed` | integer           | 0 or 1                          | 0 = incomplete, 1 = complete    |
| `createdAt` | string (ISO)      | set on creation, immutable      | Used for default list ordering  |

No schema migrations are needed. No new fields are added to the Todo entity.

---

## Derived Property: Overdue State

The overdue state is not stored. It is computed per render by the frontend
utility function `isOverdue(todo)`.

**Inputs**:
- `todo.dueDate` — ISO date string (`YYYY-MM-DD`) or `null`
- `todo.completed` — integer `0` or `1`
- Current local date (obtained at call time)

**Output**: boolean

**Rules**:

| Condition                                      | Result      |
|------------------------------------------------|-------------|
| `dueDate` is null                              | `false`     |
| `dueDate` ≥ today (today or future)            | `false`     |
| `dueDate` < today AND `completed` = 1          | `false`     |
| `dueDate` < today AND `completed` = 0          | `true`      |

**Boundary**: "Today" is the user's local calendar date at midnight. A todo
due on today's date is NOT overdue.

**Logic**:

```
function isOverdue(todo):
  if todo.dueDate is null → return false
  parse dueDate as local midnight date
  set today to local midnight
  if dueDate < today AND todo.completed ≠ 1 → return true
  return false
```

---

## State Transitions

The overdue state changes automatically in response to two existing operations:

| Operation                              | Before           | After             |
|----------------------------------------|------------------|-------------------|
| Toggle incomplete overdue → complete   | overdue = true   | overdue = false   |
| Toggle complete (past date) → incomplete | overdue = false | overdue = true    |
| Edit due date to future date           | overdue = true   | overdue = false   |
| Edit due date to past date             | overdue = false  | overdue = true    |
| Day advances past a todo's due date    | overdue = false  | overdue = true (on next render) |

No new API calls are introduced by any of these transitions. The toggle and
edit operations already persist through the API; the overdue state recalculates
from the updated todo object on the next React render.

---

## Validation Rules (existing, unchanged)

- `dueDate` must be null or a valid ISO date string (`YYYY-MM-DD`).
- `title` must be a non-empty string of at most 255 characters.
- `completed` must be 0 or 1 (enforced by backend).
