'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function TestApiPage() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const responseRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    // 自动滚动到最新响应
    useEffect(() => {
        if (responseRef.current) {
            responseRef.current.scrollTop = responseRef.current.scrollHeight;
        }
    }, [response]);

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

    const handleSubmit = async () => {
        if (!prompt.trim()) return;

        setIsLoading(true);
        setError(null);
        setResponse('');

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
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error('API请求失败');
            }

            clearTimeout(timeoutRef.current); // 收到响应后清除超时

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('无法读取响应流');
            }

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
                                    setResponse(prev => prev + data.text);
                                }
                            } catch (e) {
                                console.error('解析响应数据失败:', e);
                            }
                        }
                    });
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
            <h1 className="text-2xl font-bold mb-4">DashScope API 测试</h1>
            
            <div className="flex gap-2 mb-4">
                <Input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="输入你的问题..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    disabled={isLoading}
                    className="flex-1"
                />
                <Button 
                    onClick={handleSubmit}
                    disabled={isLoading || !prompt.trim()}
                >
                    {isLoading ? '请求中...' : '发送'}
                </Button>
            </div>

            {error && (
                <div className="text-red-500 mb-4 p-2 bg-red-50 rounded">
                    错误: {error}
                </div>
            )}

            <Card className="p-4">
                <div
                    ref={responseRef}
                    className="whitespace-pre-wrap h-[400px] overflow-y-auto"
                >
                    {response || '响应将在这里显示...'}
                </div>
            </Card>
        </div>
    );
} 