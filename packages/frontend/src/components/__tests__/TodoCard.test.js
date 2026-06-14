import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });
});

describe('TodoCard — overdue indicator (US1)', () => {
  const PAST_DATE = '2020-01-01';
  const FUTURE_DATE = '2099-12-31';

  const todayStr = (() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  })();

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  it('applies overdue class to card for incomplete past-due todo', () => {
    const todo = { id: 1, title: 'Late task', dueDate: PAST_DATE, completed: 0, createdAt: '' };
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-card')).toHaveClass('overdue');
  });

  it('renders overdue warning icon for incomplete past-due todo', () => {
    const todo = { id: 1, title: 'Late task', dueDate: PAST_DATE, completed: 0, createdAt: '' };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByLabelText('Overdue')).toBeInTheDocument();
  });

  it('applies overdue-date class to due date text for overdue todo', () => {
    const todo = { id: 1, title: 'Late task', dueDate: PAST_DATE, completed: 0, createdAt: '' };
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-due-date')).toHaveClass('overdue-date');
  });

  it('does NOT apply overdue class when todo is due today', () => {
    const todo = { id: 1, title: 'Due today', dueDate: todayStr, completed: 0, createdAt: '' };
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-card')).not.toHaveClass('overdue');
  });

  it('does NOT apply overdue class for incomplete todo with future due date', () => {
    const todo = { id: 1, title: 'Future task', dueDate: FUTURE_DATE, completed: 0, createdAt: '' };
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-card')).not.toHaveClass('overdue');
  });

  it('does NOT apply overdue class for incomplete todo with no due date', () => {
    const todo = { id: 1, title: 'No date task', dueDate: null, completed: 0, createdAt: '' };
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-card')).not.toHaveClass('overdue');
  });

  it('does NOT apply overdue class for completed todo with past due date', () => {
    const todo = { id: 1, title: 'Done late', dueDate: PAST_DATE, completed: 1, createdAt: '' };
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-card')).not.toHaveClass('overdue');
  });
});

describe('TodoCard — overdue state on toggle (US2)', () => {
  const PAST_DATE = '2020-01-01';
  const mockHandlers = { onToggle: jest.fn(), onEdit: jest.fn(), onDelete: jest.fn() };

  it('shows overdue class when todo is incomplete with past due date', () => {
    const todo = { id: 1, title: 'Task', dueDate: PAST_DATE, completed: 0, createdAt: '' };
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-card')).toHaveClass('overdue');
  });

  it('removes overdue class when todo is marked complete', () => {
    const todo = { id: 1, title: 'Task', dueDate: PAST_DATE, completed: 1, createdAt: '' };
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-card')).not.toHaveClass('overdue');
  });

  it('removes overdue warning icon when todo is marked complete', () => {
    const todo = { id: 1, title: 'Task', dueDate: PAST_DATE, completed: 1, createdAt: '' };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
  });
});

describe('TodoCard — theme consistency (US3)', () => {
  const PAST_DATE = '2020-01-01';
  const mockHandlers = { onToggle: jest.fn(), onEdit: jest.fn(), onDelete: jest.fn() };

  it('applies overdue class regardless of theme attribute on document', () => {
    document.documentElement.removeAttribute('data-theme');
    const todo = { id: 1, title: 'Task', dueDate: PAST_DATE, completed: 0, createdAt: '' };
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-card')).toHaveClass('overdue');
  });

  it('applies overdue class in dark theme', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    const todo = { id: 1, title: 'Task', dueDate: PAST_DATE, completed: 0, createdAt: '' };
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-card')).toHaveClass('overdue');
    document.documentElement.removeAttribute('data-theme');
  });
});
