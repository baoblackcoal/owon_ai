import { ChatSession, Message } from '../../types/chat';
import { MessageBubble } from '../chat/MessageBubble';
import { InputArea } from '../chat/InputArea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect } from 'react';

interface ChatAreaProps {
  session?: ChatSession;
  onSendMessage: (content: string) => void;
  onUpdateFeedback: (messageId: string, feedback: { liked?: boolean, disliked?: boolean }) => void;
  onNewChat: () => void;
}

export function ChatArea({ session, onSendMessage, onUpdateFeedback, onNewChat }: ChatAreaProps) {
  // 当组件加载且没有会话时，自动创建新的聊天
  useEffect(() => {
    if (!session) {
      onNewChat();
    }
  }, [session, onNewChat]);

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium">正在创建新的对话...</h3>
          <p className="text-muted-foreground mt-2">请稍候</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 消息列表 - 使用flex-1使其填充剩余空间并可滚动 */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="max-w-5xl mx-auto space-y-4" id="ai_chat_message_list">
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