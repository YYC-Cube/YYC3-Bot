---
file: YYC3-方案二-企业数据中枢门户-可视化设计文档.md
description: YYC³ 方案二 企业数据中枢门户 · 可视化组件罗列 · 功能预期 · 拓展方向
author: YanYuCloudCube Team <admin@0379.email>
version: v1.0.0
created: 2026-04-25
updated: 2026-04-25
status: active
tags: [方案],[数据],[仪表盘],[可视化]
category: design
language: zh-CN
audience: developers,managers
complexity: advanced
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*

---

# 方案二：企业数据中枢门户 — 可视化设计文档

---

## 🎯 定位

以数据可视化和业务分析为核心。将 YYC³ 团队所有项目、知识库、运营指标集中展示，形成统一数据中枢。**推荐优先实施——开发周期最短，组件复用率最高。**

---

## 🖼️ 页面架构可视化

### 仪表盘首页

```
┌─────────────────────────────────────────────────────────────────┐
│ Header: [Logo] YYC³ 数据中枢  [导航Tabs] [搜索] [设置] [头像]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ 📊 项目数 │  │ 🤖 Agent │  │ 📦 Skills│  │ 🔧 MCP   │       │
│  │    12    │  │   112    │  │   150+   │  │    5     │       │
│  │ ▲ +2 本月│  │ ▲ +15    │  │ ▲ +30    │  │ ● 全在线 │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                 │
│  ┌───────────────────────────────┐  ┌─────────────────────┐    │
│  │ 📈 知识库增长趋势              │  │ 🔮 MCP 调用统计     │    │
│  │                               │  │                     │    │
│  │    ╱╲    ╱╲╱╲                │  │  搜索 ████░░ 67%    │    │
│  │   ╱  ╲╱╱╯  ╲╱╲              │  │  阅读 ███░░░ 50%    │    │
│  │  ╱          ╲╱╲             │  │  视觉 ██░░░░ 33%    │    │
│  │                               │  │  代码 █░░░░░ 17%    │    │
│  │  [Chart: Recharts LineChart]  │  │  [Progress bars]    │    │
│  └───────────────────────────────┘  └─────────────────────┘    │
│                                                                 │
│  ┌───────────────────────────────┐  ┌─────────────────────┐    │
│  │ 🗂️ 项目矩阵                   │  │ 📋 最近活动          │    │
│  │                               │  │                     │    │
│  │ 名称        状态    进度      │  │ ● yyc3-bot 更新     │    │
│  │ yyc3-bot    🟢在线   85%     │  │ ● Skills +3         │    │
│  │ learning    🟡开发   45%     │  │ ● Agent 升级        │    │
│  │ customer    🟢在线   90%     │  │ ● MCP 配额 78%      │    │
│  │ matrix      🔵规划   10%     │  │ ● 文档更新          │    │
│  │                               │  │                     │    │
│  │  [Table + Badge + Progress]   │  │  [Card list]        │    │
│  └───────────────────────────────┘  └─────────────────────┘    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Footer: © 2025-2026 YYC³ Team            admin@0379.email      │
└─────────────────────────────────────────────────────────────────┘
```

### 知识库浏览器

```
┌─────────────────────────────────────────────────────────────────┐
│ Header                                                          │
├──────────┬──────────────────────────────────────────────────────┤
│          │  Breadcrumb: 知识库 > Tools-A > agents               │
│ Sidebar  │──────────────────────────────────────────────────────│
│          │                                                      │
│ 📁 Tools │  ┌────────────┐ ┌────────────┐ ┌────────────┐      │
│  ├── A   │  │ agents/    │ │ autocomplete│ │ claude-    │      │
│  ├── B   │  │ 112 Agent  │ │ 200+ 补全   │ │ plugins    │      │
│  ├── C   │  │ ★★★★★     │ │ ★★★★☆     │ │ ★★★★★     │      │
│  └── D   │  │ P0 核心    │ │ P0 核心    │ │ P0 核心    │      │
│          │  └────────────┘ └────────────┘ └────────────┘      │
│ 📁 插件  │                                                      │
│  ├── Agent│  ┌──────────────────────────────────────────────┐   │
│  ├── MCP  │  │ 文档预览区                                    │   │
│  └── 提示词│  │ agents/plugins/agent-teams/agents/          │   │
│          │  │                                              │   │
│ 📁 技能  │  │ team-lead.md · team-implementer.md ·         │   │
│  ├── assert│  │ team-reviewer.md · team-debugger.md          │   │
│  ├── emmet│  │                                              │   │
│  └── lucide│ │ [ScrollArea + Collapsible sections]          │   │
│          │  └──────────────────────────────────────────────┘   │
├──────────┴──────────────────────────────────────────────────────┤
│ Footer                                                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧩 组件选用清单

### 页面级组件

| 页面 | 路由 | 选用组件 | 功能说明 |
|------|------|----------|----------|
| 品牌首页 | `/` | `Spline` + `Spotlight` + `Button` | 已实现，3D 机器人品牌入口 |
| 数据总览 | `/dashboard` | `Card` + `Chart` + `Tabs` + `Progress` + `Badge` | KPI 指标 + 趋势图 + 项目矩阵 |
| 项目矩阵 | `/projects` | `Table` + `Badge` + `Progress` + `Pagination` + `Dialog` + `DropdownMenu` | 项目列表/状态/详情 |
| 知识库 | `/knowledge` | `Sidebar` + `ScrollArea` + `Breadcrumb` + `Collapsible` + `Separator` | 文档树导航/分类/预览 |
| 深度分析 | `/analytics` | `Chart` + `Tabs` + `Calendar` + `Select` + `Card` + `Separator` | 时间维度分析/报告导出 |
| 服务监控 | `/monitor` | `Card` + `Progress` + `Badge` + `Alert` + `Spinner` + `Tooltip` | MCP 服务状态/配额/告警 |

### 功能模块组件

| 模块 | 选用组件 | 实现功能 |
|------|----------|----------|
| KPI 指标卡片 | `Card` + `Badge` + `Spinner` | 数值展示 + 趋势标签 + 加载状态 |
| 趋势图表 | `Chart` (Recharts) + `Tabs` + `Select` | 折线/柱状/饼图 + 时间范围切换 |
| 数据表格 | `Table` + `Pagination` + `Badge` + `Progress` + `DropdownMenu` | 列表展示/分页/状态/操作 |
| 侧边导航 | `Sidebar` + `ScrollArea` + `Collapsible` + `Separator` | 知识库树/折叠/分隔 |
| 路径导航 | `Breadcrumb` + `Separator` | 文档层级路径 |
| 搜索过滤 | `Command` (cmdk) + `Input` + `Select` | 全局搜索 + 分类过滤 |
| 日期选择 | `Calendar` + `Select` + `Popover` | 时间范围选择器 |
| 状态告警 | `Alert` + `Badge` + `Sonner` | 服务异常/配额告警/操作反馈 |
| 数据导出 | `Button` + `DropdownMenu` + `Dialog` + `Sonner` | CSV/PDF/图片导出 |

---

## ✅ 预期实现结果

### 交互流程

```
用户进入门户首页 → 品牌展示 (已有)
     ↓ 点击 [进入数据中枢]
