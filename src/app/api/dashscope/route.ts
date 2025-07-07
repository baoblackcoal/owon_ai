import { NextRequest } from 'next/server';
import { DashScopeService } from '@/lib/dashscope/service';

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
        const { prompt } = data;

        if (!prompt) {
            return new Response(JSON.stringify({ error: '缺少必要的 prompt 参数' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 创建响应流
        const encoder = new TextEncoder();
        const stream = new TransformStream();
        const writer = stream.writable.getWriter();

        // 初始化 DashScope 服务
        const service = DashScopeService.getInstance({ apiKey, appId });

        // 处理流式响应
        service.askQuestion(prompt, {
            onStream: async (text) => {
                await writer.write(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            },
            onError: async (error) => {
                await writer.write(
                    encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`)
                );
                await writer.close();
            },
            onComplete: async () => {
                await writer.close();
            }
        });

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