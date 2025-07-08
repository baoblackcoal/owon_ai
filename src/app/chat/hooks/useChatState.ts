import { useState, useEffect } from 'react';
import { ChatSession, Message, User, MessageFeedback } from '../types/chat';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './useAuth';

const STORAGE_KEY = 'owon_ai_chat_state';

interface ChatState {
  user: User;
  sessions: ChatSession[];
  currentSession?: ChatSession;
  isSidebarExpanded: boolean;
}

const initialState: ChatState = {
  user: {
    id: '1',
    name: '游客',
    email: 'guest@example.com',
    role: 'guest'
  },
  sessions: [],
  isSidebarExpanded: true,
};

export function useChatState() {
  const { user: supabaseUser, isAuthenticated } = useAuth();
  const [chatState, setChatState] = useState<ChatState>(initialState);

  // 根据Supabase用户状态更新聊天状态中的用户信息
  useEffect(() => {
    if (supabaseUser) {
      setChatState(prev => ({
        ...prev,
        user: {
          id: supabaseUser.id,
          name: supabaseUser.email?.split('@')[0] || '用户',
          email: supabaseUser.email || '',
          role: 'registered'
        }
      }));
    } else {
      setChatState(prev => ({
        ...prev,
        user: {
          id: '1',
          name: '游客',
          email: 'guest@example.com',
          role: 'guest'
        }
      }));
    }
  }, [supabaseUser, isAuthenticated]);

  // 从 localStorage 读取状态
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      setChatState({
        ...parsedState,
        currentSession: parsedState.sessions[0],
      });
    }
  }, []);

  // 保存状态到 localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatState));
  }, [chatState]);

  // 切换侧边栏展开状态
  const toggleSidebar = () => {
    setChatState(prev => ({
      ...prev,
      isSidebarExpanded: !prev.isSidebarExpanded,
    }));
  };

  // 选择聊天会话
  const selectSession = (sessionId: string) => {
    const session = chatState.sessions.find((s) => s.id === sessionId);
    if (session) {
      setChatState((prev) => ({
        ...prev,
        currentSession: session,
      }));
    }
  };

  // 创建新的聊天会话
  const createNewSession = () => {
    const newSession: ChatSession = {
      id: uuidv4(),
      title: '新对话',
      lastMessageTime: new Date().toISOString(),
      messages: [],
    };

    setChatState((prev) => ({
      ...prev,
      sessions: [newSession, ...prev.sessions],
      currentSession: newSession,
    }));
  };

  // 发送新消息
  const sendMessage = async (content: string) => {
    if (!chatState.currentSession) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    const assistantMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    };

    const updatedSession: ChatSession = {
      ...chatState.currentSession,
      messages: [...chatState.currentSession.messages, userMessage, assistantMessage],
      lastMessageTime: new Date().toISOString(),
    };

    if (chatState.currentSession.messages.length === 0) {
      updatedSession.title = content.slice(0, 20) + (content.length > 20 ? '...' : '');
    }

    setChatState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) =>
        s.id === updatedSession.id ? updatedSession : s
      ),
      currentSession: updatedSession,
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: content }),
      });

      if (!response.ok) throw new Error('API request failed');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Failed to get stream reader');

      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data:')) {
            try {
              const data = JSON.parse(line.slice(5).trim());
              if (data.text) {
                accumulatedContent += data.text;
                setChatState((prev) => ({
                  ...prev,
                  sessions: prev.sessions.map((s) =>
                    s.id === updatedSession.id
                      ? {
                          ...s,
                          messages: s.messages.map((m: Message) =>
                            m.id === assistantMessage.id
                              ? { ...m, content: accumulatedContent }
                              : m
                          ),
                        }
                      : s
                  ),
                  currentSession:
                    prev.currentSession?.id === updatedSession.id
                      ? {
                          ...prev.currentSession,
                          messages: prev.currentSession.messages.map((m: Message) =>
                            m.id === assistantMessage.id
                              ? { ...m, content: accumulatedContent }
                              : m
                          ),
                        }
                      : prev.currentSession,
                }));
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setChatState((prev) => ({
        ...prev,
        sessions: prev.sessions.map((s) =>
          s.id === updatedSession.id
            ? {
                ...s,
                messages: s.messages.map((m: Message) =>
                  m.id === assistantMessage.id
                    ? { ...m, content: '抱歉，发生了错误，请稍后重试。' }
                    : m
                ),
              }
            : s
        ),
      }));
    }
  };

  const updateMessageFeedback = (messageId: string, feedback: MessageFeedback) => {
    if (!chatState.currentSession) return;

    setChatState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) =>
        s.id === prev.currentSession?.id
          ? {
              ...s,
              messages: s.messages.map((msg: Message) =>
                msg.id === messageId
                  ? { ...msg, feedback: { ...msg.feedback, ...feedback } }
                  : msg
              ),
            }
          : s
      ),
    }));
  };

  return {
    chatState,
    isAuthenticated,
    toggleSidebar,
    selectSession,
    createNewSession,
    sendMessage,
    updateMessageFeedback,
  };
} 