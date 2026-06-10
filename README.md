<div align="center">

# 🎯 YYC³ Bot — 言语云枢 智能应用门户

**「 言启象限 · 语枢未来 — 五高五标五化五维核心机制 」**

<p align="center">
  <a href="public/Family-001.png">
    <img src="public/Family-001.png" alt="YYC³ Bot Family Banner" width="100%" style="max-width: 960px; border-radius: 12px;" />
  </a>
</p>

---

<!-- ═══════ 徽章系统 / Badge System ═══════ -->

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript_5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm_11-F69220?style=for-the-badge&logo=pnpm&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)

[![GitHub Release](https://img.shields.io/github/v/release/YYC-Cube/YYC3-Bot?style=flat-square&logo=github&color=blue)](https://github.com/YYC-Cube/YYC3-Bot/releases)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square&logo=vercel)](https://github.com/YYC-Cube/YYC3-Bot/actions)
[![Tests](https://img.shields.io/badge/tests-44%20passing-brightgreen?style=flat-square&logo=vitest)](https://github.com/YYC-Cube/YYC3-Bot)
[![PWA](https://img.shields.io/badge/PWA-ready-5A0FC8?style=flat-square&logo=pwa)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![License](https://img.shields.io/badge/license-Private-red?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)
[![Code Style](https://img.shields.io/badge/code_style-prettier-ff69b4?style=flat-square)](.prettierrc)
[![Commit Convention](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow?style=flat-square)](https://www.conventionalcommits.org)
[![Security](https://img.shields.io/badge/security-audited-brightgreen?style=flat-square)](SECURITY.md)
[![Mobile](https://img.shields.io/badge/mobile-optimized-00C853?style=flat-square&logo=android)](https://github.com/YYC-Cube/YYC3-Bot)
[![AI Engine](https://img.shields.io/badge/AI-Zhipu%20%7C%20Ollama-8B5CF6?style=flat-square&logo=openai)](https://github.com/YYC-Cube/YYC3-Bot)

</div>

---

<!-- ====== 中文 ====== -->

## 📋 项目概览

YYC³ Bot 是 **YanYuCloudCube（言语云枢）** 团队打造的智能应用门户，集 **AI 对话**、**设备监控**、**MCP 服务管理**、**项目矩阵导航** 于一体的全栈智能平台。

### 🎯 核心特性

| 特性模块 | 描述 |
|---------|------|
| 🤖 **AI 智能对话** | 多 Provider 可配置（智谱 GLM-4-Flash / Ollama Qwen 2.5 / 自定义），可拖拽浮动面板，SSE 流式实时响应，IndexedDB 持久化 |
| 🔄 **模型热切换** | 运行时动态切换 AI 模型，支持自定义 Provider/Model/Base URL/API Key，无需重启服务 |
| 📡 **本地模型扫描** | 自动扫描本地 Ollama 服务可用模型列表，一键选用，支持自编辑模型参数 |
| 📦 **PWA 支持** | 完整 Web App Manifest，支持安装到桌面，独立窗口运行，深色/浅色主题自适应 |
| 📊 **智能仪表盘** | MCP 服务总览、设备在线统计、AI 调用日志汇总、Ollama 模型状态实时监控 |
| 🗂️ **项目矩阵** | 140+ 项目分类浏览（AI 应用 / 教育 / 医疗 / 工具等 9 大类），支持搜索与筛选 |
| ⚙️ **MCP 管理** | MCP 服务器 CRUD、启用/禁用切换、分类管理、超时配置 |
| 📡 **状态监控** | 7 台设备在线检测、Ollama 健康检查、MCP 调用日志统计 |
| 📱 **移动端优化** | 全屏适配、触控手势优化、响应式布局，桌面端可拖拽浮动面板 |

### 🏗️ 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | [Next.js 16](https://nextjs.org) (App Router + Turbopack) |
| **语言** | [TypeScript 5.7](https://typescriptlang.org) |
| **UI 体系** | [React 19](https://react.dev) + [Radix UI](https://radix-ui.com) + [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (new-york) |
| **AI 引擎** | 智谱 GLM (OpenAI 兼容) / Ollama (Qwen 2.5 等) / 自定义 Provider |
| **数据库** | PostgreSQL ([postgres.js](https://github.com/porsager/postgres)) |
| **存储** | IndexedDB（对话持久化） / localStorage（模型配置持久化） |
| **包管理** | [pnpm](https://pnpm.io) 11 Workspace (Monorepo) |
| **构建** | [Turborepo](https://turbo.build) |
| **测试** | [Vitest](https://vitest.dev) 4 + [Testing Library](https://testing-library.com) |
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
│   │   ├── chat/               # AI 对话接口（SSE 流式，支持动态模型）
│   │   ├── health/             # 设备健康检查
│   │   ├── mcp/                # MCP 服务管理 + 调用日志
│   │   ├── ollama/models/      # Ollama 本地模型扫描
│   │   ├── projects/           # 项目数据查询
│   │   └── status/             # 综合状态（Ollama + 设备）
│   ├── data/                   # 静态数据（projects.json）
│   ├── globals.css             # 全局样式
│   ├── layout.tsx              # 根布局（含 PWA meta + manifest）
│   └── page.tsx                # 首页（Spline 3D 场景）
├── components/                 # 共享组件
│   ├── ui/                     # shadcn/ui 组件库（60+）
│   ├── __tests__/              # 组件测试
│   │   └── ai-assistant.test.tsx
│   ├── ai-assistant.tsx        # AI 可拖拽浮窗（含模型设置面板）
│   ├── ai-chat-provider.tsx    # AI 对话上下文全局提供者
│   ├── new-yorker-spline.tsx   # Spline 3D 主视觉
│   └── theme-provider.tsx      # 主题切换
├── hooks/                      # 自定义 Hooks
│   ├── __tests__/              # Hooks 测试
│   │   ├── use-draggable.test.ts
│   │   └── use-floating-panel.test.ts
│   ├── use-draggable.ts        # 拖拽交互（含边界约束）
│   ├── use-floating-panel.ts   # 浮动面板状态管理
│   └── use-model-config.ts     # 模型配置状态管理（IndexedDB 持久化）
├── lib/                        # 工具库
│   ├── db.ts                   # PostgreSQL 连接池
│   ├── chat-storage.ts         # IndexedDB 对话持久化
│   └── utils.ts                # 通用工具（cn 桥接）
├── packages/                   # Monorepo 内部包
│   ├── ai/                     # @yyc3/ai — AI 提供商适配
│   │   └── src/
│   │       ├── providers.ts    # chatStream / chatStreamWithModel
│   │       ├── constants.ts    # 提供商配置 + System Prompt
│   │       ├── types.ts        # 类型定义
│   │       └── index.ts        # 包导出
│   ├── core/                   # @yyc3/core — 品牌、类型、工具
│   ├── hooks/                  # @yyc3/hooks — React Hooks
│   ├── ui/                     # @yyc3/ui — 业务组件
│   ├── eslint-config/          # ESLint 共享配置
│   └── tsconfig/               # TypeScript 共享配置
├── MCP/                        # MCP 服务配置
├── public/                     # 静态资源
│   ├── manifest.json           # PWA Web App Manifest
│   ├── yyc3-dist/              # 品牌图标资源
│   └── Family-001.png          # 项目主视觉
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
git clone git@github.com:YYC-Cube/YYC3-Bot.git
cd yyc3-bot

# 2️⃣ 安装依赖
pnpm install

# 3️⃣ 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入实际值
```

### 环境变量配置

```env
# ── 数据库（可选） ──
DATABASE_URL="postgresql://user:password@localhost:5432/yyc3_mcp"

# ── AI Provider ──
ZHIPU_API_KEY="your_zhipu_api_key"       # 智谱 API Key
ZHIPU_BASE_URL="https://open.bigmodel.cn/api/paas/v4"

# Ollama（可选，默认 localhost:11434）
OLLAMA_BASE_URL="http://localhost:11434"

# ── 应用配置 ──
NEXT_PUBLIC_APP_URL="http://localhost:3141"
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

## 🤖 AI 智能对话

YYC³ Bot 的 AI 对话模块经过 **Phase 1 → Phase 2** 架构演进，从固定侧边栏升级为可拖拽浮动面板，并支持多模型动态配置。

### 核心架构

```
┌─────────────────────────────────────────┐
│          AiChatProvider (全局)            │
│  ┌───────────────────────────────────┐  │
│  │    AiAssistant (浮动面板)          │  │
│  │  ┌─────────┐ ┌─────────────────┐ │  │
│  │  │ Header  │ │ 模型选择器 + 设置 │ │  │
│  │  ├─────────┤ ├─────────────────┤ │  │
│  │  │ Chat    │ │ 流式消息展示     │ │  │
│  │  │ Area    │ │ SSE 实时更新     │ │  │
│  │  ├─────────┤ ├─────────────────┤ │  │
│  │  │ Input   │ │ Enter 发送      │ │  │
│  │  └─────────┘ └─────────────────┘ │  │
│  └───────────────────────────────────┘  │
│                                          │
│  ┌───────────────────────────────────┐  │
│  │    SettingsPanel (设置面板)        │  │
│  │  · 模型列表 + 切换                │  │
│  │  · 添加/编辑/删除 Provider        │  │
│  │  · 本地 Ollama 扫描              │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 模型配置管理

| 功能 | 说明 |
|------|------|
| **多 Provider** | 支持智谱 API（OpenAI 兼容）、Ollama（本地），可扩展自定义 Provider |
| **动态热切换** | Header 下拉菜单一键切换模型，实时生效 |
| **自编辑** | 设置面板添加/编辑/删除 Provider，修改 name/model/baseUrl/apiKey |
| **本地扫描** | 自动扫描 `http://localhost:11434/api/tags`，列出可用 Ollama 模型 |
| **持久化** | 模型配置通过 IndexedDB 持久化，刷新页面不丢失 |

### 交互特性

| 平台 | 特性 |
|------|------|
| **桌面端** | 可拖拽浮动面板、最大化/还原、右下角 FAB 入口 |
| **移动端** | 全屏沉浸式、触摸优化、滑动操作 |

---

## � PWA 支持

YYC³ Bot 提供完整的 PWA（Progressive Web App）支持：

| 特性 | 配置 |
|------|------|
| **Web App Manifest** | `public/manifest.json` — 名称、图标、主题色、独立窗口 |
| **安装到桌面** | `display: standalone` — 无浏览器工具栏，原生应用体验 |
| **主题色自适应** | 深色模式 `#18181b` / 浅色模式 `#ffffff`，媒体查询动态切换 |
| **Apple 支持** | `apple-touch-icon`、`apple-mobile-web-app-capable`、`status-bar-style: black-translucent` |
| **图标集** | 16×16 到 512×512 全尺寸覆盖，含 maskable 适配 |
| **屏幕截图** | 主界面截图用于应用商店安装引导 |

### 安装方式

- **Android Chrome**: 访问页面 → 地址栏底部"安装"提示 → 确认安装
- **iOS Safari**: 分享按钮 → "添加到主屏幕" → 确认
- **桌面 Chrome**: 地址栏右侧安装图标 → 确认安装

---

## 🧪 测试体系

基于 **Vitest 4** + **Testing Library** 的测试框架，覆盖核心 Hooks 与组件。

### 测试文件结构

```
hooks/__tests__/
├── use-draggable.test.ts       # 拖拽 Hook：位置、边界、重置、拖拽事件
└── use-floating-panel.test.ts  # 面板 Hook：开关、最大化、标签页、面板样式

components/__tests__/
└── ai-assistant.test.tsx       # AI 浮窗：渲染、输入、发送、流式 API、加载状态
```

### 运行测试

```bash
# 运行全部测试
pnpm test

# 监听模式
pnpm test:watch

# 查看覆盖率
pnpm test -- --coverage
```

### 测试结果

```
 Test Files  5 passed (5)
      Tests  44 passed (44)
```

---

## �📜 可用脚本

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器（Turbopack，端口 3141） |
| `pnpm build` | 生产构建 |
| `pnpm start` | 启动生产服务器 |
| `pnpm lint` | ESLint 检查 |
| `pnpm test` | 运行测试（Vitest） |
| `pnpm test:watch` | 监听模式测试 |

---

## 📦 Monorepo 包

| 包名 | 路径 | 说明 |
|------|------|------|
| `@yyc3/ai` | `packages/ai/` | AI 提供商适配（智谱 GLM / Ollama），含动态模型 API |
| `@yyc3/core` | `packages/core/` | 品牌常量、类型定义、工具函数（cn 等） |
| `@yyc3/hooks` | `packages/hooks/` | React Hooks（useMobile 等） |
| `@yyc3/ui` | `packages/ui/` | 业务组件（BrandHeader、ProjectCard、DeviceCard 等） |
| `@yyc3/eslint-config` | `packages/eslint-config/` | ESLint 共享配置 |
| `@yyc3/tsconfig` | `packages/tsconfig/` | TypeScript 共享配置 |

---

## 🌐 API 路由

| 方法 | 路径 | 说明 | 支持动态模型 |
|------|------|------|:---:|
| POST | `/api/chat` | AI 对话（SSE 流式，自动或指定 Provider） | ✅ |
| GET | `/api/ollama/models` | 扫描本地 Ollama 可用模型 | — |
| GET | `/api/health` | 设备健康检查数据 | — |
| GET | `/api/status` | Ollama + 设备综合状态 | — |
| GET | `/api/projects?q=&category=` | 项目列表（支持搜索/筛选） | — |
| GET | `/api/mcp/servers` | MCP 服务器列表 | — |
| POST | `/api/mcp/servers` | 新增 MCP 服务器 | — |
| PUT | `/api/mcp/servers` | 更新 MCP 服务器 | — |
| GET | `/api/mcp/call-logs` | MCP 调用日志 | — |

### /api/chat 请求示例

```json
{
  "messages": [{ "role": "user", "content": "分析我的项目架构" }],
  "provider": "zhipu",
  "model": "glm-4-flash",
  "baseUrl": "https://open.bigmodel.cn/api/paas/v4",
  "apiKey": "your_api_key"
}
```

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

| 阶段 | 路径 | 说明 |
|------|------|------|
| 总览索引 | `docs/00-项目总览索引/` | 项目总览、文档导航、快速开始、核心概念、版本日志 |
| 启动规划 | `docs/01-启动规划阶段/` | 项目规划、需求规划、可行性分析、风险管理 |
| 项目设计 | `docs/02-项目设计阶段/` | 架构设计、详细设计、AI 智能层、业务逻辑层 |
| 开发实施 | `docs/03-开发实施阶段/` | 开发环境、开发规范、API 文档 |
| 测试审核 | `docs/04-测试审核阶段/` | 测试策略、质量审核标准 |
| 交付部署 | `docs/05-交付部署阶段/` | 部署流程、交付物管理 |
| 运维保障 | `docs/06-运维保障阶段/` | 运维策略、健康监控 |
| 合规安全 | `docs/07-合规安全保障/` | 安全开发规范、安全运维规范 |
| 资产知识 | `docs/08-资产知识管理/` | 资产清单 |
| 智能演进 | `docs/09-智能演进优化/` | 质量提升、持续改进计划 |

---

## 📄 许可 & 贡献

| 项目 | 说明 |
|------|------|
| **许可证** | 私有项目 — 未经授权不得使用 |
| **贡献指南** | 欢迎 PR，请遵循 Conventional Commits 规范 |
| **代码风格** | Prettier 统一格式化 |

---

## 👥 团队

**YanYuCloudCube（言语云枢）团队** — [admin@0379.email](mailto:admin@0379.email)

---

<div align="center">

### � 言启千行代码，语枢万物智能

*Words Inspire Thousands of Lines of Code, Language Pivots the Intelligence of All Things*

</div>

---

<!-- ====== English ====== -->

<details>
<summary><b>🌐 English Version</b></summary>

<br />

<div align="center">

# YYC³ Bot — YanYuCloudCube Intelligent Application Portal

> *Words Inspire Dimensions · Language Pivots the Future — Five-Architecture · Five-Standard · Five-Transformation · Five-Dimension Core Mechanism*

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript_5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm_11-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

[![Build](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square&logo=vercel)](https://github.com/YYC-Cube/YYC3-Bot/actions)
[![Tests](https://img.shields.io/badge/tests-44%20passing-brightgreen?style=flat-square&logo=vitest)](https://github.com/YYC-Cube/YYC3-Bot)
[![PWA](https://img.shields.io/badge/PWA-ready-5A0FC8?style=flat-square&logo=pwa)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![License](https://img.shields.io/badge/license-Private-red?style=flat-square)](LICENSE)

</div>

## Overview

YYC³ Bot is an intelligent application portal built by the **YanYuCloudCube** team, integrating **AI Chat**, **Device Monitoring**, **MCP Service Management**, and **Project Matrix Navigation** into one full-stack intelligent platform.

### Core Features

| Module | Description |
|--------|-------------|
| 🤖 **AI Chat** | Multi-provider configurable (Zhipu GLM-4-Flash / Ollama Qwen 2.5 / Custom), draggable floating panel, SSE streaming, IndexedDB persistence |
| 🔄 **Hot-Swap Models** | Switch AI models at runtime — customize provider, model, base URL, and API key without restart |
| 📡 **Local Model Scan** | Auto-scan available Ollama models on your machine, one-click apply, self-edit model parameters |
| 📦 **PWA Support** | Full Web App Manifest, installable to home screen, standalone mode, dark/light theme adaptation |
| 📊 **Dashboard** | MCP service overview, device statistics, AI call log aggregation, Ollama real-time monitoring |
| 🗂️ **Project Matrix** | 140+ projects across 9 categories with search and filtering |
| ⚙️ **MCP Management** | Server CRUD, enable/disable toggling, category management, timeout configuration |
| 📡 **Status Monitor** | Health checks for 7 devices, Ollama service status, MCP call logs |

### Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router + Turbopack) |
| **Language** | [TypeScript 5.7](https://typescriptlang.org) |
| **UI System** | [React 19](https://react.dev) + [Radix UI](https://radix-ui.com) + [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| **AI Engine** | Zhipu GLM (OpenAI Compatible) / Ollama (Qwen 2.5, etc.) / Custom Provider |
| **Database** | PostgreSQL ([postgres.js](https://github.com/porsager/postgres)) |
| **Storage** | IndexedDB (chat persistence) / localStorage (model config persistence) |
| **Package Manager** | [pnpm](https://pnpm.io) 11 Workspace (Monorepo) |
| **Build** | [Turborepo](https://turbo.build) |
| **Testing** | [Vitest](https://vitest.dev) 4 + [Testing Library](https://testing-library.com) |
| **Deployment** | Vercel / Self-hosted |

### Quick Start

```bash
# Clone repository
git clone git@github.com:YYC-Cube/YYC3-Bot.git
cd yyc3-bot

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local

# Start development server
pnpm dev
```

Visit [http://localhost:3141](http://localhost:3141)

### AI Chat Architecture

```
┌─────────────────────────────────────────┐
│         AiChatProvider (Global)          │
│  ┌───────────────────────────────────┐  │
│  │     AiAssistant (Floating Panel)   │  │
│  │  ┌─────────┐ ┌─────────────────┐  │  │
│  │  │ Header  │ │ Model Selector   │  │  │
│  │  ├─────────┤ ├─────────────────┤  │  │
│  │  │ Chat    │ │ SSE Streaming   │  │  │
│  │  │ Area    │ │ Real-time UI    │  │  │
│  │  ├─────────┤ ├─────────────────┤  │  │
│  │  │ Input   │ │ Enter to Send   │  │  │
│  │  └─────────┘ └─────────────────┘  │  │
│  └───────────────────────────────────┘  │
│                                          │
│  ┌───────────────────────────────────┐  │
│  │    SettingsPanel                   │  │
│  │  · Model list + switching          │  │
│  │  · Add/Edit/Delete Provider        │  │
│  │  · Local Ollama scan               │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Model Configuration

| Feature | Description |
|---------|-------------|
| **Multi-Provider** | Zhipu API (OpenAI compatible), Ollama (local), extendable to custom providers |
| **Hot-Swap** | One-click model switch from header dropdown, takes effect immediately |
| **Self-Edit** | Add/edit/delete providers in settings panel, modify name/model/baseUrl/apiKey |
| **Local Scan** | Auto-scan `localhost:11434/api/tags` to list available Ollama models |
| **Persistence** | Model config persisted via IndexedDB, survives page refresh |

### PWA Support

| Feature | Configuration |
|---------|---------------|
| **Web App Manifest** | `public/manifest.json` — name, icons, theme color, standalone display |
| **Install to Home Screen** | `display: standalone` — native app experience |
| **Adaptive Theme** | Dark `#18181b` / Light `#ffffff` via media query |
| **Apple Support** | `apple-touch-icon`, `apple-mobile-web-app-capable`, `status-bar-style` |
| **Icon Set** | 16×16 to 512×512 full coverage, with maskable support |
| **Screenshots** | Main interface screenshot for app store installation guidance |

### Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# With coverage
pnpm test -- --coverage
```

```
 Test Files  5 passed (5)
      Tests  44 passed (44)
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (Turbopack, port 3141) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | ESLint check |
| `pnpm test` | Run tests (Vitest) |
| `pnpm test:watch` | Watch mode tests |

### Monorepo Packages

| Package | Path | Description |
|---------|------|-------------|
| `@yyc3/ai` | `packages/ai/` | AI provider adapters (Zhipu GLM / Ollama), dynamic model API |
| `@yyc3/core` | `packages/core/` | Brand constants, type definitions, utilities (cn, etc.) |
| `@yyc3/hooks` | `packages/hooks/` | React Hooks (useMobile, etc.) |
| `@yyc3/ui` | `packages/ui/` | Business components (BrandHeader, ProjectCard, DeviceCard, etc.) |
| `@yyc3/eslint-config` | `packages/eslint-config/` | Shared ESLint configuration |
| `@yyc3/tsconfig` | `packages/tsconfig/` | Shared TypeScript configuration |

### API Routes

| Method | Path | Description | Dynamic Model |
|--------|------|-------------|:---:|
| POST | `/api/chat` | AI Chat (SSE streaming, auto or custom provider) | ✅ |
| GET | `/api/ollama/models` | Scan local Ollama models | — |
| GET | `/api/health` | Device health check data | — |
| GET | `/api/status` | Ollama + device aggregated status | — |
| GET | `/api/projects?q=&category=` | Project list (search/filter) | — |
| GET | `/api/mcp/servers` | MCP server list | — |
| POST | `/api/mcp/servers` | Create MCP server | — |
| PUT | `/api/mcp/servers` | Update MCP server | — |
| GET | `/api/mcp/call-logs` | MCP call logs | — |

### Environment Variables

```env
# Database (optional)
DATABASE_URL="postgresql://user:password@localhost:5432/yyc3_mcp"

# AI Provider
ZHIPU_API_KEY="your_zhipu_api_key"
ZHIPU_BASE_URL="https://open.bigmodel.cn/api/paas/v4"

# Ollama (optional, defaults to localhost:11434)
OLLAMA_BASE_URL="http://localhost:11434"

# App config
NEXT_PUBLIC_APP_URL="http://localhost:3141"
```

### Team

**YanYuCloudCube Team** — [admin@0379.email](mailto:admin@0379.email)

### License

**Private** — Unauthorized use is prohibited.

<div align="center">

### 💡 Words Inspire Thousands of Lines of Code, Language Pivots the Intelligence of All Things

</div>

</details>
