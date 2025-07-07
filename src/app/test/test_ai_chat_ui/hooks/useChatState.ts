import { useState, useEffect } from 'react';
import { ChatSession, Message, User, MessageFeedback } from '../types/chat';
import { v4 as uuidv4 } from 'uuid';

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
  const [chatState, setChatState] = useState<ChatState>(() => {
    // 从 localStorage 读取状态
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        return {
          ...parsedState,
          currentSession: parsedState.sessions[0],
        };
      }
    }
    return initialState;
  });

  // 保存状态到 localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatState));
    }
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

    // 创建一个空的助手消息，用于流式更新
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

    // 如果是第一条消息，更新会话标题
    if (chatState.currentSession.messages.length === 0) {
      updatedSession.title = content.slice(0, 20) + (content.length > 20 ? '...' : '');
    }

    // 更新状态以显示用户消息和空的助手消息
    setChatState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) =>
        s.id === updatedSession.id ? updatedSession : s
      ),
      currentSession: updatedSession,
    }));

    try {
      // 发送请求到 API
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
                // 更新助手消息的内容
                setChatState((prev) => ({
                  ...prev,
                  sessions: prev.sessions.map((s) =>
                    s.id === updatedSession.id
                      ? {
                          ...s,
                          messages: s.messages.map((m) =>
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
                          messages: prev.currentSession.messages.map((m) =>
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
      // 更新助手消息为错误状态
      setChatState((prev) => ({
        ...prev,
        sessions: prev.sessions.map((s) =>
          s.id === updatedSession.id
            ? {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === assistantMessage.id
                    ? { ...m, content: '抱歉，发生了错误，请稍后重试。' }
                    : m
                ),
              }
            : s
        ),
        currentSession:
          prev.currentSession?.id === updatedSession.id
            ? {
                ...prev.currentSession,
                messages: prev.currentSession.messages.map((m) =>
                  m.id === assistantMessage.id
                    ? { ...m, content: '抱歉，发生了错误，请稍后重试。' }
                    : m
                ),
              }
            : prev.currentSession,
      }));
    }
  };

  // 更新消息反馈
  const updateMessageFeedback = (messageId: string, feedback: MessageFeedback) => {
    if (!chatState.currentSession) return;

    const updatedSession: ChatSession = {
      ...chatState.currentSession,
      messages: chatState.currentSession.messages.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              feedback: {
                ...msg.feedback,
                ...feedback,
              },
            }
          : msg
      ),
    };

    setChatState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) =>
        s.id === updatedSession.id ? updatedSession : s
      ),
      currentSession: updatedSession,
    }));
  };

  return {
    chatState,
    toggleSidebar,
    selectSession,
    createNewSession,
    sendMessage,
    updateMessageFeedback,
  };
} 