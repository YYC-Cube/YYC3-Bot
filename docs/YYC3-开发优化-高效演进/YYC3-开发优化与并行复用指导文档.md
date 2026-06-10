---
file: YYC3-开发优化与并行复用指导文档.md
description: YYC³ 教科书级开发优化 · 架构复用 · UI复用 · 代码复用 · 测试复用 · 并行复用全链路指导
author: YanYuCloudCube Team <admin@0379.email>
version: v1.0.0
created: 2026-04-25
updated: 2026-04-25
status: active
tags: [架构],[复用],[优化],[指导],[规范]
category: technical
language: zh-CN
audience: developers
complexity: expert
---

> ***YanYuCloudCube***
> *言启象限 · 语枢未来*

---

# YYC³ 开发优化与并行复用指导文档

**适用范围**：YYC³ 全系列 140+ 项目（Next.js + React + Vue + shadcn/ui + pnpm）
**目标读者**：一人全栈开发者
**核心目标**：从「140 个孤岛项目」进化为「1 个核心 + N 个业务应用」的复用生态

---

## 📋 目录

- [第一章：问题诊断](#第一章问题诊断)
- [第二章：架构复用](#第二章架构复用)
- [第三章：UI 复用](#第三章ui-复用)
- [第四章：代码复用](#第四章代码复用)
- [第五章：测试复用](#第五章测试复用)
- [第六章：并行复用](#第六章并行复用)
- [第七章：实施路线图](#第七章实施路线图)

---

# 第一章：问题诊断

## 1.1 现状分析

```
当前 YYC³ 项目矩阵:

YY-Nexus (70+ 仓库)
├── AI-Application (17)    AI-LLM (5)    AI-Platform (8)
├── Edu (3)                Office (2)    Tools (4)
├── Tools-DevTemplate (12) Tools-Env (4) Platform-Cloud (20)
├── Platform-Management (7) Personal (9)  Other (27)

YYC-Cube-AB (40+ 项目)
├── YYC-Cube-ai/           YYC-Cube-platform/    YYC-Cube-business/
├── YYC-Cube-tools/        YYC-Cube-backend/     YYC3-Cube/ (核心)
├── YYC3-Family-AI/        YanYuCloudCube/       企业框架/
└── public/ (品牌资产)

YYC-Management (30+ 项目)
├── yyc3-ai/    yyc3-os/    YY-AI/     YY--/
├── yyc3-e/     yyc3-md/    yyc3-fun/  yyc3-music/
└── zhou-AI/    yyc3-0009/  yyc3-yy/   ...
```

## 1.2 核心问题

| 问题 | 现象 | 影响 |
|------|------|------|
| **代码重复** | 60+ 个项目各自独立 utils.ts、cn() 函数 | 修改一处需要改 60+ 处 |
| **依赖版本混乱** | Next.js 14 / 15 / 16 并存，React 18 / 19 并存 | 升级困难、安全漏洞 |
| **UI 组件重复** | 每个项目独立安装 shadcn/ui，60+ 套 button.tsx | 样式不统一、维护成本高 |
| **配置重复** | 每个项目独立 tsconfig.json、next.config.mjs、components.json | 配置不一致、容易出错 |
| **无共享层** | 没有 monorepo、没有共享包、没有内部 npm registry | 完全无法复用 |
| **测试缺失** | 140+ 项目几乎没有测试覆盖 | 改动即风险 |

## 1.3 目标架构

```
┌─────────────────────────────────────────────────────────────┐
│                   YYC³ 复用生态架构                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  yyc3-bot (统一门户)                                 │   │
│  │  140+ 项目的导航、监控、AI 助手、设备管理             │   │
│  └─────────────────────┬───────────────────────────────┘   │
│                        │ 引用                               │
│  ┌─────────────────────▼───────────────────────────────┐   │
│  │  @yyc3/ui          共享 UI 组件库 (shadcn/ui 扩展)   │   │
│  │  @yyc3/core         共享工具函数、类型、常量          │   │
│  │  @yyc3/config       共享配置 (ESLint/Prettier/TS)    │   │
│  │  @yyc3/hooks        共享 React Hooks                 │   │
│  │  @yyc3/ai           AI 能力封装 (MCP/LLM)            │   │
│  │  @yyc3/test-utils   共享测试工具                     │   │
│  └─────────────────────┬───────────────────────────────┘   │
│                        │ 被引用                             │
│  ┌─────────────────────▼───────────────────────────────┐   │
│  │  yyc3-ai-app    yyc3-edu     yyc3-medical  ...      │   │
│  │  (业务应用：只写业务逻辑，其余全部从共享包获取)       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 第二章：架构复用

## 2.1 Monorepo 方案选型

**推荐方案：pnpm workspace + Turborepo**

选择理由：
- 您已全面使用 pnpm，零迁移成本
- Turborepo 增量构建，一人团队构建速度优先
- 不需要引入 Nx 的学习曲线

### 目录结构

```
yyc3-monorepo/
├── apps/
│   ├── yyc3-bot/              # 门户 (当前项目，已有)
│   ├── yyc3-ai-app/           # AI 对话应用 (从 YY-Nexus 迁移)
│   ├── yyc3-edu/              # 教育平台 (从 YY-Nexus 迁移)
│   └── yyc3-landing/          # SaaS 落地页生成器
│
├── packages/
│   ├── ui/                    # @yyc3/ui - 共享组件库
│   ├── core/                  # @yyc3/core - 工具函数
│   ├── config/                # @yyc3/config - 共享配置
│   ├── hooks/                 # @yyc3/hooks - React Hooks
│   ├── ai/                    # @yyc3/ai - AI 能力
│   ├── tsconfig/              # @yyc3/tsconfig - TypeScript 配置
│   └── eslint-config/         # @yyc3/eslint-config - ESLint 配置
│
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
└── .gitignore
```

### 初始化命令

```bash
# 创建 monorepo 根目录
mkdir yyc3-monorepo && cd yyc3-monorepo

# 初始化根 package.json
pnpm init

# 创建 workspace 配置
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - "apps/*"
  - "packages/*"
EOF

# 安装 Turborepo
pnpm add -Dw turbo

# 创建目录结构
mkdir -p apps packages
```

### turbo.json 配置

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

### 根 package.json

```json
{
  "name": "yyc3-monorepo",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "test": "turbo test",
    "dev:bot": "turbo dev --filter=yyc3-bot",
    "dev:ai": "turbo dev --filter=yyc3-ai-app"
  },
  "devDependencies": {
    "turbo": "^2.5.0"
  },
  "packageManager": "pnpm@10.12.0"
}
```

## 2.2 共享 TypeScript 配置

### packages/tsconfig/

**packages/tsconfig/base.json**（所有项目通用）：
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "target": "ES2022",
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true,
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**packages/tsconfig/next.json**（Next.js 项目继承）：
```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "preserve",
    "allowJs": true,
    "noEmit": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**业务项目使用**（只需 3 行）：
```json
{
  "extends": "@yyc3/tsconfig/next.json"
}
```

## 2.3 共享 ESLint 配置

### packages/eslint-config/

**packages/eslint-config/next.js**：
```javascript
const { resolve } = require("node:path")

const project = resolve(process.cwd(), "tsconfig.json")

module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ].map(require.resolve),
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  settings: {
    react: { version: "detect" },
    "import/resolver": { typescript: { project } },
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
  },
}
```

**package.json**：
```json
{
  "name": "@yyc3/eslint-config",
  "version": "1.0.0",
  "main": "next.js",
  "dependencies": {
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "eslint-config-prettier": "^10.0.0",
    "eslint-plugin-react": "^7.37.0",
    "eslint-plugin-react-hooks": "^5.2.0"
  }
}
```

**业务项目使用**：
```json
{
  "eslintConfig": {
    "extends": "@yyc3/eslint-config"
  }
}
```

---

# 第三章：UI 复用

## 3.1 问题：60+ 套 button.tsx

当前每个项目都独立运行 `npx shadcn-ui@latest add button`，导致：
- 60 份 button.tsx 完全相同但独立维护
- 修改按钮样式需要改 60 个文件
- 不同项目可能使用不同版本的 shadcn/ui

## 3.2 解决方案：@yyc3/ui 共享组件库

### packages/ui/ 结构

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── sheet.tsx
│   │   ├── tabs.tsx
│   │   ├── table.tsx
│   │   ├── form.tsx
│   │   ├── chart.tsx
│   │   ├── sidebar.tsx
│   │   ├── command.tsx
│   │   └── ... (按需添加)
│   │
│   ├── yyc3/                    ← YYC³ 自定义扩展组件
│   │   ├── philosophy-card.tsx  ← 五高五标五化五维卡片
│   │   ├── brand-header.tsx     ← 统一品牌 Header
│   │   ├── brand-footer.tsx     ← 统一品牌 Footer
│   │   ├── spline-scene.tsx     ← 3D 场景封装
│   │   ├── ai-chat-panel.tsx   ← AI 对话面板
│   │   ├── project-card.tsx    ← 项目矩阵卡片
│   │   ├── mcp-status.tsx      ← MCP 状态组件
│   │   └── device-card.tsx     ← 设备状态卡片
│   │
│   └── index.ts                 ← 统一导出
│
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

### package.json

```json
{
  "name": "@yyc3/ui",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./yyc3": "./src/yyc3/index.ts"
  },
  "dependencies": {
    "@radix-ui/react-dialog": "latest",
    "@radix-ui/react-tabs": "latest",
    "@radix-ui/react-scroll-area": "latest",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.5.0",
    "lucide-react": "^1.11.0",
    "recharts": "^3.8.0",
    "framer-motion": "latest",
    "sonner": "^2.0.0",
    "cmdk": "^1.1.0"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

### src/index.ts（统一导出）

```typescript
export * from "./components/button"
export * from "./components/card"
export * from "./components/input"
export * from "./components/dialog"
export * from "./components/sheet"
export * from "./components/tabs"
export * from "./components/table"
export * from "./components/form"
export * from "./components/chart"
export * from "./components/sidebar"
export * from "./components/command"
export * from "./components/scroll-area"
export * from "./components/badge"
export * from "./components/avatar"
export * from "./components/tooltip"
export * from "./components/progress"
export * from "./components/separator"
export * from "./components/skeleton"
export * from "./components/toast"
export * from "./components/toaster"
export * from "./components/sonner"
export * from "./components/spinner"
export * from "./components/pagination"
export * from "./components/select"
export * from "./components/switch"
export * from "./components/slider"
export * from "./components/accordion"
export * from "./components/collapsible"
export * from "./components/dropdown-menu"
export * from "./components/popover"
export * from "./components/hover-card"
export * from "./components/navigation-menu"
export * from "./components/menubar"
export * from "./components/context-menu"
export * from "./components/alert"
export * from "./components/alert-dialog"
export * from "./components/aspect-ratio"
export * from "./components/checkbox"
export * from "./components/radio-group"
export * from "./components/toggle"
export * from "./components/toggle-group"
export * from "./components/resizable"
export * from "./components/calendar"
export * from "./components/carousel"
export * from "./components/drawer"
export * from "./components/breadcrumb"
export * from "./components/kbd"
export * from "./components/label"
export * from "./components/textarea"

export * from "./yyc3/philosophy-card"
export * from "./yyc3/brand-header"
export * from "./yyc3/brand-footer"
export * from "./yyc3/spline-scene"
export * from "./yyc3/ai-chat-panel"
export * from "./yyc3/project-card"
export * from "./yyc3/mcp-status"
export * from "./yyc3/device-card"
```

### 3.3 YYC³ 自定义组件示例

**src/yyc3/brand-header.tsx**：

```typescript
import NextImage from "next/image"
import { cn } from "@yyc3/core"

interface BrandHeaderProps {
  className?: string
  showLogo?: boolean
}

export function BrandHeader({ className, showLogo = true }: BrandHeaderProps) {
  return (
    <header
      className={cn(
        "z-30 shrink-0 px-4 py-3 md:px-6 md:py-4",
        "flex justify-between items-center bg-black/90 text-white",
        className
      )}
    >
      <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/60">
        Est. 2025
      </span>
      <div className="flex items-center gap-2.5">
        {showLogo && (
          <NextImage
            src="/yyc3-dist/yanyu_cloud_64x64.png"
            alt="YYC³"
            width={32}
            height={32}
            className="rounded shrink-0"
          />
        )}
        <span className="text-base md:text-lg font-semibold tracking-tight font-sans whitespace-nowrap">
          YYC³ — YanYuCloudCube
        </span>
      </div>
      <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/60">
        言启象限 · 语枢未来
      </span>
    </header>
  )
}
```

**src/yyc3/brand-footer.tsx**：

```typescript
import { cn } from "@yyc3/core"

interface BrandFooterProps {
  className?: string
}

export function BrandFooter({ className }: BrandFooterProps) {
  return (
    <footer
      className={cn(
        "z-20 shrink-0 px-4 py-3 md:px-6 md:py-4",
        "flex justify-between items-center bg-black/90 text-white/50",
        className
      )}
    >
      <span className="text-[10px] md:text-xs uppercase tracking-[0.15em]">
        © 2025-2026 YYC³ Team. All Rights Reserved.
      </span>
      <span className="text-[10px] md:text-xs uppercase tracking-[0.15em]">
        admin@0379.email
      </span>
    </footer>
  )
}
```

**src/yyc3/philosophy-card.tsx**：

```typescript
import { cn } from "@yyc3/core"

const CARDS = [
  { label: "五高架构", content: "高可用 · 高性能 · 高安全 · 高扩展 · 高智能" },
  { label: "五标体系", content: "标准化 · 规范化 · 自动化 · 可视化 · 智能化" },
  { label: "五化转型", content: "流程化 · 数字化 · 生态化 · 工具化 · 服务化" },
  { label: "五维评估", content: "时间维 · 空间维 · 属性维 · 事件维 · 关联维" },
]

interface PhilosophyGridProps {
  className?: string
  columns?: 2 | 4
}

export function PhilosophyGrid({ className, columns = 2 }: PhilosophyGridProps) {
  return (
    <div
      className={cn(
        "grid gap-2 md:gap-3",
        columns === 2 ? "grid-cols-2" : "grid-cols-4"
      )}
    >
      {CARDS.map((card) => (
        <div
          key={card.label}
          className={cn(
            "bg-neutral-50/80 border border-neutral-100 rounded-md",
            "p-2.5 md:p-3 transition-colors hover:bg-neutral-100/80",
            className
          )}
        >
          <span className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-neutral-400 font-sans block mb-1">
            {card.label}
          </span>
          <span className="text-xs md:text-sm font-medium font-sans leading-relaxed">
            {card.content}
          </span>
        </div>
      ))}
    </div>
  )
}
```

### 3.4 业务项目使用

```typescript
// apps/yyc3-ai-app/app/page.tsx
import { BrandHeader, BrandFooter, PhilosophyGrid, Button } from "@yyc3/ui"

export default function Page() {
  return (
    <div className="h-screen flex flex-col">
      <BrandHeader />
      <main className="flex-1">
        <PhilosophyGrid />
        <Button>开始对话</Button>
      </main>
      <BrandFooter />
    </div>
  )
}
```

**零重复代码。修改 BrandHeader 样式？改一处，所有项目同步更新。**

---

# 第四章：代码复用

## 4.1 @yyc3/core — 共享工具函数

### packages/core/ 结构

```
packages/core/
├── src/
│   ├── cn.ts              ← className 合并 (当前 60+ 份)
│   ├── format.ts          ← 日期/数字格式化
│   ├── validate.ts        ← 通用验证函数
│   ├── constants.ts       ← 全局常量 (品牌信息等)
│   ├── types.ts           ← 共享 TypeScript 类型
│   ├── api.ts             ← API 请求封装
│   ├── storage.ts         ← localStorage/IndexedDB 封装
│   └── index.ts
├── package.json
└── tsconfig.json
```

### src/cn.ts

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### src/constants.ts

```typescript
export const BRAND = {
  name: "YanYuCloudCube",
  shortName: "YYC³",
  sloganCn: "言启象限 · 语枢未来",
  sloganEn: "Words Initiate Quadrants, Language Serves as Core for Future",
  visionCn: "万象归元于云枢 · 深栈智启新纪元",
  visionEn: "All things converge in cloud pivot; Deep stacks ignite a new era of intelligence",
  email: "admin@0379.email",
  established: 2025,
  copyright: "© 2025-2026 YYC³ Team. All Rights Reserved.",
} as const

export const API_CONFIG = {
  zhipuBaseUrl: "https://open.bigmodel.cn/api/paas/v4",
  ollamaBaseUrl: "http://localhost:11434",
} as const

export const PHILOSOPHY = {
  highs: { label: "五高架构", items: ["高可用", "高性能", "高安全", "高扩展", "高智能"] },
  standards: { label: "五标体系", items: ["标准化", "规范化", "自动化", "可视化", "智能化"] },
  transforms: { label: "五化转型", items: ["流程化", "数字化", "生态化", "工具化", "服务化"] },
  dimensions: { label: "五维评估", items: ["时间维", "空间维", "属性维", "事件维", "关联维"] },
} as const
```

### src/types.ts

```typescript
export interface Project {
  id: string
  name: string
  category: ProjectCategory
  description: string
  status: ProjectStatus
  techStack: string[]
  repository?: string
  url?: string
}

export type ProjectCategory =
  | "ai-application"
  | "ai-llm"
  | "ai-platform"
  | "education"
  | "office"
  | "tools"
  | "medical"
  | "entertainment"
  | "management"
  | "infrastructure"

export type ProjectStatus = "online" | "development" | "planning" | "deprecated" | "prototype"

export interface McpService {
  name: string
  type: "stdio" | "http"
  status: "online" | "offline" | "pending"
  tools: string[]
  quotaUsed?: number
  quotaTotal?: number
}

export interface Device {
  name: string
  hostname: string
  ip: string
  type: "workstation" | "server" | "compute" | "nas"
  status: "online" | "offline" | "unknown"
}
```

## 4.2 @yyc3/hooks — 共享 React Hooks

### packages/hooks/ 结构

```
packages/hooks/
├── src/
│   ├── use-mobile.ts       ← 响应式检测
│   ├── use-media-query.ts  ← 媒体查询
│   ├── use-local-storage.ts ← 本地存储
│   ├── use-debounce.ts     ← 防抖
│   ├── use-async.ts        ← 异步请求
│   └── index.ts
├── package.json
└── tsconfig.json
```

### src/use-mobile.ts

```typescript
import { useState, useEffect } from "react"
const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
```

### src/use-async.ts

```typescript
import { useState, useCallback, useEffect } from "react"

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useAsync<T>(
  asyncFn: () => Promise<T>,
  deps: unknown[] = []
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await asyncFn()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error })
    }
  }, deps)

  useEffect(() => {
    execute()
  }, [execute])

  return { ...state, refetch: execute }
}
```

## 4.3 @yyc3/ai — AI 能力封装

### packages/ai/ 结构

```
packages/ai/
├── src/
│   ├── mcp-client.ts       ← MCP 协议客户端
│   ├── zhipu.ts            ← 智谱 GLM-5 封装
│   ├── ollama.ts           ← Ollama 本地推理封装
│   ├── chat.ts             ← 对话能力封装
│   ├── vision.ts           ← 视觉分析封装
│   ├── search.ts           ← 网络搜索封装
│   └── index.ts
├── package.json
└── tsconfig.json
```

### src/mcp-client.ts

```typescript
const MCP_BASE_URL = "/api/mcp"

export class McpClient {
  static async search(query: string, limit = 5) {
    const res = await fetch(`${MCP_BASE_URL}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, limit }),
    })
    return res.json()
  }

  static async read(url: string) {
    const res = await fetch(`${MCP_BASE_URL}/reader`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
    return res.json()
  }

  static async vision(image: string, prompt: string) {
    const res = await fetch(`${MCP_BASE_URL}/vision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image, prompt }),
    })
    return res.json()
  }

  static async chat(messages: Array<{ role: string; content: string }>) {
    const res = await fetch(`${MCP_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    })
    return res.json()
  }
}
```

## 4.4 从 140 个 utils.ts 迁移到 @yyc3/core

### 迁移步骤

```
Step 1: 创建 @yyc3/core，放入 cn() 函数
Step 2: 每个业务项目的 utils.ts 改为:
        export { cn } from "@yyc3/core"
        (保持向后兼容，其他项目不需要改 import 路径)
Step 3: 新项目直接 import { cn } from "@yyc3/core"
Step 4: 逐步删除各项目独立的 cn() 定义
```

---

# 第五章：测试复用

## 5.1 @yyc3/test-utils — 共享测试工具

### packages/test-utils/ 结构

```
packages/test-utils/
├── src/
│   ├── render.tsx          ← 自定义 render 函数
│   ├── mock-data.ts        ← 通用 mock 数据
│   ├── mock-server.ts      ← MSW 服务端 mock
│   └── index.ts
├── package.json
└── tsconfig.json
```

### src/render.tsx

```typescript
import { render, type RenderOptions } from "@testing-library/react"
import { type ReactElement } from "react"

function AllProviders({ children }: { children: React.ReactNode }) {
  return children
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, { wrapper: AllProviders, ...options })
}

export * from "@testing-library/react"
export { renderWithProviders as render }
```

### src/mock-data.ts

```typescript
import type { Project, McpService, Device } from "@yyc3/core"

export const mockProjects: Project[] = [
  {
    id: "yyc3-bot",
    name: "YYC³ Bot",
    category: "ai-application",
    description: "YYC³ 智能应用门户",
    status: "development",
    techStack: ["Next.js", "React", "shadcn/ui"],
  },
]

export const mockMcpServices: McpService[] = [
  {
    name: "web-search-prime",
    type: "http",
    status: "online",
    tools: ["webSearchPrime"],
    quotaUsed: 2680,
    quotaTotal: 4000,
  },
]

export const mockDevices: Device[] = [
  {
    name: "MacBook M4 Max",
    hostname: "yyc3-22",
    ip: "192.168.3.22",
    type: "workstation",
    status: "online",
  },
]
```

## 5.2 Vitest 配置复用

### packages/config/vitest.config.ts

```typescript
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
})
```

## 5.3 测试策略（一人团队务实版）

```
优先级：

P0 — 共享包必须测试
├── @yyc3/core     → cn(), format, validate (纯函数，测试成本极低)
├── @yyc3/ai       → mcp-client, chat 封装 (mock API 测试)
└── @yyc3/ui       → 组件渲染快照测试 (自动生成)

P1 — 核心业务流程测试
├── yyc3-bot       → 首页渲染、项目导航、AI 对话流程
└── yyc3-ai-app    → 对话消息流、Agent 调度

P2 — E2E 关键路径
└── 仅测试：首页加载 → 项目导航 → AI 对话 (3 条路径)
```

---

# 第六章：并行复用

## 6.1 什么是「并行复用」

一人同时开发 3 个项目，共享同一套基础代码，改一处全部受益。

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  yyc3-bot   │  │ yyc3-ai-app │  │  yyc3-edu   │
│  (门户)     │  │  (AI对话)   │  │  (教育)     │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       └────────────────┼────────────────┘
                        │
       ┌────────────────▼────────────────┐
       │         @yyc3/ui                │
       │         @yyc3/core              │
       │         @yyc3/hooks             │
       │         @yyc3/ai                │
       │         @yyc3/tsconfig          │
       │         @yyc3/eslint-config     │
       │         @yyc3/test-utils        │
       └─────────────────────────────────┘
```

## 6.2 开发工作流

### 日常开发

```bash
# 同时启动多个项目 (Turborepo 并行)
pnpm dev

# 只启动特定项目
pnpm dev:bot        # 只启动门户
pnpm dev:ai         # 只启动 AI 应用

# 构建所有项目 (并行 + 缓存)
pnpm build

# 只构建变更过的项目 (增量)
pnpm build --filter=... 
```

### 新建项目流程

```bash
# 1. 从模板创建
mkdir apps/yyc3-new-project
cd apps/yyc3-new-project
pnpm init

# 2. 安装共享依赖
pnpm add @yyc3/ui @yyc3/core @yyc3/hooks @yyc3/ai

# 3. 创建最小文件
#    - app/layout.tsx  (引用 BrandHeader/BrandFooter)
#    - app/page.tsx    (业务逻辑)
#    - next.config.mjs (复制模板)
#    - tsconfig.json   (extends @yyc3/tsconfig)

# 4. 开始开发 (只写业务代码)
pnpm dev --filter=yyc3-new-project
```

### 最小项目模板

**apps/yyc3-new-project/package.json**：
```json
{
  "name": "yyc3-new-project",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint ."
  },
  "dependencies": {
    "@yyc3/ui": "workspace:*",
    "@yyc3/core": "workspace:*",
    "@yyc3/hooks": "workspace:*",
    "next": "^16.2.4",
    "react": "^19.2.5",
    "react-dom": "^19.2.5"
  },
  "devDependencies": {
    "@yyc3/tsconfig": "workspace:*",
    "@yyc3/eslint-config": "workspace:*",
    "@tailwindcss/postcss": "^4.2.4",
    "tailwindcss": "^4.2.4",
    "typescript": "^6.0.3"
  }
}
```

**apps/yyc3-new-project/app/layout.tsx**：
```typescript
import { BrandHeader, BrandFooter } from "@yyc3/ui"
import "@yyc3/ui/styles"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        <div className="h-screen flex flex-col">
          <BrandHeader />
          <main className="flex-1">{children}</main>
          <BrandFooter />
        </div>
      </body>
    </html>
  )
}
```

**apps/yyc3-new-project/app/page.tsx**：
```typescript
import { PhilosophyGrid, Button } from "@yyc3/ui"
import { BRAND } from "@yyc3/core"

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold">{BRAND.shortName}</h1>
      <p className="mt-2 text-neutral-500">{BRAND.sloganCn}</p>
      <div className="mt-8 w-full max-w-lg">
        <PhilosophyGrid />
      </div>
      <Button className="mt-8">开始使用</Button>
    </div>
  )
}
```

**就这样。4 个文件，一个完整项目。**

## 6.3 版本同步策略

```bash
# 统一升级 Next.js
pnpm update next --recursive

