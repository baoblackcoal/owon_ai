import axios from 'axios';
import { Transform } from 'stream';
import {
    DashScopeConfig,
    DashScopeRequest,
    DashScopeResponse,
    DashScopeError,
    DashScopeServiceOptions
} from './types';

class SSETransformer extends Transform {
    private buffer: string = '';

    constructor(private onData: (text: string) => void) {
        super();
    }

    _transform(chunk: Buffer, encoding: string, callback: (error?: Error | null, data?: any) => void): void {
        this.buffer += chunk.toString();
        
        // 按SSE事件分割（两个换行符）
        const events = this.buffer.split(/\n\n/);
        this.buffer = events.pop() || ''; // 保留未完成部分
        
        events.forEach(eventData => {
            const lines = eventData.split('\n');
            let textContent = '';
            
            // 解析事件内容
            lines.forEach(line => {
                if (line.startsWith('data:')) {
                    try {
                        const jsonData = JSON.parse(line.slice(5).trim()) as DashScopeResponse;
                        if (jsonData.output?.text) {
                            textContent = jsonData.output.text;
                        }
                    } catch(e) {
                        if (e instanceof Error) {
                            console.error('JSON解析错误:', e.message);
                        }
                    }
                }
            });

            if (textContent) {
                this.onData(textContent);
            }
        });
        
        callback();
    }

    _flush(callback: (error?: Error | null, data?: any) => void): void {
        if (this.buffer) {
            const lines = this.buffer.split('\n');
            lines.forEach(line => {
                if (line.startsWith('data:')) {
                    try {
                        const jsonData = JSON.parse(line.slice(5).trim()) as DashScopeResponse;
                        if (jsonData.output?.text) {
                            this.onData(jsonData.output.text);
                        }
                    } catch(e) {
                        // 忽略最后一个不完整的数据
                    }
                }
            });
        }
        callback();
    }
}

export class DashScopeService {
    private static instance: DashScopeService;
    private readonly apiKey: string;
    private readonly appId: string;
    private readonly pipeline_ids = ['he9rcpebc3', 'utmhvnxgey'];
    private readonly timeout = 30000; // 30秒超时

    private constructor(config: DashScopeConfig) {
        this.apiKey = config.apiKey;
        this.appId = config.appId;
    }

    public static getInstance(config: DashScopeConfig): DashScopeService {
        if (!DashScopeService.instance) {
            DashScopeService.instance = new DashScopeService(config);
        }
        return DashScopeService.instance;
    }

    public async askQuestion(
        prompt: string,
        options: DashScopeServiceOptions = {}
    ): Promise<void> {
        const url = `https://dashscope.aliyuncs.com/api/v1/apps/${this.appId}/completion`;
        const startTime = Date.now();

        console.log(`[DashScope] 开始请求 - ${new Date().toISOString()}`);
        console.log(`[DashScope] Prompt: ${prompt.substring(0, 100)}...`);

        const data: DashScopeRequest = {
            input: {
                prompt
            },
            parameters: {
                'incremental_output': 'true',
                'has_thoughts': 'true',
                rag_options: {
                    pipeline_ids: this.pipeline_ids
                }
            },
            debug: {}
        };

        try {
            const response = await axios.post(url, data, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'X-DashScope-SSE': 'enable'
                },
                responseType: 'stream',
                timeout: this.timeout
            });

            if (response.status === 200) {
                console.log(`[DashScope] 请求成功 - 耗时: ${Date.now() - startTime}ms`);
                
                const sseTransformer = new SSETransformer((text: string) => {
                    options.onStream?.(text);
                });

                response.data
                    .pipe(sseTransformer)
                    .on('end', () => {
                        const totalTime = Date.now() - startTime;
                        console.log(`[DashScope] 响应完成 - 总耗时: ${totalTime}ms`);
                        console.log(`[DashScope] 调用 onComplete 回调`);
                        options.onComplete?.();
                    })
                    .on('error', (err: Error) => {
                        const error: DashScopeError = {
                            status: 500,
                            message: `流处理错误: ${err.message}`
                        };
                        console.error(`[DashScope] 流处理错误 - ${err.message}`);
                        options.onError?.(error);
                    })
                    .on('close', () => {
                        console.log(`[DashScope] 流连接已关闭`);
                    })
                    .on('finish', () => {
                        options.onComplete?.();
                        console.log(`[DashScope] 流写入完成`);
                    });

            } else {
                const error: DashScopeError = {
                    status: response.status,
                    message: '请求失败',
                    request_id: (response.data as DashScopeResponse).request_id,
                    data: response.data
                };
                console.error(`[DashScope] 请求失败 - 状态码: ${response.status}`);
                options.onError?.(error);
            }
        } catch (error) {
            if (error instanceof Error) {
                const dashError: DashScopeError = {
                    status: 500,
                    message: `API调用失败: ${error.message}`
                };

                if ('response' in error) {
                    const axiosError = error as any;
                    dashError.status = axiosError.response?.status || 500;
                    dashError.data = axiosError.response?.data;
                }

                console.error(`[DashScope] API调用失败 - ${error.message}`);
                options.onError?.(dashError);
            }
        }
    }
} 