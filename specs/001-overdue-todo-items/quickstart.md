# Quickstart Validation Guide: Support for Overdue Todo Items

**Phase**: 1 | **Date**: 2026-06-13 | **Plan**: [plan.md](./plan.md)

This guide documents how to validate that the overdue indicator feature works
end-to-end after implementation. It is not an implementation guide — see
`tasks.md` for step-by-step implementation tasks.

---

## Prerequisites

- Node.js 18+ installed
- npm workspaces installed (`npm install` from repo root)
- Backend server running on port 3001
- Frontend dev server running on port 3000

---

## Setup

```bash
# From repo root
npm install

# Terminal 1 — start backend
cd packages/backend && npm start

# Terminal 2 — start frontend
cd packages/frontend && npm start
```

Open `http://localhost:3000` in a browser.

---

## Scenario 1: Overdue indicator appears on past-due incomplete todos

1. Create a todo with a due date set to yesterday (e.g., 2026-06-12).
2. **Expected**: The todo card shows a ⚠ warning icon, a color accent on the
   card, and the due date text rendered in the warning/danger color.
3. Create a todo with a due date set to today (2026-06-13).
4. **Expected**: No overdue indicator — today is not overdue.
5. Create a todo with a due date set to tomorrow (2026-06-14).
6. **Expected**: No overdue indicator.
7. Create a todo with no due date.
8. **Expected**: No overdue indicator.

---

## Scenario 2: Completed todos are never marked overdue

1. Find or create an overdue todo (past due date, incomplete) — it should show
   the overdue indicator.
2. Check the checkbox to mark it complete.
3. **Expected**: The overdue indicator disappears immediately. The todo shows
   completed styling (strikethrough) only.
4. Uncheck the checkbox to mark it incomplete again.
5. **Expected**: The overdue indicator reappears immediately.

---

## Scenario 3: Overdue indicator in both themes

1. Ensure an overdue todo is visible in the list.
2. Toggle the theme to dark mode using the theme switch in the header.
3. **Expected**: The warning icon and color accent remain clearly visible in
   dark mode. The due date text color is still distinguishable from the
   surrounding text.
4. Toggle back to light mode.
5. **Expected**: Indicator remains visible in light mode.

---

## Automated Test Validation

```bash
# Run all frontend tests (from repo root)
npm test --workspace=packages/frontend

# Run only overdue utility tests
cd packages/frontend && npx jest todoUtils --no-coverage

# Run only TodoCard component tests
cd packages/frontend && npx jest TodoCard --no-coverage
```

**Expected outcomes**:
- `todoUtils.test.js` — all boundary cases pass (past/today/future/null ×
  incomplete/complete)
- `TodoCard.test.js` — overdue class and icon present for overdue items,
  absent for non-overdue and completed items
- No existing tests are broken

---

## Verification Checklist

- [ ] ⚠ icon appears on incomplete todos with a past due date
- [ ] ⚠ icon does NOT appear on todos due today
- [ ] ⚠ icon does NOT appear on todos with a future due date
- [ ] ⚠ icon does NOT appear on todos with no due date
- [ ] ⚠ icon does NOT appear on completed todos, even with a past due date
- [ ] Checking an overdue todo removes the ⚠ icon immediately
- [ ] Unchecking a past-due completed todo restores the ⚠ icon immediately
- [ ] Overdue styling is visible in light mode
- [ ] Overdue styling is visible in dark mode
- [ ] Edit, delete, and checkbox controls still function correctly on overdue cards
- [ ] All automated tests pass
