import { isOverdue } from '../todoUtils';

const PAST_DATE = '2020-01-01';
const FUTURE_DATE = '2099-12-31';

const todayStr = (() => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
})();

describe('isOverdue', () => {
  it('returns true for an incomplete todo with a past due date', () => {
    expect(isOverdue({ dueDate: PAST_DATE, completed: 0 })).toBe(true);
  });

  it('returns false for an incomplete todo due today (today is not overdue)', () => {
    expect(isOverdue({ dueDate: todayStr, completed: 0 })).toBe(false);
  });

  it('returns false for an incomplete todo with a future due date', () => {
    expect(isOverdue({ dueDate: FUTURE_DATE, completed: 0 })).toBe(false);
  });

  it('returns false for an incomplete todo with no due date (null)', () => {
    expect(isOverdue({ dueDate: null, completed: 0 })).toBe(false);
  });

  it('returns false for an incomplete todo with no due date (undefined)', () => {
    expect(isOverdue({ dueDate: undefined, completed: 0 })).toBe(false);
  });

  it('returns false for a completed todo with a past due date', () => {
    expect(isOverdue({ dueDate: PAST_DATE, completed: 1 })).toBe(false);
  });
});
