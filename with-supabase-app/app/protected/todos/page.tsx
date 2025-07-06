'use client';

import { useState, useEffect } from 'react';
import { Todo, TodoFilter as FilterType } from '@/lib/types';
import { TodoForm } from '@/components/todo/TodoForm';
import { TodoItem } from '@/components/todo/TodoItem';
import { TodoFilter } from '@/components/todo/TodoFilter';

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data.todos);
      setError(null);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('加载任务失败');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (title: string) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add todo');
      
      setTodos([data.todo, ...todos]);
      setError(null);
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('添加任务失败');
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const response = await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          completed: !todo.completed,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update todo');

      setTodos(todos.map(t => t.id === id ? data.todo : t));
      setError(null);
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('更新任务状态失败');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete todo');

      setTodos(todos.filter(todo => todo.id !== id));
      setError(null);
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('删除任务失败');
    }
  };

  const editTodo = async (id: string, newTitle: string) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          title: newTitle,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update todo');

      setTodos(todos.map(todo => todo.id === id ? data.todo : todo));
      setError(null);
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('更新任务失败');
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const counts = {
    all: todos.length,
    active: todos.filter(todo => !todo.completed).length,
    completed: todos.filter(todo => todo.completed).length,
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-24 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">我的任务</h1>
      
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      <TodoForm onAdd={addTodo} />
      
      <TodoFilter
        currentFilter={filter}
        onFilterChange={setFilter}
        counts={counts}
      />

      <div className="space-y-4 mt-8">
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
          />
        ))}
        
        {filteredTodos.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            {filter === 'all' ? '暂无任务' : filter === 'active' ? '暂无进行中的任务' : '暂无已完成的任务'}
          </div>
        )}
      </div>
    </div>
  );
} 