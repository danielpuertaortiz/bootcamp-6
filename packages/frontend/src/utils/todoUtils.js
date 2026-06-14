/**
 * Todo utility functions
 */

/**
 * Determines whether a todo item is overdue.
 *
 * A todo is overdue when ALL of the following are true:
 *  - it has a due date set (non-null, non-undefined)
 *  - the due date is strictly before today's local date (today itself is not overdue)
 *  - it is not yet marked as complete (completed !== 1)
 *
 * Date parsing uses local-time construction (new Date(y, m, d)) to avoid the
 * UTC-midnight off-by-one that occurs when parsing ISO strings with new Date().
 *
 * @param {Object} todo - Todo object with dueDate (string|null) and completed (0|1)
 * @returns {boolean}
 */
export function isOverdue(todo) {
  if (!todo.dueDate) return false;

  const [year, month, day] = todo.dueDate.split('-').map(Number);
  const due = new Date(year, month - 1, day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return due < today && todo.completed !== 1;
}
