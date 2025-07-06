import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TodoFormProps {
  onAdd: (title: string) => void;
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="添加新任务..."
        className="flex-1"
      />
      <Button type="submit" disabled={!title.trim()}>
        <Plus className="h-4 w-4 mr-2" />
        添加
      </Button>
    </form>
  );
} 