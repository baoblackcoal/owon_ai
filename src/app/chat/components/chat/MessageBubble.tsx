import { Message } from '../../types/chat';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

interface MessageBubbleProps {
  message: Message;
  onFeedback: (messageId: string, feedback: { liked?: boolean; disliked?: boolean }) => void;
}

export function MessageBubble({ message, onFeedback }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'flex w-full animate-fade-in',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <Card
        className={cn(
          'max-w-[85%] overflow-hidden',
          isUser ? 'bg-muted pt-1 pb-1' : 'bg-background',
          !isUser && 'border-0 shadow-none'
        )}
      >
        <div className="pt-2 pb-1 px-4">
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
          <div className="flex items-center mt-2 text-primary/50 gap-2">
           
            {!isUser && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-primary/10"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
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
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
} 