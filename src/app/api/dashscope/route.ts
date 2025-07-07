import { NextRequest } from 'next/server';
import { DashScopeService } from '@/lib/dashscope/service';
import { Message } from '@/lib/dashscope/types';

// 环境变量类型检查
const getEnvVar = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`环境变量 ${name} 未设置`);
    }
    return value;
};

export async function POST(request: NextRequest) {
    try {
        const apiKey = getEnvVar('DASHSCOPE_API_KEY');
        const appId = getEnvVar('DASHSCOPE_APP_ID');

        // 获取请求数据
        const data = await request.json();
        const { prompt, messages = [] } = data;

        if (!prompt) {
            return new Response(JSON.stringify({ error: '缺少必要的 prompt 参数' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 验证消息历史格式
        const validMessages: Message[] = Array.isArray(messages) ? 
            messages.filter((msg: any) => 
                msg && typeof msg.role === 'string' && typeof msg.content === 'string'
            ) : [];

        // 创建响应流
        const encoder = new TextEncoder();
        const stream = new TransformStream();
        const writer = stream.writable.getWriter();

        // 初始化 DashScope 服务
        const service = DashScopeService.getInstance({ apiKey, appId });

        // 处理流式响应
        try {
            await service.askQuestion(prompt, {
                onStream: async (text) => {
                    try {
                        await writer.write(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
                    } catch (writeError) {
                        console.error('写入流数据失败:', writeError);
                    }
                },
                onError: async (error) => {
                    try {
                        await writer.write(
                            encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`)
                        );
                    } catch (writeError) {
                        console.error('写入错误信息失败:', writeError);
                    }
                    try {
                        await writer.close();
                    } catch (closeError) {
                        console.error('关闭写入器失败:', closeError);
                    }
                },
                onComplete: async () => {
                    console.log('[API] onComplete 回调被调用');
                    try {
                        await writer.close();
                        console.log('[API] 写入器已关闭');
                    } catch (closeError) {
                        console.error('关闭写入器失败:', closeError);
                    }
                }
            }, validMessages);
        } catch (serviceError) {
            console.error('DashScope服务错误:', serviceError);
            try {
                await writer.write(
                    encoder.encode(`data: ${JSON.stringify({ error: '服务调用失败' })}\n\n`)
                );
                await writer.close();
            } catch (writeError) {
                console.error('写入错误信息失败:', writeError);
            }
        }

        // 返回流式响应
        return new Response(stream.readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            }
        });

    } catch (error) {
        console.error('API错误:', error);
        return new Response(
            JSON.stringify({ error: '服务器内部错误' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
} 