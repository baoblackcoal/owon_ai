export interface User {
  id: string;
  name: string;
  email: string;
  role: 'guest' | 'registered';
}

export interface MessageFeedback {
  liked?: boolean;
  disliked?: boolean;
  reported?: boolean;
  comment?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  feedback?: MessageFeedback;
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessageTime: string;
  messages: Message[];
} 