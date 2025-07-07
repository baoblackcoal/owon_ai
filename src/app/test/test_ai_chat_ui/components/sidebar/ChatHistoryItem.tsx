import { ChatSession } from '../../types/chat';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface ChatHistoryItemProps {
  session: ChatSession;
  isExpanded: boolean;
  onClick: () => void;
}

export function ChatHistoryItem({ session, isExpanded, onClick }: ChatHistoryItemProps) {
  const formattedTime = formatDistanceToNow(new Date(session.lastMessageTime), {
    addSuffix: true,
    locale: zhCN,
  });

  return (
    <div
      className={cn(
        'rounded-lg cursor-pointer transition-colors',
        session.isSelected
          ? 'bg-primary/10 hover:bg-primary/20'
          : 'hover:bg-muted',
        isExpanded ? 'p-3' : 'p-2 flex justify-center'
      )}
      onClick={onClick}
    >
      {isExpanded ? (
        <>
          <div className="font-medium truncate">{session.title}</div>
          <div className="text-sm text-muted-foreground truncate">
            {session.preview}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {formattedTime}
          </div>
        </>
      ) : (
        <div
          className={cn(
            'w-2 h-2 rounded-full',
            session.isSelected ? 'bg-primary' : 'bg-muted-foreground'
          )}
        />
      )}
    </div>
  );
} 