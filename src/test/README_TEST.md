# 测试文档

本目录包含阿里云灵积模型服务的测试脚本，用于测试与 OWON 示波器相关的问答功能。

## 文件结构

```
test/
├── test_aliyun_api.js    # JavaScript 版本的测试脚本
├── test_aliyun_api.ts    # TypeScript 版本的测试脚本
├── run_test.ts           # 测试运行器
├── tsconfig.json         # TypeScript 配置文件
└── README_TEST.md        # 本文档
```

## 环境要求

- Node.js (推荐使用最新的 LTS 版本)
- pnpm 包管理器
- TypeScript (用于 .ts 文件)
- 已配置的环境变量（在 `src/.env.development.local` 中）：
  - DASHSCOPE_API_KEY
  - DASHSCOPE_APP_ID

## 依赖安装

在项目根目录下运行：

```bash
pnpm install
```

这将安装所需的依赖：
- axios：用于 API 请求
- dotenv：用于环境变量管理
- ts-node：用于运行 TypeScript 文件
- typescript：TypeScript 支持

## 使用方法

### 基本用法

使用测试运行器 `run_test.ts` 来执行测试：

```bash
# 显示帮助信息
npx ts-node run_test.ts --help

# 运行 JavaScript 版本的测试
npx ts-node run_test.ts -t js

# 运行 TypeScript 版本的测试
npx ts-node run_test.ts -t ts
```

### 命令行选项

- `-h, --help`：显示帮助信息
- `-t, --test <type>`：指定要运行的测试类型（js 或 ts）
- `-p, --prompt <question>`：指定要测试的问题

### 示例

1. 运行 JavaScript 测试并询问特定问题：
```bash
npx ts-node run_test.ts -t js -p "ADS800A的带宽是多少？"
```

2. 运行 TypeScript 测试并询问特定问题：
```bash
npx ts-node run_test.ts -t ts -p "示波器的采样率是多少？"
```

## 测试文件说明

### test_aliyun_api.js

JavaScript 版本的测试实现，特点：
- 使用 CommonJS 模块系统
- 基本的错误处理
- 流式响应处理

### test_aliyun_api.ts

TypeScript 版本的测试实现，特点：
- 使用 ES 模块系统
- 完整的类型定义
- 增强的错误处理
- 更好的代码组织

主要类型定义：
```typescript
interface DashScopeConfig {
    apiKey: string;
    appId: string;
}

interface DashScopeRequest {
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
```

### run_test.ts

测试运行器，功能：
- 统一的命令行界面
- 支持动态修改测试问题
- 详细的错误报告
- 支持两种测试版本

## 注意事项

1. 环境变量
   - 确保 `src/.env.development.local` 文件存在
   - 确保包含必要的环境变量
   - 不要在代码中硬编码 API 密钥

2. 知识库 ID
   - 测试中使用了两个知识库：
     - pipeline_ids1: 'he9rcpebc3'
     - pipeline_ids2: 'utmhvnxgey'

3. 错误处理
   - 脚本会检查环境变量是否存在
   - 会显示详细的错误信息
   - 包含请求失败时的状态码和响应数据

## 常见问题

1. 环境变量未找到
   ```
   请确保已在 src/.env.development.local 中设置环境变量 DASHSCOPE_API_KEY 和 DASHSCOPE_APP_ID
   ```
   解决：检查 `.env.development.local` 文件中的环境变量配置

2. TypeScript 编译错误
   ```
   error TS2307: Cannot find module '...' or its corresponding type declarations
   ```
   解决：运行 `pnpm install` 安装所需依赖

## 更新日志

### 2024-03-21
- 添加 TypeScript 版本的测试实现
- 添加统一的测试运行器
- 支持命令行参数
- 添加本文档 