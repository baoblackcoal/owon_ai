# AI实验教学辅助系统

基于需求文档 `dbly_req2.md` 和 `dbly_ux.md` 实现的AI实验教学辅助系统原型。

## 功能特性

### 🎓 学生端功能
- **课程浏览**: 查看所有可用的实验课程（数字电路、模拟电路、电路基础）
- **AI预习**: 
  - 个性化导师配置（深度等级、沟通风格）
  - 自动生成结构化预习报告
  - 支持导出为TXT和Markdown格式
- **实验操作台**: 
  - 左右分栏布局：实验讲义 + AI问答
  - 实时AI助教问答，上下文感知
  - 本地存储对话历史
  - 响应式设计，支持移动端

### 🔧 教师端功能
- **管理后台**: 实验讲义文件管理
- **文件操作**: 上传、更新、删除实验讲义
- **课程管理**: 按课程分类管理实验内容

## 页面结构

```
/test/test_dbly/
├── page.tsx                    # 主页面 - 课程列表
├── preview/[experimentId]/     # AI预习功能
│   ├── page.tsx               # 预习配置页面
│   └── report/page.tsx        # 预习报告页面
├── experiment/[experimentId]/  # 实验操作台
│   └── page.tsx               # 分栏布局：讲义+AI问答
├── admin/                     # 管理后台
│   └── page.tsx               # 讲义管理
└── mockData.ts                # 虚假数据

```

## 技术实现

### 前端技术栈
- **Next.js 14**: React框架，App Router
- **TypeScript**: 类型安全
- **Tailwind CSS**: 样式框架
- **shadcn/ui**: 组件库
- **Lucide React**: 图标库

### 核心功能
- **AI问答模拟**: 基于关键词匹配的智能回复
- **本地存储**: 对话历史和用户配置
- **响应式设计**: 支持桌面和移动端
- **虚假数据**: 完整的课程、实验、讲义数据

## 使用方法

### 1. 启动系统
```bash
cd src
pnpm dev
```

### 2. 访问页面
- **学生端**: `http://localhost:3000/test/test_dbly`
- **管理后台**: `http://localhost:3000/test/test_dbly/admin`

### 3. 学生使用流程
1. 在主页选择课程
2. 选择具体实验
3. 点击"开始预习"配置AI导师
4. 查看生成的预习报告
5. 点击"进入实验"开始实验操作
6. 在实验过程中向AI助教提问

### 4. 教师使用流程
1. 访问管理后台
2. 上传新的实验讲义文件
3. 更新现有文件信息
4. 删除过时的文件

## 数据结构

### 课程数据
```typescript
interface Course {
  id: string;
  name: string;
  description: string;
  category: 'digital' | 'analog' | 'basic';
  experiments: Experiment[];
}
```

### 实验数据
```typescript
interface Experiment {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  equipment: string[];
  manual: ExperimentManual;
}
```

### AI导师配置
```typescript
interface AITutorConfig {
  depth: 'beginner' | 'standard' | 'advanced';
  style: 'academic' | 'vivid' | 'encouraging';
}
```

## 设计亮点

### 1. 用户体验
- 直观的课程分类和实验列表
- 个性化的AI导师配置
- 结构化的预习报告
- 无缝的实验操作台体验

### 2. 响应式设计
- 桌面端：左右分栏布局
- 移动端：可切换的单栏布局
- 自适应的组件和间距

### 3. 本地存储
- 对话历史按实验分类保存
- 用户配置持久化
- 离线可用的历史记录

### 4. 模拟AI功能
- 基于关键词的智能回复
- 上下文感知的实验相关建议
- 专业的实验指导内容

## 扩展可能

### 短期优化
- 集成真实的AI API（如通义千问）
- 添加语音输入输出
- 支持图片上传和识别
- 添加实验数据记录

### 长期规划
- 与OWON FDS仪器集成
- 实验报告自动生成
- 学习进度跟踪
- 多人协作实验

## 注意事项

1. 这是一个原型系统，使用虚假数据
2. AI回复基于简单的关键词匹配
3. 文件上传功能仅为UI演示
4. 需要现代浏览器支持（Chrome, Firefox, Safari）

## 开发说明

所有代码都遵循了需求文档的设计要求：
- 实现了完整的用户旅程
- 符合UX设计规范
- 包含所有核心功能模块
- 提供了良好的用户体验

系统可以作为后续开发的基础，通过集成真实的AI服务和硬件设备来实现完整的功能。 