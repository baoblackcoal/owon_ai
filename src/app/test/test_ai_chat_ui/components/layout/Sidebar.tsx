'use client';

import { ChatSession } from '../../types/chat';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NewChatButton } from '../sidebar/NewChatButton';
import { ChatHistoryItem } from '../sidebar/ChatHistoryItem';
import { RankingButton } from '../sidebar/RankingButton';

interface SidebarProps {
  sessions: ChatSession[];
  isExpanded: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
}

export function Sidebar({
  sessions,
  isExpanded,
  onToggle,
  onNewChat,
  onSelectSession,
}: SidebarProps) {
  return (
    <div
      className={cn(
        'bg-card border-r transition-all duration-300 flex flex-col h-screen',
        isExpanded ? 'w-[280px]' : 'w-[70px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center space-x-4 p-2" id="ai_chat_logo">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold">O</span>
        </div>
        {isExpanded && <span className="text-lg font-bold">OWON AI 助手</span>}
      </div>
      
      {/* 折叠按钮 */}
      <div className="p-2">
        <Button
          variant="ghost"
          className="w-full justify-center"
          onClick={onToggle}
        >
          {isExpanded ? (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="ml-2">收缩侧边栏</span>
            </>
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      

      {/* 新建聊天按钮 */}
      <NewChatButton isExpanded={isExpanded} onClick={onNewChat} />

      {/* 历史对话列表 */}
      <div className="flex-1 overflow-y-auto p-2">
        {isExpanded && <div className="text-sm font-medium mb-2">历史对话</div>}
        <div className="space-y-2">
          {sessions.map((session) => (
            <ChatHistoryItem
              key={session.id}
              session={session}
              isExpanded={isExpanded}
              onClick={() => onSelectSession(session.id)}
            />
          ))}
        </div>
      </div>

      {/* 问答排行榜入口 */}
      <RankingButton
        isExpanded={isExpanded}
        onClick={() => console.log('打开排行榜')}
      />
    </div>
  );
} 