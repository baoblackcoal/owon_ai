'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockCourses, generateMockAIResponse, Experiment } from '../../mockData';
import { ArrowLeft, Bot, User, Send, FileText, MessageSquare, Maximize2, Minimize2, RotateCcw, BookOpen } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ExperimentWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const experimentId = params.experimentId as string;
  
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [showChat, setShowChat] = useState(false); // 用于移动端切换
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const foundExperiment = mockCourses
      .flatMap(course => course.experiments)
      .find(exp => exp.id === experimentId);
    
    if (foundExperiment) {
      setExperiment(foundExperiment);
      
      // 从本地存储加载历史对话
      const savedMessages = localStorage.getItem(`chat-history-${experimentId}`);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } else {
        // 添加欢迎消息
        const welcomeMessage: ChatMessage = {
          id: 'welcome',
          role: 'assistant',
          content: `你好！我是AI助教，很高兴为你辅导《${foundExperiment.name}》实验。\n\n在实验过程中，如果你遇到任何问题，比如：\n• 不清楚某个操作步骤\n• 测量结果与预期不符\n• 仪器使用方法不明确\n• 对实验原理有疑问\n\n都可以随时向我提问。我会结合当前实验的具体内容为你提供针对性的解答。\n\n现在开始实验吧！`,
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }
    }
  }, [experimentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // 保存对话历史到本地存储
    if (messages.length > 0) {
      localStorage.setItem(`chat-history-${experimentId}`, JSON.stringify(messages));
    }
  }, [messages, experimentId]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !experiment) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // 模拟AI响应延迟
    setTimeout(() => {
      const aiResponse = generateMockAIResponse(userMessage.content, experiment);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem(`chat-history-${experimentId}`);
  };

  const handleBack = () => {
    router.push('/test/test_dbly');
  };

  if (!experiment) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <p className="text-gray-500">实验不存在</p>
          <Button onClick={handleBack} className="mt-4">
            返回主页
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回主页
          </Button>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <h1 className="text-lg font-semibold">{experiment.name}</h1>
            <Badge variant="outline">{experiment.difficulty === 'beginner' ? '入门' : experiment.difficulty === 'intermediate' ? '中级' : '高级'}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowChat(!showChat)}
            className="md:hidden"
          >
            <MessageSquare className="w-4 h-4" />
            {showChat ? '查看讲义' : 'AI助教'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsMaximized(!isMaximized)}
            className="hidden md:flex"
          >
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            {isMaximized ? '还原' : '最大化'}
          </Button>
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：实验讲义 */}
        <div className={`${isMaximized ? 'hidden' : showChat ? 'hidden md:block md:w-2/3' : 'w-full md:w-2/3'} border-r bg-white flex flex-col`}>
          <div className="border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-500" />
              <h2 className="font-medium">实验讲义</h2>
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-none">
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">{experiment.manual.title}</h1>
                <p className="text-gray-600">最后更新：{experiment.manual.lastUpdated}</p>
              </div>

              {/* 实验讲义内容 */}
              <div className="space-y-8">
                {experiment.manual.sections.map((section, index) => (
                  <div key={section.id} className="border-l-4 border-blue-200 pl-4">
                    <h2 className="text-xl font-semibold mb-3 text-gray-800">{section.title}</h2>
                    <div className="prose prose-sm max-w-none">
                      {section.content.split('\n').map((paragraph, idx) => (
                        <div key={idx} className="mb-3">
                          {paragraph.startsWith('•') || paragraph.match(/^\d+\./) ? (
                            <div className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1 font-medium">
                                {paragraph.match(/^\d+\./)?.[0] || '•'}
                              </span>
                              <span className="text-gray-700">
                                {paragraph.replace(/^(\d+\.\s*|•\s*)/, '')}
                              </span>
                            </div>
                          ) : paragraph.trim() ? (
                            <p className="text-gray-700 leading-relaxed">{paragraph}</p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 器材列表 */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3">实验器材</h3>
                <div className="grid grid-cols-2 gap-2">
                  {experiment.equipment.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* 右侧：AI问答聊天 */}
        <div className={`${isMaximized ? 'w-full' : showChat ? 'w-full md:w-1/3' : 'hidden md:block md:w-1/3'} bg-white flex flex-col`}>
          <div className="border-b px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-green-500" />
                <h2 className="font-medium">AI助教</h2>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500">在线</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleClearChat}>
                <RotateCcw className="w-4 h-4 mr-1" />
                清空
              </Button>
            </div>
          </div>

          {/* 聊天消息区 */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.role === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                      <span className="text-xs opacity-75">
                        {message.role === 'user' ? '你' : 'AI助教'}
                      </span>
                      <span className="text-xs opacity-75">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      <span className="text-xs text-gray-500">AI助教正在思考...</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          {/* 输入区 */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="向AI助教提问..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              按 Enter 发送，Shift+Enter 换行
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 