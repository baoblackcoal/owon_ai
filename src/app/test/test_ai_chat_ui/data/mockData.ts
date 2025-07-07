import { ChatState, Message, ChatSession, User } from '../types/chat';

// 模拟用户数据
export const mockUser: User = {
  id: '1',
  name: '测试用户',
  avatar: undefined,
};

// 模拟消息数据
const mockMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: '我的示波器显示的波形有噪声，应该如何处理？',
    timestamp: new Date('2024-01-15T14:30:00'),
  },
  {
    id: '2',
    role: 'assistant',
    content: `关于示波器波形噪声问题，可以从以下几个方面来处理：

1. 检查探头连接
• 确保探头接地良好
• 检查探头补偿是否正确

2. 调整采样设置
• 适当增加采样率
• 调整触发电平`,
    timestamp: new Date('2024-01-15T14:30:30'),
    feedback: {
      liked: true,
      timestamp: new Date('2024-01-15T14:31:00'),
    },
  },
  {
    id: '3',
    role: 'user',
    content: '还有其他减少噪声的方法吗？',
    timestamp: new Date('2024-01-15T14:31:30'),
  },
  {
    id: '4',
    role: 'assistant',
    content: `当然还有其他方法：

3. 环境因素控制
• 远离电磁干扰源（如手机、电机等）
• 确保良好的电源质量
• 使用屏蔽电缆和接地措施`,
    timestamp: new Date('2024-01-15T14:32:00'),
  },
];

// 模拟聊天会话数据
export const mockSessions: ChatSession[] = [
  {
    id: '1',
    title: '示波器波形噪声问题',
    preview: '我的示波器显示的波形有噪声...',
    lastMessageTime: new Date('2024-01-15T14:32:00'),
    messages: mockMessages,
    isSelected: true,
  },
  {
    id: '2',
    title: 'SDS1104X-E 触发设置',
    preview: 'OWON SDS1104X-E 如何设置...',
    lastMessageTime: new Date('2024-01-14T09:15:00'),
    messages: [],
  },
  {
    id: '3',
    title: '电源模块故障诊断',
    preview: '我的电源模块显示错误代码...',
    lastMessageTime: new Date('2024-01-12T10:30:00'),
    messages: [],
  },
];

// 初始聊天状态
export const initialChatState: ChatState = {
  sessions: mockSessions,
  currentSession: mockSessions[0],
  user: mockUser,
  isSidebarExpanded: true,
}; 