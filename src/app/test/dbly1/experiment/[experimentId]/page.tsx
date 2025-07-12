'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { mockCourses, generateMockAIResponse, saveChatMessage, getExperimentChatHistory } from '../../mockData';
import { ArrowLeft, Bot, User, Send, FileText, MessageSquare, Maximize2, Minimize2, RotateCcw, BookOpen, HelpCircle } from 'lucide-react';
import { Student, Experiment, ChatMessage } from '../../types';
import ReactMarkdown from 'react-markdown';

export default function ExperimentWorkspacePage() {
  const params = useParams();
  const experimentId = params.experimentId as string;
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 检查登录状态和获取实验信息
  useEffect(() => {
    const studentInfo = localStorage.getItem('dbly1-student');
    if (!studentInfo) {
      router.push('/test/dbly1/login');
      return;
    }

    try {
      const parsedStudent = JSON.parse(studentInfo);
      setStudent({
        ...parsedStudent,
        loginTime: new Date(parsedStudent.loginTime)
      });
    } catch (error) {
      console.error('Failed to parse student info:', error);
      router.push('/test/dbly1/login');
      return;
    }

    // 查找实验信息
    const foundExperiment = mockCourses
      .flatMap(course => course.experiments)
      .find(exp => exp.id === experimentId);

    if (!foundExperiment) {
      router.push('/test/dbly1');
      return;
    }

    setExperiment(foundExperiment);
  }, [experimentId, router]);

  // 加载聊天历史
  useEffect(() => {
    if (student && experiment) {
      const history = getExperimentChatHistory(experiment.id, student.id);
      setChatMessages(history);
    }
  }, [student, experiment]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !student || !experiment) return;

    setIsLoading(true);
    const userMessage = inputMessage.trim();
    setInputMessage('');

    // 添加用户消息
    const newUserMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
      studentId: student.id,
      experimentId: experiment.id
    };

    setChatMessages(prev => [...prev, newUserMessage]);

    try {
      // 模拟AI响应
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse = generateMockAIResponse(userMessage, experiment.id);
      
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        studentId: student.id,
        experimentId: experiment.id
      };

      setChatMessages(prev => [...prev, aiMessage]);
      
      // 保存消息到存储
      saveChatMessage({
        role: 'user',
        content: userMessage,
        studentId: student.id,
        experimentId: experiment.id
      });
      
      saveChatMessage({
        role: 'assistant',
        content: aiResponse,
        studentId: student.id,
        experimentId: experiment.id
      });

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setChatMessages([]);
  };

  if (!student || !experiment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">正在加载实验...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 flex-shrink-0 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/test/dbly1')}
              className="hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{experiment.name}</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {student.name} ({student.studentNumber})
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
              {experiment.difficulty === 'beginner' ? '初级' : 
               experiment.difficulty === 'intermediate' ? '中级' : '高级'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Manual Content */}
        <div className={`${isFullscreen ? 'w-full' : 'w-2/3'} border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col min-h-0`} id="manual-panel">
          <div className="border-b border-slate-200 dark:border-slate-700 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-slate-900 dark:text-white">实验手册</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-6 bg-white dark:bg-slate-800">
            <div className="max-w-none prose prose-sm dark:prose-invert prose-slate">
              <ReactMarkdown>{experiment.manual.content}</ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Interaction Panel */}
        {!isFullscreen && (
          <div className="w-1/3 flex flex-col h-[calc(100vh-56px)] bg-slate-50 dark:bg-slate-900" id="chat-faq-panel">
            <Tabs defaultValue="chat" className="flex-1 flex flex-col h-full">
              <TabsList className="grid w-full grid-cols-2 m-2 flex-shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <TabsTrigger value="chat" className="flex items-center space-x-2 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300">
                  <Bot className="h-4 w-4" />
                  <span>AI助教</span>
                </TabsTrigger>
                <TabsTrigger value="faq" className="flex items-center space-x-2 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300">
                  <HelpCircle className="h-4 w-4" />
                  <span>常见问题</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 relative mx-2 mb-2">
                {/* AI Chat */}
                <TabsContent value="chat" className="absolute inset-0" id="chat-content">
                  <Card className="h-full flex flex-col bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-sm">
                    <CardHeader className="pb-2 flex-shrink-0">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm text-slate-900 dark:text-white">AI助教</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearChat}
                          className="h-6 w-6 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      </div>
                      <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
                        基于当前实验内容的智能问答
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col p-0 ">
                      {/* Messages */}
                      <div className="flex-1 overflow-auto px-4">
                        <div className="space-y-3 py-2">
                          {chatMessages.length === 0 ? (
                            <div className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">
                              <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p>开始向AI助教提问吧！</p>
                              <p className="text-xs mt-1">我会根据当前实验内容为您答疑</p>
                              {experiment.aiChatData && experiment.aiChatData.length > 0 && (
                                <div className="mt-4 text-left">
                                  <p className="font-medium mb-2">示例问答：</p>
                                  {experiment.aiChatData.map((item, index) => (
                                    <div key={index} className="mb-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                                      <p className="text-slate-700 dark:text-slate-300 font-medium">{item.question}</p>
                                      <p className="text-slate-600 dark:text-slate-400 mt-1 text-xs">{item.answer}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            chatMessages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                                    message.role === 'user'
                                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                                      : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                                  }`}
                                >
                                  <div className="flex items-start space-x-2">
                                    {message.role === 'assistant' && (
                                      <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                                    )}
                                    <div className="whitespace-pre-wrap">
                                      {message.content}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                          {isLoading && (
                            <div className="flex justify-start">
                              <div className="bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-2 text-sm">
                                <div className="flex items-center space-x-2">
                                  <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                  <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      </div>

                      {/* Input */}
                      <div className="border-t border-slate-200 dark:border-slate-700 p-4 flex-shrink-0 bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex space-x-2">
                          <Input
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="输入您的问题..."
                            disabled={isLoading}
                            className="flex-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* FAQ */}
                <TabsContent value="faq" className="absolute inset-0" id="faq-content">
                  <Card className="h-full flex flex-col bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-sm">
                    <CardHeader className="pb-2 flex-shrink-0">
                      <CardTitle className="text-sm text-slate-900 dark:text-white">常见问题</CardTitle>
                      <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
                        实验相关的常见问题和解答
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-auto">
                      <div className="px-4">
                        <div className="space-y-3 py-2">
                          {experiment.faqData ? (
                            <div>
                              <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                                {experiment.faqData.title}
                              </h3>
                              <div className="space-y-4">
                                {experiment.faqData.questions.map((item, index) => (
                                  <div key={index} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                      {index + 1}. {item.question}
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                      {item.answer}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">
                              <HelpCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p>暂无常见问题</p>
                              <p className="text-xs mt-1">管理员会根据学生提问整理FAQ</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
} 