# 统一升级 React
pnpm update react react-dom --recursive

# 统一升级 Radix UI
pnpm update @radix-ui/* --recursive

# 查看过时依赖
pnpm outdated --recursive
```

## 6.4 Vue 项目适配

您有 Vue 项目（yyc3-other-vue），monorepo 同样支持：

```
apps/
├── yyc3-bot/          # Next.js 门户
├── yyc3-ai-app/       # Next.js AI 应用
└── yyc3-vue-app/      # Vue 应用 (独立)
```

Vue 项目可共享：
- `@yyc3/core`（纯 JS 工具函数，框架无关）
- `@yyc3/tsconfig`
- `@yyc3/eslint-config`
- `@yyc3/test-utils`（部分）

Vue 项目不共享：
- `@yyc3/ui`（React 专用，Vue 项目用 shadcn-vue 或自定义）
- `@yyc3/hooks`（React Hooks，Vue 用 composables）

---

# 第七章：实施路线图

## Phase 0：基础搭建（本周）

```
Day 1-2: 创建 monorepo 结构
├── 初始化 pnpm workspace + Turborepo
├── 创建 packages/core (cn + constants + types)
├── 创建 packages/tsconfig
└── 创建 packages/eslint-config

Day 3-4: 迁移 yyc3-bot 到 monorepo
├── 移动当前项目到 apps/yyc3-bot/
├── 替换本地 utils.ts 为 @yyc3/core
├── 替换本地 components 为 @yyc3/ui
└── 验证 pnpm dev 正常运行

Day 5: 创建 @yyc3/ui 共享组件
├── 从 yyc3-bot 抽取 60 个 UI 组件到 packages/ui
├── 创建 yyc3/ 自定义组件 (BrandHeader 等)
└── 验证 yyc3-bot 引用 @yyc3/ui 正常
```

## Phase 1：门户核心（第 2 周）

```
Day 1-3: /projects 项目矩阵页
├── 从 3 个代码仓扫描项目信息
├── 生成静态 projects.json 数据文件
├── 使用 Card + Tabs + Command 构建
└── 按分类筛选 + 搜索

Day 4-5: /status 状态监控页
├── 设备状态展示 (从 .env.yyc3/.config 读取)
├── MCP 服务状态 + 配额
└── Card + Progress + Badge
```

## Phase 2：AI 增强（第 3-4 周）

```
Week 3: /chat AI 对话页
├── @yyc3/ai MCP 客户端封装
├── Sheet 侧滑面板 + ScrollArea 消息流
├── SSE 流式响应
└── Agent 状态展示

Week 4: /docs 知识库浏览器
├── Sidebar + Collapsible 导航
├── 使用 MCP zread 读取仓库结构
└── Command 全局搜索
```

## Phase 3：复用扩展（第 5 周起）

```
Week 5+: 迁移已有项目到 monorepo
├── 选择最活跃的 3-5 个项目先迁移
├── 每个项目只保留业务代码
├── 共享部分全部引用 packages/*
└── 逐步迁移更多项目
```

---

## 📊 预期收益量化

| 指标 | 当前 | 复用后 | 改善 |
|------|------|--------|------|
| 新项目启动时间 | 2-4 小时 | **15 分钟** | 90% ↓ |
| UI 组件维护点 | 60+ 处 | **1 处** | 98% ↓ |
| utils.ts 副本 | 60+ 份 | **1 份** | 98% ↓ |
| 配置文件维护 | 60+ 套 | **1 套** | 98% ↓ |
| 依赖升级工作量 | 60+ 项目逐个 | **1 条命令** | 95% ↓ |
| 样式一致性 | 无法保证 | **100% 统一** | ✅ |
| 测试覆盖 | ~0% | **共享包 > 80%** | ✅ |

---

<div align="center">

> 「***YanYuCloudCube***」 | 「***<admin@0379.email>***」
> **© 2025-2026 YYC³ Team. All Rights Reserved.**
</div>
