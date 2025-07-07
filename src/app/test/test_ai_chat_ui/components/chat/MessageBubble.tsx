import { Message } from '../../types/chat';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: Message;
  onFeedback: (messageId: string, feedback: { liked?: boolean; disliked?: boolean }) => void;
}

export function MessageBubble({ message, onFeedback }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex w-full mb-4 animate-fade-in',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <Card
        className={cn(
          'max-w-[85%] overflow-hidden',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        <div className="p-4">
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
          {!isUser && (
            <div className="flex items-center space-x-2 mt-4 border-t pt-4">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'hover:bg-primary/10',
                  message.feedback?.liked && 'text-primary bg-primary/10'
                )}
                onClick={() => onFeedback(message.id, { liked: !message.feedback?.liked })}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                有帮助
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'hover:bg-destructive/10',
                  message.feedback?.disliked && 'text-destructive bg-destructive/10'
                )}
                onClick={() => onFeedback(message.id, { disliked: !message.feedback?.disliked })}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                需改进
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 