仪表盘首页 → 4个 KPI 卡片 (项目/Agent/Skills/MCP)
     ↓ 向下滚动
趋势图表区 → 知识库增长 + MCP 调用统计
     ↓ 向下滚动
项目矩阵 → 所有项目状态/进度/操作入口
     ↓ 点击 [知识库]
知识库浏览器 → 左侧树形导航 + 右侧文档预览
     ↓ 搜索
全局搜索 (Ctrl+K) → 快速定位文档/项目/Agent
     ↓ 点击 [监控]
服务监控面板 → MCP 服务状态 + 配额 + 告警
```

### 用户体验指标

| 指标 | 目标值 | 实现方式 |
|------|--------|----------|
| 首屏加载 | < 2s | ISR + SSG |
| 图表渲染 | < 500ms | Recharts 虚拟化 |
| 表格翻页 | < 200ms | 客户端分页 + 缓存 |
| 搜索响应 | < 100ms | cmdk 本地索引 |
| 知识库浏览 | 无感知切换 | ScrollArea 虚拟滚动 |

### 功能完成度

| 功能 | 状态 | 说明 |
|------|------|------|
| 品牌首页 | ✅ 已实现 | Spline 3D + Logo + 五维展示 |
| KPI 指标卡片 | 🔲 待开发 | Card + Badge + 动态数据 |
| 趋势图表 | 🔲 待开发 | Recharts + Tabs 时间切换 |
| 项目矩阵 | 🔲 待开发 | Table + Pagination + Dialog |
| 知识库浏览器 | 🔲 待开发 | Sidebar + Breadcrumb + Collapsible |
| MCP 监控 | 🔲 待开发 | Progress + Alert + Badge |
| 全局搜索 | 🔲 待开发 | Command (cmdk) |
| 数据导出 | 🔲 待开发 | Button + DropdownMenu |

---

## 🚀 后续拓展方向

### Phase 2 — 增强

| 方向 | 说明 | 技术依赖 |
|------|------|----------|
| 实时数据推送 | WebSocket 驱动 KPI 实时更新 | Socket.IO / SSE |
| 自定义仪表盘 | 用户拖拽式布局，自定义卡片 | React DnD + Grid Layout |
| AI 数据解读 | 点击图表区域，AI 自动生成解读文本 | MCP web-search + GLM-5 |
| 竞品分析 | 定时采集竞品信息，生成对比报告 | MCP web-reader + web-search |
| 移动端适配 | 响应式优化 + PWA 离线访问 | next-pwa + use-mobile |

### Phase 3 — 生态

| 方向 | 说明 | 技术依赖 |
|------|------|----------|
| 多租户 | 不同团队/部门独立数据视图 | RBAC + 数据隔离 |
| 报表自动生成 | 定时生成 PDF/HTML 分析报告 | pdf/pptx 提示词 |
| 外部数据源 | 接入 GitLab/GitHub/Vercel 等平台 API | MCP zread + GitLab MCP |
| 数据告警 | 指标超阈值自动推送通知 | Notification API + webhook |
| 开放 API | 数据接口对外开放，供第三方集成 | REST API + API Key 鉴权 |

### 知识库可复用资源

| 资源 | 来源 | 拓展用途 |
|------|------|----------|
| Tools-A/B/C/D 分析报告 | 知识库根目录 | 4 份深度分析报告直接作为知识库内容 |
| 150+ 提示词列表 | 插件系统/提示词 | Skills 数量统计、分类标签数据 |
| Lucide 图标 | Tools-C/lucide | 1000+ 图标用于仪表盘可视化 |
| mui-x 组件 | mui-x | DataGrid Pro、Charts 高级参考 |
| Apollo 配置 | apollo | 配置中心集成方案 |
| Redux 状态 | redux | 复杂仪表盘状态管理参考 |

---

<div align="center">

> 「***YanYuCloudCube***」 | 「***<admin@0379.email>***」
> **© 2025-2026 YYC³ Team. All Rights Reserved.**
</div>
