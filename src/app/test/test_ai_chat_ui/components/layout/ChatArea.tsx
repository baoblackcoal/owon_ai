import { ChatSession, Message } from '../../types/chat';
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
    <div className="flex flex-col h-full">
      {/* 消息列表 - 使用flex-1使其填充剩余空间并可滚动 */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="max-w-5xl mx-auto space-y-4">
            {session.messages.map((message: Message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onFeedback={onUpdateFeedback}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* 输入区域 - 使用flex-none使其不参与flex伸缩 */}
      <div className="flex-none">
        <InputArea onSend={onSendMessage} />
      </div>
    </div>
  );
} 