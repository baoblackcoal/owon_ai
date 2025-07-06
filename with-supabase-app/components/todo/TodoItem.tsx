import { useState } from 'react';
import { Todo } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, X, Check } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleEdit = () => {
    if (editedTitle.trim() !== '') {
      onEdit(todo.id, editedTitle);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTitle(todo.title);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-card rounded-lg shadow-sm group">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="h-5 w-5"
      />
      
      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="flex-1"
            autoFocus
          />
          <Button size="icon" variant="ghost" onClick={handleEdit}>
            <Check className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <span className={`flex-1 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
            {todo.title}
          </span>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onDelete(todo.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
} 