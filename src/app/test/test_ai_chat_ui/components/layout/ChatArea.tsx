import { ChatSession } from '../../types/chat';
import { MessageBubble } from '../chat/MessageBubble';
import { InputArea } from '../chat/InputArea';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatAreaProps {
  session?: ChatSession;
  onSendMessage: (content: string) => void;
  onUpdateFeedback: (messageId: string, liked: boolean) => void;
}

export function ChatArea({ session, onSendMessage, onUpdateFeedback }: ChatAreaProps) {
  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium">欢迎使用 OWON AI 助手</h3>
          <p className="text-muted-foreground mt-2">选择一个对话或开始新的对话</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* 对话标题 */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium">{session.title}</h2>
        <p className="text-sm text-muted-foreground">
          {new Date(session.lastMessageTime).toLocaleString()} · 可继续对话
        </p>
      </div>

      {/* 消息列表 */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-5xl mx-auto space-y-4">
          {session.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onFeedback={onUpdateFeedback}
            />
          ))}
        </div>
      </ScrollArea>

      {/* 输入区域 */}
      <InputArea onSend={onSendMessage} />
    </div>
  );
} 