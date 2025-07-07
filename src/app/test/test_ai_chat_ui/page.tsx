'use client';

import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ChatArea } from './components/layout/ChatArea';
import { useChatState } from './hooks/useChatState';
import { useResponsive } from './hooks/useResponsive';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import './styles/animations.css';

export default function ChatUI() {
  const {
    chatState,
    toggleSidebar,
    selectSession,
    createNewSession,
    sendMessage,
    updateMessageFeedback,
  } = useChatState();

  const { isMobile } = useResponsive();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isMobile && chatState.isSidebarExpanded) {
      toggleSidebar();
    }
  }, [isMobile]);

  return (
    <div className="flex h-screen bg-background">
      {/* 侧边栏 */}
      <div
        className={cn(
          'fixed md:relative z-20 md:z-auto h-screen',
          mounted && chatState.isSidebarExpanded && 'animate-slide-in',
          mounted && !chatState.isSidebarExpanded && 'animate-slide-out',
          chatState.isSidebarExpanded ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
        id="ai_chat_sidebar"
      >
        <Sidebar
          sessions={chatState.sessions}
          isExpanded={chatState.isSidebarExpanded}
          onToggle={toggleSidebar}
          onNewChat={createNewSession}
          onSelectSession={selectSession}
        />
      </div>

      {/* 遮罩层 */}
      {mounted && isMobile && chatState.isSidebarExpanded && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-10 animate-fade-in"
          onClick={toggleSidebar}
        />
      )}

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        <Header 
          user={chatState.user}
          title={chatState.currentSession?.title}
          lastMessageTime={chatState.currentSession?.lastMessageTime}
        >
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </Header>
        <ChatArea
          session={chatState.currentSession}
          onSendMessage={sendMessage}
          onUpdateFeedback={(messageId, liked) =>
            updateMessageFeedback(messageId, { liked, disliked: !liked })
          }
        />
      </div>
    </div>
  );
} 