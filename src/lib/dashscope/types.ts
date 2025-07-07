export interface DashScopeConfig {
    apiKey: string;
    appId: string;
}

export interface DashScopeRequest {
    input: {
        prompt: string;
    };
    parameters: {
        incremental_output: string;
        has_thoughts: string;
        rag_options: {
            pipeline_ids: string[];
        };
    };
    debug: Record<string, unknown>;
}

export interface DashScopeResponse {
    output?: {
        text?: string;
    };
    request_id?: string;
    message?: string;
}

export interface DashScopeError {
    status: number;
    message: string;
    request_id?: string;
    data?: unknown;
}

// 流式响应处理器的类型
export type StreamHandler = (text: string) => void;

// 错误处理器的类型
export type ErrorHandler = (error: DashScopeError) => void;

// 完成处理器的类型
export type CompletionHandler = () => void;

// 服务配置选项
export interface DashScopeServiceOptions {
    onStream?: StreamHandler;
    onError?: ErrorHandler;
    onComplete?: CompletionHandler;
} 