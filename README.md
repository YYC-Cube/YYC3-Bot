<div align="center">

# 🎯 YYC³ Bot — 言宇云枢 智能应用门户

**「 言启象限 · 语枢未来 — 五高五标五化五维核心机制 」**

[![Family Banner](public/Family-001.png)](public/Family-001.png)

---

<!-- 徽章系统 / Badges -->

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript_6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm_11-F69220?style=for-the-badge&logo=pnpm&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)

[![GitHub Release](https://img.shields.io/github/v/release/YanYuCloudCube/yyc3-bot?style=flat-square&logo=github&color=blue)](https://github.com/YanYuCloudCube/yyc3-bot)
[![License](https://img.shields.io/badge/license-Private-red?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)
[![Code Style](https://img.shields.io/badge/code_style-prettier-ff69b4?style=flat-square)](.prettierrc)
[![Commit Convention](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow?style=flat-square)](https://www.conventionalcommits.org)
[![Security](https://img.shields.io/badge/security-audited-brightgreen?style=flat-square)](SECURITY.md)

</div>

---

<!-- ====== 中文 ====== -->

## 📋 项目概览

YYC³ Bot 是 **YanYuCloudCube（言宇云枢）** 团队打造的智能应用门户，集 **AI 对话**、**设备监控**、**MCP 服务管理**、**项目矩阵导航** 于一体的全栈智能平台。

### 🎯 核心特性

| 特性模块 | 描述 |
|---------|------|
| 🤖 **AI 对话** | 支持智谱 GLM-4-Flash（云端）与 Ollama Qwen 2.5 7B（本地）双提供商，SSE 流式实时响应 |
| 📊 **仪表盘** | MCP 服务总览、设备在线统计、AI 调用日志汇总、Ollama 模型状态实时监控 |
| 🗂️ **项目矩阵** | 140+ 项目分类浏览（AI 应用 / 教育 / 医疗 / 工具等 9 大类），支持搜索与筛选 |
| ⚙️ **MCP 管理** | MCP 服务器 CRUD、启用/禁用切换、分类管理、超时配置 |
| 📡 **状态监控** | 7 台设备在线检测、Ollama 健康检查、MCP 调用日志统计 |

### 🏗️ 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | [Next.js 16](https://nextjs.org) (App Router + Turbopack) |
| **语言** | [TypeScript 6](https://typescriptlang.org) |
| **UI 体系** | [React 19](https://react.dev) + [Radix UI](https://radix-ui.com) + [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (new-york) |
| **AI 引擎** | 智谱 GLM-4-Flash / Ollama (Qwen 2.5 7B) |
| **数据库** | PostgreSQL ([postgres.js](https://github.com/porsager/postgres)) |
| **包管理** | [pnpm](https://pnpm.io) 11 Workspace (Monorepo) |
| **构建** | [Turborepo](https://turbo.build) |
| **测试** | [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) |
| **部署** | Vercel / 自托管 |

### 📁 项目结构

```
yyc3-bot/
├── app/                        # Next.js App Router 页面
│   ├── (portal)/               # 门户布局组（Header + Footer）
│   │   ├── chat/               # AI 对话页
│   │   ├── dashboard/          # 仪表盘
│   │   ├── projects/           # 项目矩阵
│   │   ├── settings/           # MCP 服务设置
│   │   └── status/             # 设备 & 服务状态
│   ├── api/                    # API 路由
│   │   ├── chat/               # AI 对话接口（SSE 流式）
│   │   ├── health/             # 设备健康检查
│   │   ├── mcp/                # MCP 服务管理 + 调用日志
│   │   ├── projects/           # 项目数据查询
│   │   └── status/             # 综合状态（Ollama + 设备）
│   ├── data/                   # 静态数据（projects.json）
│   ├── globals.css             # 全局样式
│   ├── layout.tsx              # 根布局
│   └── page.tsx                # 首页（Spline 3D 场景）
├── components/                 # 共享组件
│   ├── ui/                     # shadcn/ui 组件库（60+）
│   ├── ai-chat-provider.tsx    # AI 对话上下文
│   ├── ai-chat-sheet.tsx       # AI 对话抽屉
│   ├── new-yorker-spline.tsx   # Spline 3D 主视觉
│   └── theme-provider.tsx      # 主题切换
├── lib/                        # 工具库
│   ├── db.ts                   # PostgreSQL 连接池
│   ├── chat-storage.ts         # IndexedDB 对话持久化
│   └── utils.ts                # 通用工具（cn 桥接）
├── packages/                   # Monorepo 内部包
│   ├── ai/                     # @yyc3/ai — AI 提供商
│   ├── core/                   # @yyc3/core — 品牌、类型、工具
│   ├── hooks/                  # @yyc3/hooks — React Hooks
│   ├── ui/                     # @yyc3/ui — 业务组件
│   ├── eslint-config/          # ESLint 共享配置
│   └── tsconfig/               # TypeScript 共享配置
├── MCP/                        # MCP 服务配置
├── public/                     # 静态资源
├── docs/                       # 项目文档（10 个阶段）
├── package.json                # 根包配置
├── pnpm-workspace.yaml         # pnpm 工作区
├── turbo.json                  # Turborepo 任务配置
├── vitest.config.ts            # 测试配置
├── next.config.mjs             # Next.js 配置
├── tsconfig.json               # TypeScript 配置
└── components.json             # shadcn/ui 配置
```

---

## 🚀 快速开始

### 环境要求

| 环境 | 版本要求 |
|------|---------|
| Node.js | ≥ 20 |
| pnpm | ≥ 9（推荐 11） |
| PostgreSQL | ≥ 15（可选，用于 MCP 持久化） |

### 安装步骤

```bash
# 1️⃣ 克隆仓库
git clone <repo-url>
cd yyc3-bot

# 2️⃣ 安装依赖
pnpm install

# 3️⃣ 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入实际值
```

### 数据库初始化（可选）

```sql
CREATE DATABASE yyc3_mcp;

-- MCP 服务器表
CREATE TABLE mcp_servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT, description TEXT,
  type TEXT NOT NULL DEFAULT 'stdio', category TEXT,
  command TEXT, args JSONB DEFAULT '[]', env JSONB DEFAULT '{}',
  timeout INTEGER DEFAULT 30000, enabled BOOLEAN DEFAULT true,
  version TEXT, metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);

-- MCP 调用日志表
CREATE TABLE mcp_call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID REFERENCES mcp_servers(id), method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', duration_ms INTEGER,
  error_message TEXT, prompt_tokens INTEGER, completion_tokens INTEGER,
  total_tokens INTEGER, created_at TIMESTAMPTZ DEFAULT now()
);

-- 设备健康检查表
CREATE TABLE health_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_name TEXT NOT NULL, device_host TEXT NOT NULL,
  device_type TEXT, status TEXT NOT NULL DEFAULT 'unknown',
  latency_ms INTEGER, metadata JSONB DEFAULT '{}',
  checked_at TIMESTAMPTZ DEFAULT now()
);
```

### 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3141](http://localhost:3141)

---

## 📜 可用脚本

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器（Turbopack，端口 3141） |
| `pnpm build` | 生产构建 |
| `pnpm start` | 启动生产服务器 |
| `pnpm lint` | ESLint 检查 |
| `pnpm test` | 运行测试 |
| `pnpm test:watch` | 监听模式测试 |

---

## 📦 Monorepo 包

| 包名 | 说明 |
|------|------|
| `@yyc3/ai` | AI 提供商适配（智谱 GLM / Ollama） |
| `@yyc3/core` | 品牌常量、类型定义、工具函数 |
| `@yyc3/hooks` | React Hooks（useMobile 等） |
| `@yyc3/ui` | 业务组件（BrandHeader、ProjectCard、DeviceCard 等） |
| `@yyc3/eslint-config` | ESLint 共享配置 |
| `@yyc3/tsconfig` | TypeScript 共享配置 |

---

## 🌐 API 路由

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/chat` | AI 对话（SSE 流式） |
| GET | `/api/health` | 设备健康检查数据 |
| GET | `/api/status` | Ollama + 设备综合状态 |
| GET | `/api/projects?q=&category=` | 项目列表（支持搜索/筛选） |
| GET | `/api/mcp/servers` | MCP 服务器列表 |
| POST | `/api/mcp/servers` | 新增 MCP 服务器 |
| PUT | `/api/mcp/servers` | 更新 MCP 服务器 |
| GET | `/api/mcp/call-logs` | MCP 调用日志 |

---

## 🧭 页面路由

| 路径 | 说明 |
|------|------|
| `/` | 首页（Spline 3D 主视觉） |
| `/chat` | AI 对话 |
| `/dashboard` | 仪表盘 |
| `/projects` | 项目矩阵 |
| `/settings` | MCP 服务设置 |
| `/status` | 设备 & 服务状态 |

---

## 🏛️ 文档体系

项目文档采用 **五阶段全链路文档架构**，覆盖项目全生命周期：

| 阶段 | 说明 |
|------|------|
| `docs/00-项目总览索引/` | 项目总览、文档导航、快速开始、核心概念、版本日志 |
| `docs/01-启动规划阶段/` | 项目规划、需求规划、可行性分析、风险管理 |
| `docs/02-项目设计阶段/` | 架构设计、详细设计、AI 智能层、业务逻辑层 |
| `docs/03-开发实施阶段/` | 开发环境、开发规范、API 文档 |
| `docs/04-测试审核阶段/` | 测试策略、质量审核标准 |
| `docs/05-交付部署阶段/` | 部署流程、交付物管理 |
| `docs/06-运维保障阶段/` | 运维策略、健康监控 |
| `docs/07-合规安全保障/` | 安全开发规范、安全运维规范 |
| `docs/08-资产知识管理/` | 资产清单 |
| `docs/09-智能演进优化/` | 质量提升、持续改进计划 |
| `docs/16-YYC3-FAmily-九层五维-核心设计/` | YYC³ 九层五维核心设计体系 |

---

## 👥 团队

**YanYuCloudCube（言宇云枢）团队** — [admin@0379.email](mailto:admin@0379.email)

---

## 📄 许可证

**私有项目** — 未经授权不得使用。

---

<details>
<summary><b>🌐 English Version</b></summary>

<br />

# YYC³ Bot — YanYuCloudCube Intelligent Application Portal

> *Words Inspire Dimensions · Language Pivots the Future — Five-Architecture · Five-Standard · Five-Transformation · Five-Dimension Core Mechanism*

YYC³ Bot is an intelligent application portal built by the **YanYuCloudCube** team, integrating **AI Chat**, **Device Monitoring**, **MCP Service Management**, and **Project Matrix Navigation** into one full-stack intelligent platform.

### Core Features

| Module | Description |
|--------|-------------|
| 🤖 **AI Chat** | Dual provider support (Zhipu GLM-4-Flash cloud + Ollama Qwen 2.5 7B local), SSE streaming real-time responses |
| 📊 **Dashboard** | MCP service overview, device online statistics, AI call log aggregation, Ollama model status |
| 🗂️ **Project Matrix** | 140+ projects across 9 categories (AI Apps, Education, Healthcare, Tools, etc.), search & filter supported |
| ⚙️ **MCP Management** | MCP server CRUD, enable/disable toggling, category management, timeout configuration |
| 📡 **Status Monitoring** | Real-time health checks for 7 devices, Ollama service status, MCP call logs |

### Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router + Turbopack) |
| **Language** | [TypeScript 6](https://typescriptlang.org) |
| **UI System** | [React 19](https://react.dev) + [Radix UI](https://radix-ui.com) + [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (new-york) |
| **AI Engine** | Zhipu GLM-4-Flash / Ollama (Qwen 2.5 7B) |
| **Database** | PostgreSQL ([postgres.js](https://github.com/porsager/postgres)) |
| **Package Manager** | [pnpm](https://pnpm.io) 11 Workspace (Monorepo) |
| **Build** | [Turborepo](https://turbo.build) |
| **Testing** | [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) |
| **Deployment** | Vercel / Self-hosted |

### Quick Start

```bash
# Clone repository
git clone <repo-url>
cd yyc3-bot

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local

# Start development server
pnpm dev
```

Visit [http://localhost:3141](http://localhost:3141)

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (Turbopack, port 3141) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | ESLint check |
| `pnpm test` | Run tests |
| `pnpm test:watch` | Watch mode tests |

### Monorepo Packages

| Package | Description |
|---------|-------------|
| `@yyc3/ai` | AI provider adapters (Zhipu GLM / Ollama) |
| `@yyc3/core` | Brand constants, type definitions, utilities |
| `@yyc3/hooks` | React Hooks (useMobile, etc.) |
| `@yyc3/ui` | Business components (BrandHeader, ProjectCard, DeviceCard, etc.) |
| `@yyc3/eslint-config` | Shared ESLint configuration |
| `@yyc3/tsconfig` | Shared TypeScript configuration |

### Team

**YanYuCloudCube Team** — [admin@0379.email](mailto:admin@0379.email)

### License

**Private** — Unauthorized use is prohibited.

</details>