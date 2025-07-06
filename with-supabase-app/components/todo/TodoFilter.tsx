import { TodoFilter as FilterType } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

export function TodoFilter({ currentFilter, onFilterChange, counts }: TodoFilterProps) {
  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: `全部 (${counts.all})` },
    { value: 'active', label: `进行中 (${counts.active})` },
    { value: 'completed', label: `已完成 (${counts.completed})` },
  ];

  return (
    <div className="flex justify-center gap-2 mb-6">
      {filters.map(({ value, label }) => (
        <Button
          key={value}
          variant={currentFilter === value ? 'default' : 'outline'}
          onClick={() => onFilterChange(value)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
} 