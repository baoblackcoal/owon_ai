import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { Transform } from 'stream';

// 配置
const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY;
const DASHSCOPE_APP_ID = process.env.DASHSCOPE_APP_ID;
const PIPELINE_IDS = ['he9rcpebc3', 'utmhvnxgey'];

// 类型定义
interface DashScopeRequest {
    input: {
        prompt: string;
        session_id?: string;
    };
    parameters: {
        incremental_output?: string;
        has_thoughts?: string;
        rag_options?: {
            pipeline_ids: string[];
        };
    };
    debug: Record<string, unknown>;
}

interface DashScopeResponse {
    output?: {
        text?: string;
        session_id?: string;
    };
    request_id?: string;
    message?: string;
}

// SSE 转换器
class SSETransformer extends Transform {
    private buffer: string = '';
    private sessionId: string = '';

    _transform(chunk: Buffer, encoding: string, callback: Function): void {
        this.buffer += chunk.toString();
        
        const events = this.buffer.split(/\n\n/);
        this.buffer = events.pop() || '';
        
        events.forEach(eventData => {
            const lines = eventData.split('\n');
            let textContent = '';
            
            lines.forEach(line => {
                if (line.startsWith('data:')) {
                    try {
                        const jsonData = JSON.parse(line.slice(5).trim()) as DashScopeResponse;
                        if (jsonData.output?.text) {
                            textContent = jsonData.output.text;
                        }
                        if (jsonData.output?.session_id) {
                            this.sessionId = jsonData.output.session_id;
                        }
                    } catch(e) {
                        console.error('JSON解析错误:', e);
                    }
                }
            });

            if (textContent) {
                this.push(`data: ${JSON.stringify({ text: textContent, sessionId: this.sessionId })}\n\n`);
            }
        });
        
        callback();
    }

    _flush(callback: Function): void {
        if (this.buffer) {
            this.push(`data: ${JSON.stringify({ text: this.buffer, sessionId: this.sessionId })}\n\n`);
        }
        callback();
    }
}

export async function POST(request: NextRequest) {
    if (!DASHSCOPE_API_KEY || !DASHSCOPE_APP_ID) {
        return NextResponse.json(
            { error: '请配置 DASHSCOPE_API_KEY 和 DASHSCOPE_APP_ID 环境变量' },
            { status: 500 }
        );
    }

    try {
        const body = await request.json();
        const { prompt } = body;
        const cookieStore = await cookies();
        const sessionId = cookieStore.get('dashscope_session_id')?.value;

        const url = `https://dashscope.aliyuncs.com/api/v1/apps/${DASHSCOPE_APP_ID}/completion`;
        
        const data: DashScopeRequest = {
            input: {
                prompt,
                ...(sessionId && { session_id: sessionId })
            },
            parameters: {
                'incremental_output': 'true',
                'has_thoughts': 'true',
                rag_options: {
                    pipeline_ids: PIPELINE_IDS
                }
            },
            debug: {}
        };

        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
                'Content-Type': 'application/json',
                'X-DashScope-SSE': 'enable'
            },
            responseType: 'stream'
        });

        // 创建 SSE 响应
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                const sseTransformer = new SSETransformer();

                response.data.pipe(sseTransformer);

                sseTransformer.on('data', (data: Buffer) => {
                    controller.enqueue(encoder.encode(data.toString()));
                });

                sseTransformer.on('end', () => {
                    controller.close();
                });

                sseTransformer.on('error', (err: Error) => {
                    console.error('SSE错误:', err);
                    controller.error(err);
                });
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            }
        });

    } catch (error: any) {
        console.error('API错误:', error);
        return NextResponse.json(
            { error: error.message || '请求失败' },
            { status: error.response?.status || 500 }
        );
    }
}
