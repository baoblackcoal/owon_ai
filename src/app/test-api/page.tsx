'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

// 定义消息类型
interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export default function TestApiPage() {
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentResponse, setCurrentResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    // 自动滚动到最新消息
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, currentResponse]);

    // 清理超时定时器
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const resetState = () => {
        setIsLoading(false);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const clearConversation = () => {
        setMessages([]);
        setCurrentResponse('');
        setError(null);
    };

    const handleSubmit = async () => {
        if (!prompt.trim()) return;

        const userMessage: Message = {
            id: generateId(),
            role: 'user',
            content: prompt.trim(),
            timestamp: Date.now()
        };

        // 添加用户消息到历史
        setMessages(prev => [...prev, userMessage]);
        setPrompt(''); // 清空输入框
        setIsLoading(true);
        setError(null);
        setCurrentResponse('');

        // 设置30秒超时
        timeoutRef.current = setTimeout(() => {
            setError('请求超时，请重试');
            resetState();
        }, 30000);

        try {
            const response = await fetch('/api/dashscope', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    prompt: userMessage.content,
                    messages: messages // 发送消息历史
                }),
            });

            if (!response.ok) {
                throw new Error('API请求失败');
            }

            clearTimeout(timeoutRef.current); // 收到响应后清除超时

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('无法读取响应流');
            }

            let assistantResponseContent = '';

            // 处理流式响应
            try {
                console.log('开始处理流式响应');
                while (true) {
                    const { done, value } = await reader.read();
                    console.log('读取流数据:', { done, valueLength: value?.length });
                    if (done) {
                        console.log('流已结束');
                        break;
                    }

                    // 解码响应数据
                    const text = new TextDecoder().decode(value);
                    const lines = text.split('\n');

                    lines.forEach(line => {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(5));
                                if (data.error) {
                                    setError(data.error);
                                } else if (data.text) {
                                    assistantResponseContent += data.text;
                                    setCurrentResponse(assistantResponseContent);
                                }
                            } catch (e) {
                                console.error('解析响应数据失败:', e);
                            }
                        }
                    });
                }

                // 流结束后，将完整的AI回复添加到消息历史
                if (assistantResponseContent) {
                    const assistantMessage: Message = {
                        id: generateId(),
                        role: 'assistant',
                        content: assistantResponseContent,
                        timestamp: Date.now()
                    };
                    setMessages(prev => [...prev, assistantMessage]);
                    setCurrentResponse(''); // 清空当前响应显示
                }
            } catch (streamError) {
                console.error('流式响应处理失败:', streamError);
                setError('响应流处理失败');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '未知错误');
        } finally {
            resetState();
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">DashScope API 多轮对话测试</h1>
                <Button 
                    variant="outline" 
                    onClick={clearConversation}
                    disabled={isLoading}
                >
                    清空对话
                </Button>
            </div>

            {error && (
                <div className="text-red-500 mb-4 p-2 bg-red-50 rounded">
                    错误: {error}
                </div>
            )}

            {/* 对话历史显示区域 */}
            <Card className="p-4 mb-4 h-[500px] overflow-y-auto">
                <div className="space-y-4">
                    {messages.length === 0 && !currentResponse && (
                        <div className="text-gray-500 text-center py-8">
                            开始你的第一轮对话吧！
                        </div>
                    )}
                    
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-lg ${
                                    message.role === 'user'
                                        ? 'bg-blue-500 text-white ml-auto'
                                        : 'bg-gray-100 text-gray-900'
                                }`}
                            >
                                <div className="whitespace-pre-wrap">{message.content}</div>
                                <div className={`text-xs mt-1 opacity-70`}>
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* 显示当前AI响应（实时流式） */}
                    {currentResponse && (
                        <div className="flex justify-start">
                            <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-900">
                                <div className="whitespace-pre-wrap">{currentResponse}</div>
                                <div className="text-xs mt-1 opacity-70">
                                    正在回复...
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </Card>

            {/* 输入区域 */}
            <div className="flex gap-2">
                <Input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="输入你的问题..."
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
                    disabled={isLoading}
                    className="flex-1"
                />
                <Button 
                    onClick={handleSubmit}
                    disabled={isLoading || !prompt.trim()}
                >
                    {isLoading ? '发送中...' : '发送'}
                </Button>
            </div>

            {/* 对话统计信息 */}
            <div className="mt-2 text-sm text-gray-500 text-center">
                当前对话包含 {messages.length} 条消息
            </div>
        </div>
    );
} 