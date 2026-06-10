---
file: YYC3-AI-Family-可用性深度审核与彻底实现规划.md
description: YYC³ AI Family 全页面深度可用性审核报告 + 2026Q2行业技术前瞻 + 彻底实现方案
author: YanYuCloudCube Team <admin@0379.email>
version: v1.0.0
created: 2026-04-25
updated: 2026-04-25
status: active
tags: [审核],[可用性],[人机协同],[AI-Family],[彻底实现],[2026前瞻]
category: audit
language: zh-CN
audience: developers,managers,stakeholders,mentors
complexity: advanced
---

# YYC³ AI Family 可用性深度审核与彻底实现规划

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

**文档版本**：v1.0.0
**审核日期**：2026-04-25
**文档性质**：AI Family 全系统可用性审核 + 行业前瞻设计规划
**适用范围**：YYC³ Cloud Intelli-Matrix AI Family 全部 18 个子页面

---

## 📋 目录

- [审核执行摘要](#审核执行摘要)
- [审核方法论](#审核方法论)
- [逐页深度审核清单](#逐页深度审核清单)
- [根因分析：数据层硬编码图谱](#根因分析)
- [2026Q2 行业技术前瞻](#2026q2-行业技术前瞻)
- [彻底实现方案：数据层改造](#彻底实现方案数据层改造)
- [彻底实现方案：页面可编辑化](#彻底实现方案页面可编辑化)
- [彻底实现方案：AI 真实可用](#彻底实现方案ai-真实可用)
- [实施路线图与里程碑](#实施路线图与里程碑)
- [导师支持需求清单](#导师支持需求清单)

---

## 审核执行摘要

### 审核结论

> **AI Family 功能可用率约 25%，38 项 Critical 级问题，核心根因：数据层 15 个硬编码常量数组（~500 行）导致全部页面沦为"模型/展示"。**

### 量化统计

| 指标              | 数值                  |
| ----------------- | --------------------- |
| 审核页面总数      | 18                    |
| 真正可用页面      | 2（模型设置、UI设置） |
| 硬编码静态数据    | 22 处                 |
| 模拟/伪随机数据   | 8 处                  |
| 不可编辑/增删     | 6 处                  |
| 功能缺失/占位     | 5 处                  |
| 数据不持久化      | 5 处                  |
| Critical 问题合计 | **38**                |
| Warning 问题合计  | **8**                 |

### 问题分布热力图

```
页面编号  页面名称          Critical  Warning  可用率
─────────────────────────────────────────────────
P01      钟表首页           2         2       20%
P02      家园首页           2         2       15%
P03      Family 中心        3         1       10%
P04      家人对话            2         2       30%
P05      家人热线            3         1        5%
P06      音乐空间            1         1       50%
P07      娱乐互动            2         1       15%
P08      学习成长            3         0        5%
P09      成长轨迹            3         0        5%
P10      分享空间            1         1       20%
P11      活动中心            4         0        5%
P12      数据中心            2         0       10%
P13      通信中心            2         0       10%
P14      智慧酒店            1         0       20%
P15      集群管理            1         0       20%
P16      语音系统            0         1       60%
P17      模型设置            0         0      90% ✅
P18      UI 设置             0         0      85% ✅
```

---

## 审核方法论

### 审核维度

本次审核遵循 YYC³「五高五标五化」框架，以**可用性为第一优先级**：

1. **数据真实性**：展示的数据是真实计算的还是硬编码/伪随机？
2. **可编辑性**：所有用户可见的内容是否支持增删改？
3. **持久化**：用户修改是否跨会话保留？
4. **交互完整性**：按钮/链接是否有真实行为绑定？
5. **AI 真实可用**：AI 回复是真实 LLM 响应还是 Mock 模拟？

### 审核范围

```
src/app/components/AIFamilyPage.tsx              ← 钟表首页
src/app/components/ai-family/FamilyHome.tsx       ← 家园首页
src/app/components/ai-family/AIFamilyCenterPage.tsx ← Family中心
src/app/components/ai-family/FamilyChat.tsx       ← 家人对话
src/app/components/ai-family/FamilyPhone.tsx      ← 家人热线
src/app/components/ai-family/FamilyMusic.tsx      ← 音乐空间
src/app/components/ai-family/FamilyEntertainment.tsx ← 娱乐互动
src/app/components/ai-family/FamilyLearn.tsx      ← 学习成长
src/app/components/ai-family/FamilyGrowth.tsx     ← 成长轨迹
src/app/components/ai-family/FamilyShare.tsx      ← 分享空间
src/app/components/ai-family/FamilyActivityCenter.tsx ← 活动中心
src/app/components/ai-family/FamilyDataHub.tsx    ← 数据中心
src/app/components/ai-family/FamilyCommCenter.tsx ← 通信中心
src/app/components/ai-family/FamilyHotel.tsx      ← 智慧酒店
src/app/components/ai-family/FamilyCluster.tsx    ← 集群管理
src/app/components/ai-family/FamilyVoiceSystem.tsx ← 语音系统
src/app/components/ai-family/FamilyModelSettings.tsx ← 模型设置
src/app/components/ai-family/FamilyUISettings.tsx  ← UI设置
src/app/components/ai-family/shared.ts            ← 核心数据源
src/app/lib/family-ai-service.ts                  ← AI服务层
```

---

## 逐页深度审核清单

### P01 — 钟表首页 (AIFamilyPage.tsx)

| #   | 严重度     | 问题                                                                                                     | 具体位置                         | 修复方向                                                        |
| --- | ---------- | -------------------------------------------------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------- |
| 1   | 🔴 Critical | MemberDetailDrawer 的 metrics（tasks/latency/accuracy/calls）全部用 `seed * 9301 + 49297` 伪随机公式生成 | ~L650 `useMemo`                  | 从 `useFamilyMemberSlice().members[].stats` 读取真实数据        |
| 2   | 🔴 Critical | 右上角统计 badge "7/8 在线"、"142 活跃任务"、"99.97% 在线率" 全部硬编码字符串                            | `<StatusBadge value="7/8" />` 等 | 从 store 动态计算 `members.filter(m=>m.status!=='idle').length` |
| 3   | 🟡 Warning  | 选中成员的详情抽屉只读，无编辑功能                                                                       | MemberDetailDrawer 组件          | 添加编辑模式，可修改性格/爱好/专长等字段                        |
| 4   | 🟡 Warning  | 底部口号"亦师亦友亦伯乐"硬编码不可自定义                                                                 | 底部 slogan 区域                 | 从 store 读取可配置 slogan                                      |

### P02 — 家园首页 (FamilyHome.tsx)

| #   | 严重度     | 问题                                                                                      | 具体位置                            | 修复方向                                     |
| --- | ---------- | ----------------------------------------------------------------------------------------- | ----------------------------------- | -------------------------------------------- |
| 5   | 🔴 Critical | FAMILY_MOMENTS（家庭动态）5条全部硬编码，不随时间/交互变化                                | `FAMILY_MOMENTS` 常量数组           | 迁移到 Zustand slice，支持增删改，按时间排序 |
| 6   | 🔴 Critical | 今日概览统计 "1,247 协作次数"、"56 知识分享"、"98.5% 健康度"、"2,890 成长积分" 全部硬编码 | `[...]` 数组中的 value/pct          | 从各 slice 聚合计算真实数据                  |
| 7   | 🟡 Warning  | 家人状态卡片点击跳转 `/ai-family/chat` 但不传递成员 ID                                    | `onClick` 中 `window.location.hash` | 改为 `#/ai-family/chat?member=${m.id}`       |
| 8   | 🟡 Warning  | "家园空间" 13 个入口不可自定义排序/增删                                                   | `quickEntries` 常量数组             | 从配置 slice 读取，支持拖拽排序              |

### P03 — Family 中心 (AIFamilyCenterPage.tsx)

| #   | 严重度     | 问题                                                   | 具体位置                | 修复方向                    |
| --- | ---------- | ------------------------------------------------------ | ----------------------- | --------------------------- |
| 9   | 🔴 Critical | "去哪里玩？" 空间入口只有 12 项，缺少 Hotel 和 Cluster | `spaces` 数组           | 补齐全部 14 个空间入口      |
| 10  | 🔴 Critical | "认识家人" 卡片展开后性格/爱好/专长全部只读            | FamilyMemberCard 组件   | 添加编辑按钮 → 内联编辑模式 |
| 11  | 🔴 Critical | "信任公约" 5 条全部硬编码不可增删改                    | `TRUST_PRINCIPLES` 常量 | 迁移到 slice，提供 CRUD UI  |
| 12  | 🟡 Warning  | "Family 之歌" 文案硬编码不可自定义                     | 底部歌曲区域            | 从 slice 读取               |

### P04 — 家人对话 (FamilyChat.tsx)

| #   | 严重度     | 问题                                                | 具体位置                     | 修复方向                                                               |
| --- | ---------- | --------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------- |
| 13  | 🔴 Critical | 初始群聊消息 INITIAL_MESSAGES 7条全部硬编码         | `INITIAL_MESSAGES` 常量      | 从 localStorage 恢复上次对话，首次打开显示系统欢迎消息                 |
| 14  | 🔴 Critical | AI 回复三层降级，无 API Key 时降级到关键词匹配 Mock | family-ai-service.ts Layer 3 | 确保模型设置页配置 API Key 后 Layer 1 可用；Layer 2 Agent 引擎保持增强 |
| 15  | 🟡 Warning  | 私聊频道切换后消息不隔离                            | `messages` 单一 state        | 按 `activeChannel` 分离消息存储                                        |
| 16  | 🟡 Warning  | 对话消息无持久化                                    | useState                     | 迁移到 localStorage / IndexedDB                                        |

### P05 — 家人热线 (FamilyPhone.tsx)

| #   | 严重度     | 问题                                              | 具体位置              | 修复方向                                                        |
| --- | ---------- | ------------------------------------------------- | --------------------- | --------------------------------------------------------------- |
| 17  | 🔴 Critical | 通话流程完全模拟（setTimeout 模拟拨号→响铃→接通） | `startCall` 函数      | 与 FamilyVoiceSystem 集成，使用 Web Speech API 实现真实 TTS/STT |
| 18  | 🔴 Critical | 通话中 AI 回复是文字而非语音                      | `chatMessages` state  | 集成 SpeechSynthesis 朗读 AI 回复                               |
| 19  | 🔴 Critical | 通话记录 MOCK_CALL_LOGS 6条全部硬编码             | `MOCK_CALL_LOGS` 常量 | 迁移到 slice 持久化                                             |
| 20  | 🟡 Warning  | 拨号键盘输入后无实际拨号逻辑                      | `dialInput` state     | 实现号码→成员映射拨号                                           |

### P06 — 音乐空间 (FamilyMusic.tsx)

| #   | 严重度     | 问题                                            | 具体位置          | 修复方向                        |
| --- | ---------- | ----------------------------------------------- | ----------------- | ------------------------------- |
| 21  | 🔴 Critical | 新闻资讯 NEWS_ITEMS 5条全部硬编码不实时         | `NEWS_ITEMS` 常量 | 接入 RSS/API 或改为家人推荐动态 |
| 22  | 🟡 Warning  | `uploading`、`uploadedSongs` 等变量定义但未使用 | L118, L129        | 清理或实现上传 UI               |

### P07 — 娱乐互动 (FamilyEntertainment.tsx)

| #   | 严重度     | 问题                                                               | 具体位置        | 修复方向                                                    |
| --- | ---------- | ------------------------------------------------------------------ | --------------- | ----------------------------------------------------------- |
| 23  | 🔴 Critical | 6 个游戏中 5 个标记 `available: false`（拼图/骰子/问答/成语/猜歌） | 游戏列表        | 逐步实现：拼图用 CSS Grid、骰子用 Math.random、问答用知识库 |
| 24  | 🔴 Critical | 才艺展示 `artworks` 6件全部硬编码，无真实图片                      | `artworks` 常量 | 迁移到 slice，支持上传图片、添加/删除作品                   |
| 25  | 🟡 Warning  | "喜欢" 按钮无状态持久化                                            | Heart 按钮      | 迁移到 slice                                                |

### P08 — 学习成长 (FamilyLearn.tsx)

| #   | 严重度     | 问题                                                   | 具体位置            | 修复方向                             |
| --- | ---------- | ------------------------------------------------------ | ------------------- | ------------------------------------ |
| 26  | 🔴 Critical | 技能树 SKILL_TREE 4类16项全部硬编码，等级/状态不可编辑 | `SKILL_TREE` 常量   | 迁移到 slice，支持编辑等级、添加技能 |
| 27  | 🔴 Critical | 课程 COURSES 5门全部硬编码，进度不可修改               | `COURSES` 常量      | 迁移到 slice，支持添加课程、修改进度 |
| 28  | 🔴 Critical | 成就 ACHIEVEMENTS 6个全部硬编码，earned 状态不可变     | `ACHIEVEMENTS` 常量 | 迁移到 slice，基于行为自动解锁       |

### P09 — 成长轨迹 (FamilyGrowth.tsx)

| #   | 严重度     | 问题                                               | 具体位置            | 修复方向                          |
| --- | ---------- | -------------------------------------------------- | ------------------- | --------------------------------- |
| 29  | 🔴 Critical | 热力图 `generateHeatmap()` 用 `Math.random()` 生成 | `generateHeatmap()` | 基于活动 slice 的真实活动频率计算 |
| 30  | 🔴 Critical | 里程碑 MILESTONES 6条全部硬编码不可增删            | `MILESTONES` 常量   | 迁移到 slice，支持添加/编辑里程碑 |
| 31  | 🔴 Critical | 周统计 WEEKLY_STATS 4项全部硬编码                  | `WEEKLY_STATS` 常量 | 从各 slice 聚合计算               |

### P10 — 分享空间 (FamilyShare.tsx)

| #   | 严重度     | 问题                            | 具体位置             | 修复方向                            |
| --- | ---------- | ------------------------------- | -------------------- | ----------------------------------- |
| 32  | 🔴 Critical | INITIAL_POSTS 6条全部硬编码     | `INITIAL_POSTS` 常量 | 迁移到 slice，支持真实发布          |
| 33  | 🟡 Warning  | "发布新分享" 功能缺失，仅有图标 | PlusCircle 图标      | 实现发布表单（标题+内容+分类+标签） |

### P11 — 活动中心 (FamilyActivityCenter.tsx)

| #   | 严重度     | 问题                                                  | 具体位置                      | 修复方向                          |
| --- | ---------- | ----------------------------------------------------- | ----------------------------- | --------------------------------- |
| 34  | 🔴 Critical | FAMILY_ACTIVITIES 2条全部硬编码                       | shared.ts `FAMILY_ACTIVITIES` | 迁移到 slice，支持创建/编辑活动   |
| 35  | 🔴 Critical | `generateDailyBroadcast()` 7个 segment 全部硬编码模板 | shared.ts                     | 基于当天真实活动数据动态生成      |
| 36  | 🔴 Critical | SAMPLE_MEMORIES 8条成长记忆全部硬编码                 | shared.ts `SAMPLE_MEMORIES`   | 迁移到 slice，家人/用户可添加记忆 |
| 37  | 🔴 Critical | MEDALS 12种勋章 + MEMBER_MEDALS 归属全部硬编码        | shared.ts                     | 迁移到 slice，支持自定义勋章      |

### P12 — 数据中心 (FamilyDataHub.tsx)

| #   | 严重度     | 问题                                                                    | 具体位置                    | 修复方向                    |
| --- | ---------- | ----------------------------------------------------------------------- | --------------------------- | --------------------------- |
| 38  | 🔴 Critical | `getFamilyDataSummary()` 中 `systemUptime: 90`、`familyAge: 100` 硬编码 | shared.ts                   | 从实际启动时间/创建时间计算 |
| 39  | 🔴 Critical | 统计数据全部来自硬编码常量长度                                          | `SAMPLE_MESSAGES.length` 等 | 从各 slice 聚合真实数据     |

### P13-P15 — 通信中心 / 智慧酒店 / 集群管理

| #   | 严重度     | 问题                                                | 具体位置             | 修复方向                           |
| --- | ---------- | --------------------------------------------------- | -------------------- | ---------------------------------- |
| 40  | 🔴 Critical | 通信中心 ClusterNode 数据用 members 映射 + 模拟指标 | FamilyCommCenter.tsx | 接入真实设备管理或改为可视化仪表盘 |
| 41  | 🔴 Critical | 酒店/集群指标全部模拟                               | FamilyHotel/Cluster  | 基于真实交互数据计算               |

### P16-P18 — 语音系统 / 模型设置 / UI设置

| #   | 严重度    | 问题                                                  | 具体位置            | 修复方向                 |
| --- | --------- | ----------------------------------------------------- | ------------------- | ------------------------ |
| 42  | 🟡 Warning | 语音系统依赖浏览器 Web Speech API，兼容性有限         | FamilyVoiceSystem   | 增加兼容性检测和降级提示 |
| 43  | ✅ 合规    | 模型设置可编辑，Provider/Model/API Key 可修改并持久化 | FamilyModelSettings | —                        |
| 44  | ✅ 合规    | UI设置可编辑，通知/导入导出功能可用                   | FamilyUISettings    | —                        |

---

## 根因分析：数据层硬编码图谱

### 核心病灶：shared.ts 中 15 个硬编码常量

```
shared.ts (633 行)
├── FAMILY_MEMBERS[8]          ← 8位家人静态数据（已被 slice 替代，但仍在多处引用）
├── MEDALS[12]                 ← 🔴 勋章定义硬编码
├── MEMBER_MEDALS{8}           ← 🔴 勋章归属硬编码
├── FAMILY_ACTIVITIES[2]       ← 🔴 活动记录硬编码
├── SAMPLE_MEMORIES[8]         ← 🔴 成长记忆硬编码
├── SAMPLE_MESSAGES[10]        ← 🔴 通信消息硬编码
├── AI_RESPONSES{8}            ← 🔴 AI 回复模板硬编码
├── DEFAULT_VOICE_PROFILES[8]  ← 🟡 语音配置（已部分迁移到 slice）
├── DEFAULT_MODEL_ASSIGNMENTS[8]← 🟡 模型分配（已迁移到 slice）
├── getFamilyDataSummary()     ← 🔴 返回硬编码统计
├── generateDailyBroadcast()   ← 🔴 生成硬编码播报
├── getHourlyCare()            ← 🟡 基于 FAMILY_MEMBERS 动态轮换（可接受）
├── hexToRgb()                 ← ✅ 工具函数
├── getGreeting()              ← ✅ 基于时间动态生成
└── getMember()/getMembersMap()← ✅ 查询函数
```

### 页面内硬编码常量

```
FamilyHome.tsx
├── FAMILY_MOMENTS[5]          ← 🔴 家庭动态硬编码
└── quickEntries[13]           ← 🟡 空间入口（功能入口，可考虑配置化）

AIFamilyCenterPage.tsx
├── TRUST_PRINCIPLES[5]        ← 🔴 信任公约硬编码
└── spaces[12]                 ← 🔴 缺少 Hotel/Cluster

FamilyChat.tsx
└── INITIAL_MESSAGES[7]        ← 🔴 初始消息硬编码

FamilyPhone.tsx
└── MOCK_CALL_LOGS[6]          ← 🔴 通话记录硬编码

FamilyMusic.tsx
└── NEWS_ITEMS[5]              ← 🔴 新闻资讯硬编码

FamilyEntertainment.tsx
└── artworks[6]                ← 🔴 才艺展示硬编码

FamilyLearn.tsx
├── SKILL_TREE[4→16]           ← 🔴 技能树硬编码
├── COURSES[5]                 ← 🔴 课程硬编码
└── ACHIEVEMENTS[6]            ← 🔴 成就硬编码

FamilyGrowth.tsx
├── MILESTONES[6]              ← 🔴 里程碑硬编码
└── WEEKLY_STATS[4]            ← 🔴 周统计硬编码

FamilyShare.tsx
└── INITIAL_POSTS[6]           ← 🔴 分享帖子硬编码

AIFamilyPage.tsx
└── StatusBadge values         ← 🔴 统计数字硬编码
```

---

## 2026Q2 行业技术前瞻

### 1. AI Agent 范式演进：从 Chatbot → Autonomous Agent

**行业趋势（2026Q2）**：
- OpenAI Agents SDK、Google ADK、Anthropic Claude Agent 已成为主流开发范式
- Multi-Agent 协作（A2A Protocol）进入生产级应用
- AI 不再是"回复消息的工具"，而是"自主执行任务的代理"

**对 AI Family 的启示**：
- 当前 AI Family 的 `family-ai-service.ts` 三层降级架构（LLM → Agent → Mock）设计方向正确
- 但 Layer 2 Agent 引擎过于简单（关键词意图识别），需升级为**基于 Tool Calling 的 Agent**
- 每位家人应具备独立的 `tools` 注册能力（如千行可调用路由 API、守护可调用安全扫描 API）

### 2. 本地优先（Local-First）架构

**行业趋势（2026Q2）**：
- CRDTs（Conflict-free Replicated Data Types）+ IndexedDB 成为前端数据持久化标准
- localStorage 的 5MB 限制已不满足复杂应用需求
- 浏览器原生 File System Access API 支持本地文件读写

**对 AI Family 的启示**：
- 当前使用 Zustand + localStorage 持久化，数据量增大后将遇到瓶颈
- 建议引入 **IndexedDB（via idb 或 Dexie.js）** 存储对话历史、活动记录等大量数据
- 家人配置等轻量数据可继续使用 localStorage

### 3. Web Speech API 增强与多模态交互

**行业趋势（2026Q2）**：
- Web Speech API 在 Chrome/Edge 中支持度已达到生产可用
- Whisper.cpp / WebAssembly 方案可在浏览器端实现本地 STT
- 浏览器端 TTS 已支持 SSML 标记，可精细控制语调/语速/停顿

**对 AI Family 的启示**：
- 家人热线（FamilyPhone）应升级为**真实语音通话**：STT 录音 → LLM 处理 → TTS 播报
- 每位家人的 `voiceProfile` 可通过 SSML 实现差异化音色

### 4. 可编辑数据驱动 UI（Data-Driven UI）

**行业趋势（2026Q2）**：
- Low-Code/No-Code 趋势下，用户期望所有可见内容均可配置
- JSON Schema + Dynamic Form 成为标准模式
- Optimistic UI 更新模式提升编辑体验

**对 AI Family 的启示**：
- 所有硬编码数据必须迁移到可编辑 store
- 提供"编辑模式"切换（查看模式 ↔ 编辑模式）
- 增删改操作使用 Optimistic Update + 自动保存

### 5. AI Memory & Personalization（AI 记忆与个性化）

**行业趋势（2026Q2）**：
- Mem0、Zep 等AI记忆层服务成熟
- 长期记忆（Long-term Memory）+ 工作记忆（Working Memory）分层架构
- 个性化推荐从"协同过滤"升级为"基于对话历史的实时画像更新"

**对 AI Family 的启示**：
- 每位家人应有独立的记忆系统（已设计 `ai-family-memory.ts`，需激活）
- 对话历史应自动提取关键信息更新家人对用户的认知
- 成长轨迹应基于真实交互数据而非伪随机

---

## 彻底实现方案：数据层改造

### 架构设计：Zustand Slices 扩展

```
src/app/store/slices/
├── family-member-slice.ts      ← ✅ 已有（8位家人SSOT）
├── family-settings-slice.ts    ← ✅ 已有（全局设置）
├── family-moments-slice.ts     ← 🆕 家庭动态 CRUD
├── family-activities-slice.ts  ← 🆕 活动记录 CRUD
├── family-medals-slice.ts      ← 🆕 勋章定义 + 归属 CRUD
├── family-memories-slice.ts    ← 🆕 成长记忆 CRUD
├── family-messages-slice.ts    ← 🆕 通信消息持久化
├── family-milestones-slice.ts  ← 🆕 里程碑 CRUD
├── family-skills-slice.ts      ← 🆕 技能树/课程/成就 CRUD
├── family-chat-slice.ts        ← 🆕 对话历史持久化（按频道隔离）
├── family-calllog-slice.ts     ← 🆕 通话记录持久化
├── family-posts-slice.ts       ← 🆕 分享帖子 CRUD
├── family-artworks-slice.ts    ← 🆕 才艺作品 CRUD
└── family-news-slice.ts        ← 🆕 新闻/动态订阅
```

### Slice 设计模板（统一规范）

每个新增 slice 遵循以下标准结构：

```typescript
// 以 family-moments-slice.ts 为例

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ... } from '../../types';

// 1. 类型定义（从 shared.ts 迁移到 types/）
interface FamilyMoment {
  id: string;
  member: string;
  text: string;
  time: string;
  color: string;
  createdAt: number;
}

// 2. Slice 接口
interface FamilyMomentsSlice {
  moments: FamilyMoment[];
  addMoment: (moment: Omit<FamilyMoment, 'id' | 'createdAt'>) => void;
  updateMoment: (id: string, updates: Partial<FamilyMoment>) => void;
  deleteMoment: (id: string) => void;
  reorderMoments: (ids: string[]) => void;
}

// 3. 默认数据（从 shared.ts 常量迁移为初始种子）
const SEED_MOMENTS: FamilyMoment[] = [ /* 原 FAMILY_MOMENTS 数据 */ ];

// 4. Slice 实现
export const useFamilyMomentsSlice = create<FamilyMomentsSlice>()(
  persist(
    (set) => ({
      moments: SEED_MOMENTS,
      addMoment: (moment) => set((s) => ({
        moments: [...s.moments, {
          ...moment,
          id: `moment-${Date.now()}`,
          createdAt: Date.now(),
        }],
      })),
      updateMoment: (id, updates) => set((s) => ({
        moments: s.moments.map(m => m.id === id ? { ...m, ...updates } : m),
      })),
      deleteMoment: (id) => set((s) => ({
        moments: s.moments.filter(m => m.id !== id),
      })),
      reorderMoments: (ids) => set((s) => ({
        moments: ids.map(id => s.moments.find(m => m.id === id)!).filter(Boolean),
      })),
    }),
    { name: 'yyc3-family-moments' },
  ),
);
```

### shared.ts 改造策略

```
改造前（当前状态）：
  shared.ts 导出 15 个常量 → 各页面直接 import → 全部只读

改造后（目标状态）：
  shared.ts 仅保留工具函数 + 类型导出
  数据全部迁移到 Zustand slices
  各页面从对应 slice 读取数据
  提供 CRUD 操作方法
  保留 SEED 数据作为首次加载种子
```

---

## 彻底实现方案：页面可编辑化

### 通用编辑模式组件设计

```typescript
// EditableField — 内联可编辑字段
interface EditableFieldProps {
  value: string;
  onSave: (newValue: string) => void;
  mode?: 'text' | 'textarea' | 'number' | 'tags';
  placeholder?: string;
}

// EditableList — 可增删改的列表
interface EditableListProps<T> {
  items: T[];
  onAdd: () => void;
  onEdit: (id: string, updates: Partial<T>) => void;
  onDelete: (id: string) => void;
  renderCard: (item: T, isEditing: boolean) => React.ReactNode;
  addLabel?: string;
}

// EditableSection — 带编辑模式切换的区域
interface EditableSectionProps {
  title: string;
  isEditing: boolean;
  onToggleEdit: () => void;
  children: React.ReactNode;
}
```

### 各页面编辑化改造清单

| 页面                   | 编辑能力需求                                   | 优先级 |
| ---------------------- | ---------------------------------------------- | ------ |
| P01 钟表首页           | 成员详情 metrics 实时数据；统计 badge 动态计算 | P1     |
| P02 家园首页           | 动态增删；统计聚合；空间入口可配置             | P1     |
| P03 Family中心         | 家人卡片内联编辑；公约 CRUD；空间入口补齐      | P0     |
| P04 家人对话           | 消息持久化；频道隔离；发布表单                 | P1     |
| P05 家人热线           | 通话记录持久化；真实语音集成                   | P1     |
| P06 音乐空间           | 新闻动态化；上传功能完善                       | P2     |
| P07 娱乐互动           | 作品 CRUD；游戏逐步实现                        | P2     |
| P08 学习成长           | 技能树/课程/成就全 CRUD                        | P1     |
| P09 成长轨迹           | 热力图真实化；里程碑 CRUD；统计聚合            | P1     |
| P10 分享空间           | 帖子 CRUD；发布表单                            | P1     |
| P11 活动中心           | 活动/播报/记忆/勋章全 CRUD                     | P0     |
| P12 数据中心           | 统计数据真实化                                 | P2     |
| P13-P15 通信/酒店/集群 | 模拟数据替换为真实仪表盘                       | P2     |

---

## 彻底实现方案：AI 真实可用

### 当前 AI 服务架构评估

```
Layer 1: 真实 LLM API（ZhipuAI/OpenAI-compatible）
  → ✅ 架构正确
  → 🔴 依赖用户在模型设置页配置 API Key
  → 🔴 无 API Key 时完全不可用

Layer 2: Agent 智能引擎
  → 🟡 意图识别过于简单（正则关键词匹配）
  → 🟡 无 Tool Calling 能力
  → 🟡 无知识库检索集成

Layer 3: 增强型 Mock
  → 🔴 关键词匹配回复，无上下文理解
  → 🔴 回复库仅 4-8 条/人，重复率高
```

### AI 可用性升级方案

#### 阶段一：确保 Layer 1 真实可用

1. **模型设置页引导优化**：首次进入 AI Family 时检测 API Key 配置状态，未配置则弹出引导
2. **默认 Provider 预置**：预置 5 个 Provider 的 baseUrl，用户只需填入 API Key
3. **连通性测试**：模型设置页添加"测试连接"按钮，验证 API Key 有效性

#### 阶段二：升级 Layer 2 Agent 引擎

```typescript
// 升级方向：基于 Tool Calling 的 Agent
interface FamilyAgentTool {
  name: string;
  description: string;
  parameters: Record<string, ToolParameter>;
  execute: (params: Record<string, unknown>) => Promise<string>;
}

// 每位家人注册不同的 Tools
const NAVIGATOR_TOOLS: FamilyAgentTool[] = [
  { name: 'search_knowledge', description: '搜索本地知识库', ... },
  { name: 'route_to_member', description: '路由到其他家人', ... },
];

const THINKER_TOOLS: FamilyAgentTool[] = [
  { name: 'analyze_data', description: '分析数据趋势', ... },
  { name: 'generate_report', description: '生成洞察报告', ... },
];
```

#### 阶段三：AI Memory 集成

```
已设计未激活：src/app/lib/ai-family-memory.ts
需要：
1. 激活 ai-family-memory.ts 的记忆存储功能
2. 对话时自动提取关键信息（用户偏好、项目上下文等）
3. 记忆影响后续对话的 System Prompt
4. 成长轨迹基于记忆数据生成真实记录
```

---

## 实施路线图与里程碑

### Phase 1 — 数据层基础（优先级 P0）

**目标**：消灭所有硬编码常量，建立完整 CRUD 数据层

```
Week 1:
  ├── 创建 family-moments-slice.ts
  ├── 创建 family-activities-slice.ts
  ├── 创建 family-medals-slice.ts
  ├── 创建 family-memories-slice.ts
  ├── 创建 family-messages-slice.ts
  └── 创建 family-milestones-slice.ts

Week 2:
  ├── 创建 family-skills-slice.ts
  ├── 创建 family-chat-slice.ts
  ├── 创建 family-calllog-slice.ts
  ├── 创建 family-posts-slice.ts
  ├── 创建 family-artworks-slice.ts
  ├── 创建 family-news-slice.ts
  └── 重构 shared.ts（仅保留工具函数 + SEED 数据）
```

### Phase 2 — 页面可编辑化（优先级 P1）

```
Week 3:
  ├── 创建通用编辑组件（EditableField / EditableList / EditableSection）
  ├── 改造 P03 Family 中心（家人编辑 + 公约 CRUD）
  ├── 改造 P11 活动中心（全 CRUD）
  └── 改造 P01 钟表首页（真实数据替换伪随机）

Week 4:
  ├── 改造 P02 家园首页（动态数据 + 统计聚合）
  ├── 改造 P08 学习成长（技能/课程/成就 CRUD）
  ├── 改造 P09 成长轨迹（真实热力图 + 里程碑 CRUD）
  ├── 改造 P10 分享空间（帖子 CRUD + 发布表单）
  └── 改造 P04 家人对话（消息持久化 + 频道隔离）
```

### Phase 3 — AI 真实可用（优先级 P1）

```
Week 5:
  ├── 模型设置引导优化（首次配置检测 + 连通性测试）
  ├── Layer 2 Agent 引擎升级（Tool Calling 注册）
  └── AI Memory 系统激活

Week 6:
  ├── P05 家人热线语音集成（Web Speech API）
  ├── 对话历史 IndexedDB 迁移
  ├── P06-P07 音乐/娱乐完善
  └── 全链路测试验收
```

### Phase 4 — 体验打磨（优先级 P2）

```
Week 7-8:
  ├── P12-P15 数据中心/通信/酒店/集群仪表盘真实化
  ├── i18n 全量覆盖
  ├── ESLint warnings 清零
  ├── 测试覆盖提升
  └── 性能优化（大列表虚拟化、图片懒加载）
```

---

## 导师支持需求清单

### 技术决策支持

| #   | 需求                          | 说明                                         | 紧急度 |
| --- | ----------------------------- | -------------------------------------------- | ------ |
| 1   | **IndexedDB vs localStorage** | 对话历史等大数据量存储选型决策               | 高     |
| 2   | **AI Provider 默认预置策略**  | 是否预置免费/试用 API Key 降低用户门槛       | 高     |
| 3   | **编辑模式 UX 范式**          | 全局编辑开关 vs 局部内联编辑 vs 独立编辑页面 | 中     |
| 4   | **游戏模块实现优先级**        | 五子棋已可用，其余 5 个游戏的实现顺序        | 低     |

### 资源支持

| #   | 需求           | 说明                                                       |
| --- | -------------- | ---------------------------------------------------------- |
| 1   | **AI API Key** | 需要至少一个可用 Provider 的 API Key 用于 Layer 1 真实测试 |
| 2   | **设计评审**   | EditableField / EditableList 组件的 UI 设计评审            |
| 3   | **代码评审**   | 每个 Phase 完成后的代码质量评审                            |

### 关键里程碑确认

| 里程碑             | 预期交付物                     | 验收标准                            |
| ------------------ | ------------------------------ | ----------------------------------- |
| M1: 数据层完成     | 12 个新 slice + shared.ts 重构 | 0 个硬编码数据常量残留              |
| M2: 核心页面可编辑 | P01-P05, P08-P11 编辑化        | 所有可见内容可增删改查              |
| M3: AI 真实可用    | Layer 1 稳定 + Layer 2 升级    | 对话回复 source 为 "llm" 或 "agent" |
| M4: 全链路验收     | 18 个页面全部可用              | 0 个 Critical 问题                  |

---

## 附录 A：文件影响矩阵

| 文件                       | 改造类型                   | 涉及 Phase |
| -------------------------- | -------------------------- | ---------- |
| `shared.ts`                | 重构（删除常量，保留函数） | Phase 1    |
| `family-ai-service.ts`     | 升级 Agent 引擎            | Phase 3    |
| `AIFamilyPage.tsx`         | 真实数据替换               | Phase 2    |
| `FamilyHome.tsx`           | 动态数据 + 统计聚合        | Phase 2    |
| `AIFamilyCenterPage.tsx`   | 编辑模式 + 入口补齐        | Phase 2    |
| `FamilyChat.tsx`           | 持久化 + 频道隔离          | Phase 2    |
| `FamilyPhone.tsx`          | 语音集成 + 记录持久化      | Phase 3    |
| `FamilyMusic.tsx`          | 动态化                     | Phase 4    |
| `FamilyEntertainment.tsx`  | 游戏 + 作品 CRUD           | Phase 4    |
| `FamilyLearn.tsx`          | 全 CRUD                    | Phase 2    |
| `FamilyGrowth.tsx`         | 真实热力图 + CRUD          | Phase 2    |
| `FamilyShare.tsx`          | 帖子 CRUD                  | Phase 2    |
| `FamilyActivityCenter.tsx` | 全 CRUD                    | Phase 2    |
| `FamilyDataHub.tsx`        | 真实统计                   | Phase 4    |
| `FamilyCommCenter.tsx`     | 真实仪表盘                 | Phase 4    |
| `FamilyHotel.tsx`          | 真实指标                   | Phase 4    |
| `FamilyCluster.tsx`        | 真实指标                   | Phase 4    |
| `FamilyVoiceSystem.tsx`    | 兼容性增强                 | Phase 3    |
| `FamilyModelSettings.tsx`  | 引导优化                   | Phase 3    |
| `FamilyUISettings.tsx`     | 无需改动                   | —          |

---

## 附录 B：2026Q2 推荐技术栈补充

| 领域                  | 推荐方案                          | 理由                          |
| --------------------- | --------------------------------- | ----------------------------- |
| 大数据量持久化        | `idb` (IndexedDB wrapper)         | 轻量（~1KB），TypeScript 友好 |
| 表单编辑              | 内建 EditableField 组件           | 避免引入重型 form 库          |
| 拖拽排序              | `@dnd-kit/core`                   | React 19 兼容，轻量           |
| AI Agent Tool Calling | 基于 OpenAI Function Calling 协议 | 统一标准，多 Provider 兼容    |
| 语音 STT              | Web Speech API + 降级提示         | 零依赖，浏览器原生            |
| 语音 TTS              | SpeechSynthesis + SSML            | 每位家人差异化音色            |
| 热力图                | 纯 CSS + 数据驱动                 | 无需引入第三方图表库          |

---

## 附录 C：知识库资产盘点与集成方案

### 知识库路径

```
/Volumes/Knowledge/YYC3-AI-Skill-KB/
```

### 知识库资产全景

```
YYC3-AI-Skill-KB/
├── 开发智库/
│   └── FAmily/                          ← 🏆 核心：FAmily π³ NPM 包（@family-pai/core）
│       ├── packages/claw-core/src/
│       │   ├── ai-family/               ← 8 位家人 Agent 定义 + 管理器 + 路由器
│       │   ├── auth/                    ← 统一认证（OpenAI/Ollama/Anthropic）
│       │   ├── mcp/                     ← MCP 协议客户端
│       │   ├── skills/                  ← 技能系统 + 质量门控 + 智能推荐
│       │   └── multimodal/              ← 图像/音频/文档处理
│       └── docs/                        ← 完整文档体系（22篇）
├── GLM-skills/                          ← 智谱 GLM 官方技能集（OCR/图像/多模态）
├── Tools-ABCD/
│   └── SKILL.md                         ← 🏆 五高五标五化智能架构完整版（2972行）
├── 插件系统/
│   ├── Agent/                           ← 多语言 Agent 技能（C/C++/PHP/Ruby/Rust）
│   └── 提示词/                          ← 🏆 130+ 专业提示词模板
│       ├── deep-research                ← 深度研究
│       ├── ui-ux-pro-max                ← UI/UX 设计
│       ├── interactive-dashboard-builder ← 交互式仪表盘
│       ├── skill-creator                ← 技能创建
│       ├── rag-implementation           ← RAG 实现
│       ├── langchain-architecture       ← LangChain 架构
│       ├── tailwind-design-system       ← Tailwind 设计系统
│       └── ... (130+ 更多)
├── skills/glmocr/                       ← GLM-OCR 技能
├── vscode-skills/                       ← VSCode 主题工厂技能
├── 技能知识/                            ← 基础技能库（assert/emmet/git/lucide/marked）
├── agent/                               ← Rust Agent 框架（MCP 协议实现）
├── apollo/                              ← Apollo 配置中心
├── kubernetes-1/                        ← Kubernetes 源码
├── mui-x/                               ← MUI X 组件库源码
├── onlook/                              ← Onlook 可视化编辑器
├── openclaude/                          ← OpenClaude Agent 框架
├── redux/                               ← Redux 状态管理源码
├── spotube/                             ← Spotube 音乐客户端
├── tools/                               ← Go 官方工具链源码
├── litemall/                            ← 小商城完整项目
├── pm2m/                                ← 标注模式项目包
└── packages/i18n/                       ← ICU 国际化
```

### 核心资产与 AI Family 集成映射

| 知识库资产                         | 可用内容                                                                                                    | AI Family 集成方向                                                              | 优先级   |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | -------- |
| **FAmily π³ (`@family-pai/core`)** | 8 位家人 Agent 定义、`AIFamilyManager`、`AgentRouter`（能力路由+负载均衡）、统一认证、技能系统、多模态处理  | 替换当前 `family-ai-service.ts` 的简化三层架构，升级为生产级 Agent 管理器       | 🔴 P0     |
| **Tools-ABCD/SKILL.md**            | 五高五标五化完整架构（2972行）：高可用/高性能/高扩展/高安全/高可维护 + K8s/微服务/缓存/消息队列实施方案     | AI Family 通信中心/集群管理页面的真实后端架构蓝图                               | 🔴 P0     |
| **提示词/ (130+ templates)**       | `deep-research`、`ui-ux-pro-max`、`interactive-dashboard-builder`、`skill-creator`、`rag-implementation` 等 | 家人对话的 System Prompt 模板库、学习成长页面的课程内容来源                     | 🟡 P1     |
| **GLM-skills**                     | GLM-OCR（图片文字提取）、GLM-V（多模态理解/文档转PPT/网页复制）、GLM-Image-Gen（图片生成）                  | 灵韵（创意）的图像生成能力、千行（导航）的 OCR 能力、宗师（质量）的文档分析能力 | 🟡 P1     |
| **agent/ (Rust)**                  | MCP 协议的 Rust 实现（`mod.rs`、`compact.rs`、`types.rs`）                                                  | AI Family 与外部工具的 MCP 通信协议参考                                         | 🟢 P2     |
| **mui-x**                          | MUI X 高级组件源码（DataGrid/DatePicker/Chart）                                                             | 数据中心/成长轨迹的高级可视化组件参考                                           | 🟢 P2     |
| **redux**                          | Redux 状态管理源码（`compose.ts`、`index.ts`）                                                              | Zustand slice 设计模式参考                                                      | 🟢 P2     |
| **spotube**                        | Flutter 音乐客户端完整源码                                                                                  | 音乐空间（FamilyMusic）的功能参考                                               | 🟢 P2     |
| **技能知识/lucide**                | Lucide 图标库                                                                                               | 家人图标系统                                                                    | ✅ 已集成 |

### FAmily π³ 核心包与当前项目集成方案

#### 1. Agent 管理器集成（P0）

**当前状态**：`family-ai-service.ts` 三层降级（LLM → 简单 Agent → Mock）

**FAmily π³ 提供**：
```
AIFamilyManager          ← 统一管理 8 位 Agent
├── initializeAgents()   ← 自动初始化所有家人
├── submitTask()         ← 任务提交
├── recommendAgents()    ← 智能推荐最适合的家人
├── createTask()         ← 创建任务
└── EventEmitter         ← 事件驱动（agent_registered/task_completed 等）

AgentRouter              ← 智能路由
├── capability-based     ← 基于能力匹配
├── load-balanced        ← 负载均衡
├── performance-based    ← 基于历史表现
├── cost-optimized       ← 成本优化
└── hybrid               ← 混合策略

BaseAgent                ← Agent 基类
├── systemPrompt         ← 个性化 System Prompt
├── capabilities[]       ← 能力注册
├── execute()            ← 任务执行
└── status               ← 状态管理
```

**集成路径**：
```typescript
// Step 1: 安装 @family-pai/core（从本地知识库）
// pnpm add @family-pai/core
// 或直接复制核心模块到 src/app/lib/claw-core/

// Step 2: 替换 family-ai-service.ts 的核心逻辑
import { AIFamilyManager, UnifiedAuthManager } from '@family-pai/core'

const auth = new UnifiedAuthManager()
await auth.autoDetect()

const familyManager = new AIFamilyManager({
  authManager: auth,
  enableCollaboration: true,
})

// Step 3: 在 FamilyChat/FamilyPhone 中使用
const result = await familyManager.submitTask({
  type: 'chat',
  input: userMessage,
  context: { memberId: activeChannel },
})
```

#### 2. 统一认证集成（P0）

**当前状态**：`api-config.ts` 简单配置，无自动检测

**FAmily π³ 提供**：
```
UnifiedAuthManager
├── autoDetect()          ← 自动检测环境（Claude Code/Cursor/VSCode）
├── openai-provider.ts    ← OpenAI 兼容 Provider
├── ollama-provider.ts    ← Ollama 本地模型 Provider
└── auth-switcher.ts      ← 动态切换认证方式
```

**集成路径**：替换 `src/app/lib/api-config.ts`，用 `UnifiedAuthManager` 统一管理 API Key 和 Provider 配置。

#### 3. 技能系统集成（P1）

**FAmily π³ 提供**：
```
SkillManager
├── register()            ← 注册技能
├── execute()             ← 执行技能
├── builtin.ts            ← 内置技能
├── skill-composer.ts     ← 技能组合
├── skill-learner.ts      ← 技能学习
├── skill-quality-gates.ts ← 技能质量门控
└── skill-recommender.ts  ← 技能推荐
```

**集成方向**：每位家人可注册不同技能，用户在"学习成长"页面可查看和解锁技能。

#### 4. 多模态处理集成（P1）

**FAmily π³ 提供**：
```
MultimodalManager
├── image-processor.ts    ← 图像分析/OCR/分类/检测
├── audio-processor.ts    ← 语音转录/合成/多语言
└── document-processor.ts ← 文档解析/摘要/对比
```

**集成方向**：
- 灵韵（创意）→ 图像生成/分析
- 千行（导航）→ OCR 文字识别
- 万物（分析）→ 文档智能解析
- 家人热线 → 真实语音通话（STT + TTS）

### 130+ 提示词模板与 AI Family 对话增强

知识库中 `插件系统/提示词/` 目录包含 **130+ 专业提示词模板**，可拆解为每位家人的专业技能提示：

| 家人           | 可用提示词模板                                                                       | 增强方向           |
| -------------- | ------------------------------------------------------------------------------------ | ------------------ |
| 千行（导航）   | `prompt-engineering-patterns`、`context-driven-development`                          | System Prompt 优化 |
| 万物（分析）   | `data-analysis-workflows`、`data-visualization`、`statistical-analysis`              | 数据分析对话能力   |
| 先知（预测）   | `deep-research`、`competitive-analysis`、`trading-analysis`                          | 趋势预测与研究     |
| 伯乐（推荐）   | `product-requirements`、`user-research-synthesis`                                    | 用户画像与需求分析 |
| 天枢（总指挥） | `architecture-patterns`、`workflow-orchestration-patterns`、`microservices-patterns` | 架构编排能力       |
| 守护（安全）   | `secrets-management`、`memory-safety-patterns`、`verification-before-completion`     | 安全审计能力       |
| 宗师（质量）   | `test-driven-development`、`systematic-debugging`、`typescript-advanced-types`       | 代码审查与质量     |
| 灵韵（创意）   | `ui-ux-pro-max`、`tailwind-design-system`、`design-to-code-workflows`                | UI/UX 创意设计     |

### 集成实施步骤

```
Phase 0（前置准备）:
  ├── 将 FAmily π³ 核心模块复制到项目
  │   cp -r /Volumes/Knowledge/YYC3-AI-Skill-KB/开发智库/FAmily/packages/claw-core/src/
  │         → src/app/lib/claw-core/
  ├── 将 130+ 提示词模板索引化
  │   → src/app/lib/prompt-templates/
  └── 将 Tools-ABCD 架构文档作为知识库参考
      → src/app/lib/local-knowledge-base.ts 扩展

Phase 1（数据层）:
  └── 同原规划 Phase 1（12 个 Zustand slice）

Phase 2（页面可编辑化）:
  └── 同原规划 Phase 2

Phase 3（AI 引擎升级）:
  ├── 集成 FAmily π³ 的 AIFamilyManager 替换 family-ai-service.ts
  ├── 集成 UnifiedAuthManager 替换 api-config.ts
  ├── 集成 AgentRouter 实现智能任务路由
  ├── 加载 130+ 提示词模板为每位家人的专业能力增强
  └── 激活 MultimodalManager 支持真实语音/图像/文档处理
```

---

*文档结束*

> 亦师亦友亦伯乐，一言一语一协同。
> 八魂归一云枢成，万象归元智慧行。
>
> ***YanYuCloudCube Team***
> *言启象限 | 语枢未来*
