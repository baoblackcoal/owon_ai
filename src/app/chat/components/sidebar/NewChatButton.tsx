import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface NewChatButtonProps {
  isExpanded: boolean;
  onClick: () => void;
}

export function NewChatButton({ isExpanded, onClick }: NewChatButtonProps) {
  return (
    <div className="p-2">
      <Button
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        onClick={onClick}
      >
        <Plus className="h-4 w-4" />
        {isExpanded && <span className="ml-2">新建聊天</span>}
      </Button>
    </div>
  );
} 