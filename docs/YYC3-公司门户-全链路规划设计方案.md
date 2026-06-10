---
file: YYC3-公司门户-全链路规划设计方案.md
description: YYC³ 公司门户全链路规划设计方案 · 三种方案对比 · 基于知识库资产与现有技术栈
author: YanYuCloudCube Team <admin@0379.email>
version: v1.0.0
created: 2026-04-25
updated: 2026-04-25
status: active
tags: [规划],[方案],[门户],[全链路]
category: project
language: zh-CN
audience: developers,managers,stakeholders
complexity: advanced
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

# YYC³ 公司门户 — 全链路规划设计方案

**文档版本**：v1.0.0
**生成日期**：2026-04-25
**知识库基线**：`/Volumes/Knowledge/YYC3-AI-Skill-KB`
**技术栈基线**：Next.js 16 + React 19 + shadcn/ui + Spline 3D + Tailwind CSS v4
**MCP 能力**：智谱 GLM-5 (视觉/搜索/阅读/代码) + Ollama 本地推理
**五维评估基准**：时间维 · 空间维 · 属性维 · 事件维 · 关联维

---

## 📋 目录

- [知识库资产盘点](#知识库资产盘点)
- [方案一：AI 智能体门户（Agent-First）](#方案一ai-智能体门户agent-first)
- [方案二：企业数据中枢门户（Data-Driven）](#方案二企业数据中枢门户data-driven)
- [方案三：开发者生态门户（Ecosystem-Platform）](#方案三开发者生态门户ecosystem-platform)
- [三方案对比矩阵](#三方案对比矩阵)
- [技术实现路径](#技术实现路径)
- [MCP 集成架构](#mcp-集成架构)

---

## 知识库资产盘点

### 可直接复用的核心资产

| 来源                | 资产                                                                       | 复用方式                                 |
| ------------------- | -------------------------------------------------------------------------- | ---------------------------------------- |
| **Tools-A**         | 112 个 Claude Agent + 72 个专注插件 + 146 个 Skills                        | Agent 编排引擎、团队协作模式、工作流模板 |
| **Tools-B**         | agent-browser (AI 浏览器自动化) + buildwithclaude (100+ Agents/Skills)     | 智能体可视化操作、浏览器集成测试         |
| **Tools-C**         | MCP Go SDK + Playwright MCP + VS Code Skills + Lucide 图标 (1000+)         | MCP 协议层、端到端测试、图标体系         |
| **Tools-D**         | node-semver + ruby-lsp + TypeScript-TmLanguage + vscode-R                  | 版本管理、多语言 LSP、代码高亮           |
| **插件系统/Agent**  | Theme Factory (10 套专业主题) + 多语言 Pro Agent                           | 主题切换系统、多语言开发支持             |
| **插件系统/提示词** | 150+ 专业提示词（deep-research、ui-ux-pro-max、tailwind-design-system 等） | AI 对话引擎技能库                        |
| **插件系统/MCP**    | GitLab MCP + Serena MCP                                                    | 代码仓库集成、项目分析                   |
| **apollo**          | Apollo 配置中心                                                            | 配置管理方案参考                         |
| **mui-x**           | MUI X 高级组件 (DataGrid、Charts、Tree View)                               | 企业级数据展示组件参考                   |
| **onlook**          | 可视化编辑器 + AI 设计工具                                                 | 低代码/可视化页面编辑参考                |
| **redux**           | Redux 状态管理                                                             | 复杂状态管理参考                         |
| **技能知识**        | assert + emmet + lucide + marked                                           | 测试、代码生成、图标、Markdown 解析      |

### MCP 服务配置（已就绪）

```
┌─────────────────────────────────────────────────────────┐
│                  YYC³ MCP 服务矩阵                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🔮 zai-vision-mcp (本地 stdio)                         │
│  ├── ui_to_artifact       UI截图生成代码                 │
│  ├── extract_text         截图文字提取                   │
│  ├── diagnose_error       错误截图诊断                   │
│  ├── understand_diagram   技术图表理解                   │
│  ├── analyze_data_viz     数据可视化分析                 │
│  ├── ui_diff_check        UI差异对比                     │
│  ├── image_analysis       图片分析                       │
│  └── video_analysis       视频分析                       │
│                                                         │
│  🔍 web-search-prime (远程 HTTP)                        │
│  └── webSearchPrime       实时网络搜索                   │
│                                                         │
│  📖 web-reader (远程 HTTP)                              │
│  └── webReader            网页内容读取                   │
│                                                         │
│  📚 zread (远程 HTTP)                                   │
│  ├── search_doc           文档搜索                       │
│  ├── get_repo_structure   仓库结构获取                   │
│  └── read_file            文件内容读取                   │
│                                                         │
│  🤖 Ollama (本地推理)                                   │
│  └── localhost:11434      本地模型推理兜底               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 方案一：AI 智能体门户（Agent-First）

### 定位

以 AI 多智能体为核心交互范式的公司门户。用户通过自然语言与 Spline 3D 机器人对话，驱动多 Agent 协作完成业务任务。

### 核心理念映射

| 五高   | 实现                                                       |
| ------ | ---------------------------------------------------------- |
| 高可用 | Ollama 本地推理兜底 + 智谱 GLM-5 云端双链路                |
| 高性能 | SSE 流式响应 + 本地缓存 + 智能预加载                       |
| 高安全 | API_KEY 轮转 + 输入过滤 + Prompt 注入防护                  |
| 高扩展 | Skills 插件热插拔 + Agent 动态注册 + MCP 协议扩展          |
| 高智能 | 112 个 Agent 协同 + 150+ Skills + Theme Factory 自适应主题 |

### 全链路架构

```
用户 → Spline 3D 机器人 (首页)
         ↓ 自然语言
      对话引擎 (Sheet 侧滑面板)
         ↓ 意图识别
      Agent 路由器 (MCP 协议)
         ↓ 任务分发
      ┌──────────────────────────────┐
      │  Team Lead    → 任务协调      │
      │  Implementer  → 代码生成      │
      │  Reviewer     → 质量审查      │
      │  Debugger     → 故障排查      │
      │  Browser Agent → 网页自动化   │
      │  Vision Agent  → 图片/视频分析 │
      └──────────────────────────────┘
         ↓ 结果聚合
      可视化输出 (Card / Chart / Table / Code)
```

### 页面结构

| 路由         | 功能                     | 核心组件                                 |
| ------------ | ------------------------ | ---------------------------------------- |
| `/`          | 品牌首页 + 3D 机器人入口 | Spline + Sheet + Spotlight               |
| `/chat`      | 全屏对话界面             | ScrollArea + Avatar + Input + Badge      |
| `/agents`    | Agent 市场与管理         | Card + Tabs + Command + Dialog           |
| `/skills`    | 技能库浏览与安装         | Grid + Search + Accordion                |
| `/workspace` | 多 Agent 工作台          | Resizable + Sidebar + Tabs + Code Editor |
| `/settings`  | MCP 配置与 API 管理      | Form + Switch + Input + Toast            |

### 知识库素材映射

| 功能模块     | 素材来源                     | 具体资产                           |
| ------------ | ---------------------------- | ---------------------------------- |
| Agent 编排   | Tools-A/agents               | team-lead.md, conductor/, 72个插件 |
| 浏览器自动化 | Tools-B/agent-browser        | Rust CDP 引擎, Lightpanda          |
| Skills 系统  | Tools-B/buildwithclaude      | 100+ Skills 模板, Hooks 系统       |
| 视觉分析     | MCP/zai-vision-mcp           | 8个视觉工具                        |
| 网络搜索     | MCP/web-search-prime         | 实时搜索 API                       |
| 主题系统     | 插件系统/Agent/Theme Factory | 10套专业主题                       |

### 五维评估

| 维度   | 指标         | 目标值           |
| ------ | ------------ | ---------------- |
| 时间维 | 首字节响应   | < 200ms (流式)   |
| 空间维 | 运行时内存   | < 256MB (客户端) |
| 属性维 | Agent 可用率 | 112/112 (100%)   |
| 事件维 | 操作追踪覆盖 | 全链路 100%      |
| 关联维 | MCP 服务连通 | 5/5 (全部就绪)   |

---

## 方案二：企业数据中枢门户（Data-Driven）

### 定位

以数据可视化和业务分析为核心的公司门户。将 YYC³ 团队所有项目、知识库、运营指标集中展示，形成统一数据中枢。

### 核心理念映射

| 五高   | 实现                                        |
| ------ | ------------------------------------------- |
| 高可用 | ISR 增量静态再生 + CDN 全球分发             |
| 高性能 | Recharts 虚拟渲染 + 分页懒加载 + Redis 缓存 |
| 高安全 | RBAC 权限 + 数据脱敏 + API 网关鉴权         |
| 高扩展 | 微前端架构 + 插件化仪表盘 + 动态数据源注册  |
| 高智能 | MCP 搜索 + AI 数据解读 + 智能报告生成       |

### 全链路架构

```
用户 → 数据仪表盘首页
         ↓ 数据源注册
      ┌──────────────────────────────┐
      │  知识库数据源                  │
      │  ├── Tools-A (Agent 统计)     │
      │  ├── Tools-B (规范覆盖)       │
      │  ├── Tools-C (工具生态)       │
      │  └── Tools-D (语言支持)       │
      │                               │
      │  项目数据源                    │
      │  ├── yyc3-bot (门户指标)      │
      │  ├── yyc3-learning (学习)     │
      │  ├── yyc3-customer-care (客服) │
      │  └── YYC3-Cloud-Intelli-Matrix│
      │                               │
      │  运营数据源                    │
      │  ├── MCP 调用统计             │
      │  ├── API 配额监控             │
      │  └── 用户行为分析             │
      └──────────────────────────────┘
         ↓ 可视化渲染
      Chart + Card + Table + Progress
```

### 页面结构

| 路由         | 功能                  | 核心组件                                 |
| ------------ | --------------------- | ---------------------------------------- |
| `/`          | 品牌首页 (当前已实现) | Spline + Spotlight                       |
| `/dashboard` | 数据总览仪表盘        | Chart + Card + Tabs + Progress           |
| `/projects`  | 项目矩阵管理          | Table + Badge + Pagination + Dialog      |
| `/knowledge` | 知识库浏览器          | Sidebar + TreeView + Search + Breadcrumb |
| `/analytics` | 深度分析报告          | Recharts + Tabs + DatePicker + Export    |
| `/monitor`   | MCP 服务监控          | Progress + Badge + Alert + Toast         |

### 知识库素材映射

| 功能模块 | 素材来源            | 具体资产                        |
| -------- | ------------------- | ------------------------------- |
| 图表组件 | mui-x/Charts        | DataGrid Pro, Charts, Tree View |
| 图标体系 | Tools-C/lucide      | 1000+ SVG 图标                  |
| 配置中心 | apollo              | 分布式配置管理方案              |
| 版本管理 | Tools-D/node-semver | 语义化版本分析器                |
| 数据搜索 | MCP/zread           | 仓库结构 + 文件搜索             |
| 网页读取 | MCP/web-reader      | 竞品分析、数据采集              |

### 五维评估

| 维度   | 指标         | 目标值      |
| ------ | ------------ | ----------- |
| 时间维 | 仪表盘加载   | < 2s (首屏) |
| 空间维 | 数据缓存命中 | > 95%       |
| 属性维 | 数据准确率   | > 99.9%     |
| 事件维 | 指标刷新延迟 | < 30s       |
| 关联维 | 数据源连通   | N/N (全部)  |

---

## 方案三：开发者生态门户（Ecosystem-Platform）

### 定位

以开发者社区和技能生态为核心的公司门户。开放 YYC³ 知识库、Skills 市场、MCP 工具链，构建面向开发者的技术生态平台。

### 核心理念映射

| 五高   | 实现                                        |
| ------ | ------------------------------------------- |
| 高可用 | Vercel Edge + ISR + 本地 Ollama 兜底        |
| 高性能 | 静态预渲染 + Code Splitting + 按需加载      |
| 高安全 | OAuth2 + API_KEY 作用域 + Rate Limiting     |
| 高扩展 | Skills 市场热插拔 + MCP 注册表 + 插件沙箱   |
| 高智能 | AI 代码审查 + 智能文档生成 + 自动化测试建议 |

### 全链路架构

```
开发者 → 生态门户首页
           ↓ 探索
        ┌──────────────────────────────────┐
        │  Skills 市场 (150+ 技能)          │
        │  ├── 搜索/分类/评分/安装          │
        │  └── skill-creator 自动生成       │
        │                                   │
        │  MCP 工具链                       │
        │  ├── 服务注册表                   │
        │  ├── 在线调试器                   │
        │  └── 配置生成器                   │
        │                                   │
        │  知识库浏览器                     │
        │  ├── Tools-A/B/C/D 全库检索       │
        │  ├── 代码示例 (可在线运行)        │
        │  └── API 文档 (自动生成)          │
        │                                   │
        │  开发者工具                       │
        │  ├── 在线代码编辑器 (多语言 LSP)  │
        │  ├── Theme Factory (10套主题)     │
        │  └── 可视化设计器 (onlook 参考)   │
        └──────────────────────────────────┘
```

### 页面结构

| 路由           | 功能                  | 核心组件                                    |
| -------------- | --------------------- | ------------------------------------------- |
| `/`            | 品牌首页 (当前已实现) | Spline + Spotlight                          |
| `/marketplace` | Skills & Plugins 市场 | Grid + Card + Command + Badge               |
| `/tools`       | MCP 工具链管理        | Table + Dialog + Form + Tabs                |
| `/docs`        | 知识库文档中心        | Sidebar + Search + Collapsible + Breadcrumb |
| `/playground`  | 在线代码实验室        | Resizable + CodeEditor + Tabs + Drawer      |
| `/community`   | 开发者社区            | Avatar + Card + Tabs + Form + Toast         |

### 知识库素材映射

| 功能模块    | 素材来源                                  | 具体资产               |
| ----------- | ----------------------------------------- | ---------------------- |
| Skills 市场 | 插件系统/提示词 (150+)                    | 全部提示词模板         |
| MCP 工具    | 插件系统/gitlab + serena                  | .mcp.json 配置         |
| 多语言 LSP  | Tools-D/ruby-lsp + vscode-R + pyright     | LSP 集成方案           |
| 代码高亮    | Tools-D/TypeScript-TmLanguage + go-syntax | TextMate 语法          |
| 可视化编辑  | onlook                                    | AI 可视化设计器参考    |
| 主题系统    | 插件系统/Agent/Theme Factory              | 10套主题 + 自定义生成  |
| 状态管理    | redux                                     | Redux Toolkit 参考架构 |
| 音乐体验    | YesPlayMusic                              | 前端交互体验参考       |

### 五维评估

| 维度   | 指标            | 目标值            |
| ------ | --------------- | ----------------- |
| 时间维 | Skills 搜索响应 | < 100ms           |
| 空间维 | 首屏加载体积    | < 200KB (gzipped) |
| 属性维 | Skills 可用率   | 150/150 (100%)    |
| 事件维 | 安装/卸载追踪   | 100% 覆盖         |
| 关联维 | 开发者留存      | > 60% (7日)       |

---

## 三方案对比矩阵

| 维度             | 方案一：AI 智能体 | 方案二：数据中枢 | 方案三：开发者生态  |
| ---------------- | ----------------- | ---------------- | ------------------- |
| **核心定位**     | AI 对话驱动       | 数据可视化驱动   | 开发者工具驱动      |
| **技术复杂度**   | ⭐⭐⭐⭐⭐             | ⭐⭐⭐              | ⭐⭐⭐⭐                |
| **知识库利用率** | 85%               | 60%              | 95%                 |
| **MCP 利用深度** | 全部 5 个服务     | 3 个服务         | 4 个服务            |
| **组件复用率**   | ~40% (60 组件)    | ~50% (30 组件)   | ~60% (40 组件)      |
| **开发周期**     | 8-12 周           | 4-6 周           | 6-8 周              |
| **用户画像**     | 全员 / 客户       | 管理层 / 运营    | 开发者 / 合作伙伴   |
| **变现能力**     | SaaS 订阅         | 企业版授权       | 开放 API + 市场抽成 |
| **五高评分**     | 92/100            | 85/100           | 90/100              |
| **五标评分**     | 88/100            | 90/100           | 95/100              |
| **五化评分**     | 90/100            | 85/100           | 92/100              |
| **推荐场景**     | AI 产品展示       | 内部管理         | 技术品牌建设        |

### 推荐优先级

1. **🥇 方案二（数据中枢）**：开发周期最短，组件复用率最高，可快速上线验证
2. **🥈 方案一（AI 智能体）**：差异化最强，MCP 能力利用最充分，长期战略价值最高
3. **🥉 方案三（开发者生态）**：知识库利用率最高，生态壁垒最强，适合技术品牌阶段

### 渐进式融合路径

```
Phase 1 (4-6周)                    Phase 2 (4-6周)                    Phase 3 (持续)
┌──────────────────┐              ┌──────────────────┐              ┌──────────────────┐
│  方案二：数据中枢  │  ──迭代──→  │  融入方案一：      │  ──迭代──→  │  融入方案三：      │
│  ├── 仪表盘       │              │  AI 对话面板       │              │  Skills 市场       │
│  ├── 项目矩阵     │              │  Agent 路由        │              │  MCP 工具链        │
│  └── 知识库浏览   │              │  Skills 调用       │              │  开发者社区        │
└──────────────────┘              └──────────────────┘              └──────────────────┘
```

---

## 技术实现路径

### 统一技术栈

```
前端框架:    Next.js 16 (App Router + Turbopack + RSC)
UI 组件:     shadcn/ui (new-york) + Radix UI
3D/动画:     Spline + Framer Motion
表单验证:    react-hook-form + zod
图表:        Recharts 3.x
样式:        Tailwind CSS v4 + CSS 变量主题
状态管理:    React Context + Zustand (方案三可选 Redux)
包管理:      pnpm
部署:        Vercel + Docker
AI 服务:     智谱 GLM-5 (MCP) + Ollama (本地兜底)
```

### 目录结构规范

```
yyc3-bot/
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 品牌首页 (已实现)
│   ├── globals.css         # 全局样式 (已实现)
│   ├── chat/               # 方案一：AI 对话
│   ├── dashboard/          # 方案二：数据仪表盘
│   ├── marketplace/        # 方案三：Skills 市场
│   ├── agents/             # Agent 管理
│   ├── docs/               # 文档中心
│   ├── playground/         # 在线实验室
│   └── settings/           # 系统设置
├── components/
│   ├── ui/                 # shadcn/ui (60+ 组件已就绪)
│   ├── layout/             # 布局组件
│   ├── chat/               # 对话组件
│   ├── dashboard/          # 仪表盘组件
│   └── marketplace/        # 市场组件
├── lib/
│   ├── utils.ts            # 工具函数
│   ├── mcp/                # MCP 客户端封装
│   ├── agents/             # Agent 注册表
│   └── skills/             # Skills 加载器
├── hooks/                  # 自定义 Hooks
├── public/
│   ├── yyc3-dist/          # 品牌 Logo (已就绪)
│   └── ...
├── MCP/                    # MCP 配置 (已就绪)
└── docs/                   # 项目文档
```

---

## MCP 集成架构

### API 密钥管理

```
MCP/.env (已就绪)
├── ZHIPU_API_KEY    → 智谱 GLM-5 (视觉/搜索/阅读/代码)
├── OLLAMA_API_URL   → 本地推理服务
└── OLLAMA_API_KEY   → 本地认证
```

### MCP 调用流程

```
前端组件 → API Route (/api/mcp/*)
              ↓
          MCP Client (Server-Side)
              ↓
          ┌─────────────────────────┐
          │  zai-vision-mcp         │ → 图片/视频分析
          │  web-search-prime       │ → 实时网络搜索
          │  web-reader             │ → 网页内容提取
          │  zread                  │ → 代码仓库检索
          │  Ollama                 │ → 本地推理兜底
          └─────────────────────────┘
```

### 安全策略

- API_KEY 仅在 Server-Side API Route 中使用，不暴露给客户端
- 通过 Next.js Route Handlers 代理 MCP 请求
- 实现请求速率限制和配额管理
- 所有外部请求经过输入验证和清洗

---

## 变更历史

| 版本   | 日期       | 变更内容                         | 作者                |
| ------ | ---------- | -------------------------------- | ------------------- |
| v1.0.0 | 2026-04-25 | 初始版本，三种方案全链路规划设计 | YanYuCloudCube Team |

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

**© 2025-2026 YYC³ Team. All Rights Reserved.**
</div>
