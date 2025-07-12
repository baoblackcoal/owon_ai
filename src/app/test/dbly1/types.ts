// 课程类型
export interface Course {
  id: string;
  name: string;
  description: string;
  category: 'digital' | 'analog' | 'basic';
  experiments: Experiment[];
}

// 实验类型
export interface Experiment {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // 小时
  equipment: string[];
  manual: ExperimentManual;
  aiChatData?: {
    question: string;
    answer: string;
  }[];
  faqData?: {
    title: string;
    questions: {
      question: string;
      answer: string;
    }[];
  };
}

// 实验手册
export interface ExperimentManual {
  id: string;
  title: string;
  content: string; // Markdown格式
  sections: ManualSection[];
}

// 手册章节
export interface ManualSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

// 学生信息
export interface Student {
  id: string;
  name: string;
  studentNumber: string;
  loginTime: Date;
}

// 聊天消息
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  studentId: string;
  experimentId: string;
}

// 对话会话
export interface ChatSession {
  id: string;
  studentId: string;
  experimentId: string;
  messages: ChatMessage[];
  startTime: Date;
  lastActivity: Date;
}

// FAQ项目
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  experimentId?: string;
  tags: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
}

// 学生提问记录
export interface StudentQuestion {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  experimentId: string;
  experimentName: string;
  question: string;
  aiResponse: string;
  timestamp: Date;
  category: string;
  tags: string[];
  isResolved: boolean;
}

// 实验文件
export interface ExperimentFile {
  id: string;
  experimentId: string;
  fileName: string;
  fileType: string;
  filePath: string;
  uploadDate: Date;
  size: string;
  course: string;
  experiment: string;
  isActive: boolean;
}

// AI响应配置
export interface AIConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  contextWindow: number;
}

// 管理员操作日志
export interface AdminLog {
  id: string;
  action: string;
  description: string;
  timestamp: Date;
  details: Record<string, any>;
}

// 统计数据
export interface Statistics {
  totalStudents: number;
  totalQuestions: number;
  totalExperiments: number;
  totalFAQs: number;
  activeSessionsToday: number;
  popularQuestions: StudentQuestion[];
  experimentUsage: Array<{
    experimentId: string;
    experimentName: string;
    usageCount: number;
  }>;
}

// 用户会话存储
export interface UserSession {
  student: Student;
  currentExperiment?: string;
  chatHistory: Record<string, ChatMessage[]>;
  preferences: {
    theme: 'light' | 'dark';
    language: 'zh' | 'en';
  };
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 搜索过滤器
export interface SearchFilter {
  category?: string;
  difficulty?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  keyword?: string;
}

// 分页参数
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
} 