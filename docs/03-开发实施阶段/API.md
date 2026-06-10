# YYC³ API 文档

## 目录

- [概述](#概述)
- [认证](#认证)
- [AI 数据分析 API](#ai-数据分析-api)
- [AI 协作助手 API](#ai-协作助手-api)
- [智能客服 API](#智能客服-api)
- [工作流自动化 API](#工作流自动化-api)
- [隐私设置 API](#隐私设置-api)
- [错误处理](#错误处理)
- [速率限制](#速率限制)

## 概述

YYC³ 提供 RESTful API 和流式 API，支持所有核心 AI 功能。所有 API 端点都使用 HTTPS 加密传输。

**Base URL**: `https://api.yyc3.app` (生产环境)  
**Base URL**: `http://localhost:3000` (开发环境)

**API 版本**: v1  
**内容类型**: `application/json`

## 认证

### API 密钥认证

\`\`\`http
Authorization: Bearer YOUR_API_KEY
\`\`\`

### 会话认证

使用 Next.js 内置的会话管理，通过 Cookie 自动处理。

## AI 数据分析 API

### 创建数据分析对话

**端点**: `POST /api/ai/analytics`

**描述**: 使用自然语言查询数据并生成可视化图表。

**请求体**:

\`\`\`json
{
  "messages": [
    {
      "role": "user",
      "content": "显示本月销售额趋势"
    }
  ]
}
\`\`\`

**响应**: 流式响应 (Server-Sent Events)

\`\`\`
data: {"type":"text","content":"正在查询本月销售数据..."}

data: {"type":"tool_call","name":"queryDatabase","args":{"query":"SELECT date, amount FROM sales WHERE month = CURRENT_MONTH"}}

data: {"type":"tool_result","data":[{"date":"2024-01-01","amount":15000},...]}

data: {"type":"tool_call","name":"generateChart","args":{"type":"line","data":[...]}}

data: {"type":"chart","config":{...}}

data: {"type":"text","content":"根据数据分析，本月销售额呈上升趋势..."}
\`\`\`

**工具调用**:

1. **queryDatabase**: 查询数据库
   \`\`\`typescript
   {
     query: string;        // SQL 查询语句
     parameters?: any[];   // 查询参数
   }
   \`\`\`

2. **generateChart**: 生成图表配置
   \`\`\`typescript
   {
     type: 'line' | 'bar' | 'pie';  // 图表类型
     data: Array<{                   // 数据数组
       name: string;
       value: number;
     }>;
     title?: string;                 // 图表标题
   }
   \`\`\`

**错误响应**:

\`\`\`json
{
  "error": "Invalid query format",
  "code": "INVALID_REQUEST",
  "details": "..."
}
\`\`\`

## AI 协作助手 API

### 生成会议纪要

**端点**: `POST /api/ai/meeting-notes`

**描述**: 从会议内容生成结构化纪要。

**请求体**:

\`\`\`json
{
  "content": "会议内容文字记录...",
  "participants": ["张三", "李四"],
  "type": "text"
}
\`\`\`

或上传音频:

\`\`\`json
{
  "audioUrl": "https://...",
  "participants": ["张三", "李四"],
  "type": "audio"
}
\`\`\`

**响应**:

\`\`\`json
{
  "summary": {
    "title": "产品规划会议",
    "date": "2024-01-15",
    "participants": ["张三", "李四"],
    "keyPoints": [
      "讨论了 Q1 产品路线图",
      "确定了三个核心功能优先级"
    ],
    "decisions": [
      "下周开始 AI 功能开发",
      "预算增加 20%"
    ],
    "actionItems": [
      {
        "task": "准备技术方案",
        "assignee": "张三",
        "deadline": "2024-01-20"
      }
    ]
  }
}
\`\`\`

### 智能任务分配

**端点**: `POST /api/ai/task-assignment`

**描述**: 根据团队成员能力和任务需求推荐最佳分配。

**请求体**:

\`\`\`json
{
  "task": {
    "title": "开发用户认证模块",
    "description": "实现 OAuth 2.0 认证",
    "priority": "high",
    "estimatedHours": 16,
    "requiredSkills": ["Node.js", "OAuth", "Security"]
  },
  "teamMembers": [
    {
      "id": "user_1",
      "name": "张三",
      "skills": ["Node.js", "React", "OAuth"],
      "currentWorkload": 30,
      "availability": "available"
    }
  ]
}
\`\`\`

**响应**:

\`\`\`json
{
  "recommendations": [
    {
      "memberId": "user_1",
      "memberName": "张三",
      "score": 0.92,
      "reasoning": "张三具备所需的 OAuth 和 Node.js 技能，当前工作负载适中，可以承接此任务。",
      "confidence": 0.88
    }
  ]
}
\`\`\`

## 智能客服 API

### 客服对话

**端点**: `POST /api/ai/customer-support`

**描述**: AI 客服机器人对话接口。

**请求体**:

\`\`\`json
{
  "messages": [
    {
      "role": "user",
      "content": "如何重置密码？"
    }
  ],
  "userId": "user_123",
  "sessionId": "session_456"
}
\`\`\`

**响应**: 流式响应

\`\`\`
data: {"type":"text","content":"我来帮您解决密码重置问题..."}

data: {"type":"tool_call","name":"searchKnowledgeBase","args":{"query":"密码重置"}}

data: {"type":"tool_result","documents":[{"title":"密码重置指南","content":"..."}]}

data: {"type":"text","content":"您可以通过以下步骤重置密码：\n1. 点击登录页面的'忘记密码'\n2. 输入您的邮箱..."}
\`\`\`

**工具调用**:

1. **searchKnowledgeBase**: 搜索知识库
   \`\`\`typescript
   {
     query: string;      // 搜索关键词
     limit?: number;     // 返回结果数量
   }
   \`\`\`

2. **createTicket**: 创建支持工单
   \`\`\`typescript
   {
     title: string;
     description: string;
     priority: 'low' | 'medium' | 'high';
     category: string;
   }
   \`\`\`

## 工作流自动化 API

### 执行工作流

**端点**: `POST /api/workflow/execute`

**描述**: 执行指定的工作流。

**请求体**:

\`\`\`json
{
  "workflowId": "workflow_123",
  "input": {
    "data": "..."
  }
}
\`\`\`

**响应**:

\`\`\`json
{
  "executionId": "exec_789",
  "status": "running",
  "startedAt": "2024-01-15T10:00:00Z"
}
\`\`\`

### 查询执行状态

**端点**: `GET /api/workflow/status/{executionId}`

**响应**:

\`\`\`json
{
  "executionId": "exec_789",
  "workflowId": "workflow_123",
  "status": "completed",
  "startedAt": "2024-01-15T10:00:00Z",
  "completedAt": "2024-01-15T10:05:00Z",
  "steps": [
    {
      "id": "step_1",
      "type": "trigger",
      "status": "completed",
      "output": {...}
    }
  ]
}
\`\`\`

### 分析工作流性能

**端点**: `POST /api/workflow/analyze`

**描述**: 使用 AI 分析工作流执行历史并提供优化建议。

**请求体**:

\`\`\`json
{
  "workflowId": "workflow_123",
  "executionHistory": [...]
}
\`\`\`

**响应**:

\`\`\`json
{
  "analysis": {
    "performanceScore": 75,
    "bottlenecks": [
      {
        "stepId": "step_3",
        "issue": "平均执行时间过长",
        "avgDuration": 5000,
        "recommendation": "考虑添加缓存或优化查询"
      }
    ],
    "optimizationSuggestions": [
      "将步骤 2 和步骤 3 合并以减少网络开销",
      "为频繁查询的数据添加缓存层"
    ],
    "automationOpportunities": [
      "可以自动化错误重试逻辑"
    ]
  }
}
\`\`\`

## 隐私设置 API

### 获取隐私设置

**端点**: `GET /api/settings/privacy`

**响应**:

\`\`\`json
{
  "aiFeatures": {
    "dataAnalysis": true,
    "collaboration": true,
    "customerSupport": false,
    "workflowAutomation": true
  },
  "dataCollection": {
    "usageAnalytics": true,
    "errorReporting": true,
    "performanceMetrics": false
  },
  "dataRetention": {
    "chatHistory": 90,
    "analyticsData": 365,
    "auditLogs": 730
  }
}
\`\`\`

### 更新隐私设置

**端点**: `PUT /api/settings/privacy`

**请求体**:

\`\`\`json
{
  "aiFeatures": {
    "dataAnalysis": false
  }
}
\`\`\`

**响应**:

\`\`\`json
{
  "success": true,
  "message": "隐私设置已更新"
}
\`\`\`

## 错误处理

### 错误响应格式

\`\`\`json
{
  "error": "错误描述",
  "code": "ERROR_CODE",
  "details": "详细信息",
  "timestamp": "2024-01-15T10:00:00Z"
}
\`\`\`

### 错误代码

| 代码 | HTTP 状态 | 描述 |
|------|-----------|------|
| `INVALID_REQUEST` | 400 | 请求格式错误 |
| `UNAUTHORIZED` | 401 | 未授权 |
| `FORBIDDEN` | 403 | 无权限 |
| `NOT_FOUND` | 404 | 资源不存在 |
| `RATE_LIMIT_EXCEEDED` | 429 | 超过速率限制 |
| `INTERNAL_ERROR` | 500 | 服务器内部错误 |
| `AI_SERVICE_ERROR` | 503 | AI 服务不可用 |

## 速率限制

### 限制规则

| 端点类型 | 限制 |
|---------|------|
| AI 对话 API | 60 请求/分钟 |
| 数据查询 API | 100 请求/分钟 |
| 工作流执行 | 30 请求/分钟 |
| 其他 API | 120 请求/分钟 |

### 速率限制响应头

\`\`\`http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1642248000
\`\`\`

### 超限响应

\`\`\`json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60
}
\`\`\`

## Webhook

### 配置 Webhook

**端点**: `POST /api/webhooks`

**请求体**:

\`\`\`json
{
  "url": "https://your-app.com/webhook",
  "events": ["workflow.completed", "ticket.created"],
  "secret": "your_webhook_secret"
}
\`\`\`

### Webhook 事件

\`\`\`json
{
  "event": "workflow.completed",
  "timestamp": "2024-01-15T10:00:00Z",
  "data": {
    "workflowId": "workflow_123",
    "executionId": "exec_789",
    "status": "completed"
  }
}
\`\`\`

## SDK 和客户端库

### JavaScript/TypeScript

\`\`\`bash
npm install @yyc3/sdk
\`\`\`

\`\`\`typescript
import { YYC3Client } from '@yyc3/sdk';

const client = new YYC3Client({
  apiKey: 'your_api_key'
});

// 数据分析
const response = await client.analytics.query({
  messages: [{ role: 'user', content: '显示销售趋势' }]
});

// 工作流执行
const execution = await client.workflow.execute({
  workflowId: 'workflow_123',
  input: { data: '...' }
});
\`\`\`

---

**维护者**: YYC³ API 团队  
**最后更新**: 2024-01  
**版本**: 1.0.0
