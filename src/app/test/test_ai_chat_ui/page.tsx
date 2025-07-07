'use client';

import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ChatArea } from './components/layout/ChatArea';
import { useChatState } from './hooks/useChatState';
import { useResponsive } from './hooks/useResponsive';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
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

  // 在移动端自动折叠侧边栏
  useEffect(() => {
    if (isMobile && chatState.isSidebarExpanded) {
      toggleSidebar();
    }
  }, [isMobile]);

  return (
    <div className="flex h-screen bg-background">
      {/* 侧边栏 */}
      <div
        className={`
          fixed md:relative
          z-20 md:z-auto
          ${chatState.isSidebarExpanded ? 'animate-slide-in' : 'animate-slide-out'}
          ${chatState.isSidebarExpanded ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          h-screen
        `}
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
      {isMobile && chatState.isSidebarExpanded && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-10 animate-fade-in"
          onClick={toggleSidebar}
        />
      )}

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        <Header user={chatState.user}>
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