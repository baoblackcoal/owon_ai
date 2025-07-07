'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const commonQuestions = [
    'ADS800A带宽是多少？',
    'ADS800A采样率是多少？',
    '你好'
];

export default function TestApiPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatWindowRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text: string) => {
        if (!text.trim() || isLoading) return;

        setIsLoading(true);
        setInput('');

        // 添加用户消息
        setMessages(prev => [...prev, { role: 'user', content: text }]);

        try {
            const response = await fetch('/api/dashscope', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: text }),
            });

            if (!response.ok) throw new Error('请求失败');

            const reader = response.body?.getReader();
            if (!reader) throw new Error('无法读取响应');

            // 添加AI消息占位
            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = new TextDecoder().decode(value);
                const lines = text.split('\n');

                lines.forEach(line => {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(5));
                            if (data.text) {
                                setMessages(prev => {
                                    const newMessages = [...prev];
                                    const lastMessage = newMessages[newMessages.length - 1];
                                    if (lastMessage.role === 'assistant') {
                                        lastMessage.content += data.text;
                                    }
                                    return newMessages;
                                });
                            }
                            if (data.sessionId) {
                                document.cookie = `dashscope_session_id=${data.sessionId}; path=/`;
                            }
                        } catch (e) {
                            console.error('解析SSE数据失败:', e);
                        }
                    }
                });
            }
        } catch (error) {
            console.error('发送消息失败:', error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: '抱歉，发生了错误，请稍后重试。' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([]);
        document.cookie = 'dashscope_session_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">DashScope API 多轮对话测试</h1>
                <Button 
                    variant="outline" 
                    onClick={clearChat}
                    className="text-gray-500"
                >
                    清空对话
                </Button>
            </div>

            {/* 聊天窗口 */}
            <Card className="mb-4 p-4">
                <div 
                    ref={chatWindowRef}
                    className="h-[420px] overflow-y-auto space-y-4"
                >
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] p-3 rounded-lg ${
                                    message.role === 'user'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-800'
                                }`}
                            >
                                {message.content || '...'}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* 输入区域 */}
            <div className="flex gap-2 mb-4">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend(input);
                        }
                    }}
                    placeholder="输入你的问题..."
                    disabled={isLoading}
                    className="flex-1"
                />
                <Button 
                    onClick={() => handleSend(input)}
                    disabled={isLoading || !input.trim()}
                >
                    发送
                </Button>
            </div>

            {/* 常用问题 */}
            <div className="flex gap-2 flex-wrap">
                {commonQuestions.map((question, index) => (
                    <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-gray-200"
                        onClick={() => handleSend(question)}
                    >
                        {question}
                    </Badge>
                ))}
            </div>
        </div>
    );
}
