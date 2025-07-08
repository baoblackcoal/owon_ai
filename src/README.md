<div align="center">
  <a href="https://demo-nextjs-with-supabase.vercel.app/">
    <img alt="Next.js、Supabase 和灵码 AI 入门套件" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
  </a>
  <h1>Next.js + Supabase + 灵码 AI 入门套件</h1>
</div>

<p align="center">
  <strong>一个集成了用户认证和 AI 聊天功能的 Next.js 全栈应用模板</strong>
</p>

<p align="center">
  <a href="#-功能特性"><strong>功能特性</strong></a> ·
  <a href="#-在线演示"><strong>在线演示</strong></a> ·
  <a href="#-本地运行"><strong>本地运行</strong></a> ·
  <a href="#-技术栈"><strong>技术栈</strong></a> ·
  <a href="#-反馈与问题"><strong>反馈与问题</strong></a>
</p>
<br/>

## ✨ 功能特性

- **完整的 Next.js 技术栈集成**
  - App Router
  - 中间件（Middleware）
  - 客户端组件（Client Components）
  - 服务端组件（Server Components）
- **Supabase 用户认证**
  - 使用 `supabase-ssr` 包，通过 Cookie 实现服务端渲染下的身份验证。
  - 预置了完整的用户认证流程页面（登录、注册、忘记密码等）。
- **阿里云灵码（Dashscope）AI 聊天**
  - 集成了阿里云灵码大模型 API，提供流式响应的 AI 聊天功能。
  - 后端路由 (`/api/dashscope`) 负责安全地代理客户端请求。
- **现代化前端**
  - 使用 [Tailwind CSS](https://tailwindcss.com) 进行样式设计。
  - 使用 [shadcn/ui](https://ui.shadcn.com/) 构建精美、可复用的组件。
- **一键部署**
  - 可选地通过 Vercel 与 Supabase 的集成进行一键部署。
  - 部署时会自动配置所有相关的环境变量。

## 🚀 在线演示

你可以访问 [demo-nextjs-with-supabase.vercel.app](https://demo-nextjs-with-supabase.vercel.app/) 查看一个完整的在线演示。

## 本地运行

### 1. 创建 Supabase 项目

首先，你需要在 [Supabase 官网](https://database.new) 创建一个项目。

### 2. 克隆并安装依赖

使用 `create-next-app` 命令来初始化项目：

```bash
npx create-next-app --example with-supabase my-ai-app
```

或者使用 `pnpm`:
```bash
pnpm create next-app --example with-supabase my-ai-app
```

然后进入项目目录：
```bash
cd my-ai-app
```

### 3. 配置环境变量

将 `.env.example` 文件复制为 `.env.local`：

```bash
cp .env.example .env.local
```

然后，更新文件中的以下变量：

```env
# Supabase 项目 URL 和 Anon Key
# 可在 Supabase 项目的 API 设置中找到
NEXT_PUBLIC_SUPABASE_URL=[你的 SUPABASE 项目 URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[你的 SUPABASE 项目 ANON KEY]

# 阿里云 Dashscope（灵码）的 API Key 和 App ID
# 可在阿里云控制台的灵码页面获取
DASHSCOPE_API_KEY=[你的 DASHSCOPE API KEY]
DASHSCOPE_APP_ID=[你的 DASHSCOPE APP ID]
```

### 4. 运行开发服务器

现在，你可以启动 Next.js 的本地开发服务器：

```bash
pnpm dev
```

项目现在应该运行在 [http://localhost:3000](http://localhost:3000) 上。

> **提示**: 你也可以参考 [Supabase 本地开发文档](https://supabase.com/docs/guides/getting-started/local-development) 在本地运行 Supabase。

## 🛠️ 技术栈

- **框架**: [Next.js](https://nextjs.org/)
- **后端服务 (BaaS)**: [Supabase](https://supabase.com/)
- **AI 服务**: [阿里云灵码 (Dashscope)](https://help.aliyun.com/document_detail/2586413.html)
- **UI**: [Tailwind CSS](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com/)
- **包管理器**: [pnpm](https://pnpm.io/)

## 💬 反馈与问题

如果你有任何反馈或遇到问题，请在 [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose) 上提交 Issue。