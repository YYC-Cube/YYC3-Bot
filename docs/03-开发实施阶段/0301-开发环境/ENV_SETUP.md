# YYC³ 环境变量配置指南

本文档详细说明 YYC³ SaaS 平台所需的所有环境变量配置。

## 快速开始

1. 复制 `.env.example` 文件为 `.env.local`：
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. 根据下方说明填入实际配置值

3. 重启开发服务器：
   \`\`\`bash
   npm run dev
   \`\`\`

## 环境变量分类

### 1. 应用基础配置

#### `NEXT_PUBLIC_APP_URL`
- **说明**: 应用的公开访问 URL
- **示例**: `https://yyc3.app` 或 `http://localhost:3000`
- **必需**: 生产环境必需
- **用途**: 用于生成绝对 URL、OAuth 回调等

#### `NODE_ENV`
- **说明**: 应用运行环境
- **可选值**: `development` | `production` | `test`
- **默认值**: `development`
- **用途**: 控制应用行为和优化级别

---

### 2. AI 服务配置

YYC³ 的核心功能依赖 AI 服务。我们支持多个 AI 提供商，您可以根据需求选择配置。

#### `OPENAI_API_KEY` ⭐ 推荐
- **说明**: OpenAI API 密钥
- **获取**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **必需**: 是（核心功能）
- **用途**: 
  - 智能数据分析（GPT-4）
  - 会议纪要生成（GPT-4 + Whisper）
  - 客服机器人（GPT-4）
  - 工作流优化分析（GPT-4）
- **格式**: `sk-...`
- **费用**: 按使用量计费，详见 [OpenAI 定价](https://openai.com/pricing)

#### `ANTHROPIC_API_KEY` (可选)
- **说明**: Anthropic Claude API 密钥
- **获取**: [https://console.anthropic.com/](https://console.anthropic.com/)
- **必需**: 否
- **用途**: 可作为 OpenAI 的替代方案
- **格式**: `sk-ant-...`

#### `XAI_API_KEY` (可选)
- **说明**: xAI Grok API 密钥
- **获取**: [https://console.x.ai/](https://console.x.ai/)
- **必需**: 否
- **用途**: 使用 Grok 模型进行推理
- **格式**: `xai-...`

#### `GROQ_API_KEY` (可选)
- **说明**: Groq API 密钥（超快推理速度）
- **获取**: [https://console.groq.com/](https://console.groq.com/)
- **必需**: 否
- **用途**: 需要低延迟响应的场景
- **格式**: `gsk_...`

---

### 3. 数据库配置

YYC³ 支持 Supabase 和 Neon 两种数据库方案，选择其一即可。

#### 方案 A: Supabase（推荐）⭐

**优势**: 
- 内置认证系统
- 实时数据订阅
- 向量数据库支持
- 文件存储
- 免费额度充足

**配置变量**:

##### `NEXT_PUBLIC_SUPABASE_URL`
- **说明**: Supabase 项目 URL
- **获取**: Supabase 项目设置 → API → Project URL
- **必需**: 是（如使用 Supabase）
- **格式**: `https://xxxxx.supabase.co`
- **公开**: 是（可在客户端使用）

##### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **说明**: Supabase 匿名密钥
- **获取**: Supabase 项目设置 → API → anon public
- **必需**: 是（如使用 Supabase）
- **格式**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **公开**: 是（可在客户端使用）

##### `SUPABASE_SERVICE_ROLE_KEY`
- **说明**: Supabase 服务角色密钥（管理员权限）
- **获取**: Supabase 项目设置 → API → service_role secret
- **必需**: 是（如使用 Supabase）
- **格式**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **安全**: ⚠️ 仅在服务端使用，不要暴露到客户端

##### `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`
- **说明**: 开发环境认证回调 URL
- **示例**: `http://localhost:3000/auth/callback`
- **必需**: 否（开发环境推荐）
- **用途**: 本地开发时的 OAuth 回调

**设置步骤**:
1. 访问 [Supabase](https://supabase.com/) 创建项目
2. 在项目设置中找到 API 密钥
3. 运行数据库迁移脚本（见下方）
4. 配置 Row Level Security (RLS) 策略

#### 方案 B: Neon

**优势**:
- Serverless PostgreSQL
- 自动扩缩容
- 分支功能（类似 Git）

**配置变量**:

##### `DATABASE_URL`
- **说明**: PostgreSQL 连接字符串
- **获取**: Neon 控制台 → Connection String
- **必需**: 是（如使用 Neon）
- **格式**: `postgresql://user:password@host/database?sslmode=require`
- **安全**: ⚠️ 仅在服务端使用

---

### 4. 缓存与队列

#### `KV_REST_API_URL`
- **说明**: Upstash Redis REST API URL
- **获取**: [Upstash 控制台](https://console.upstash.com/)
- **必需**: 推荐（用于性能优化）
- **用途**:
  - AI 响应缓存
  - 会话管理
  - 速率限制
- **格式**: `https://xxxxx.upstash.io`

#### `KV_REST_API_TOKEN`
- **说明**: Upstash Redis REST API Token
- **获取**: Upstash 控制台
- **必需**: 推荐
- **格式**: `AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

---

### 5. 文件存储

#### `BLOB_READ_WRITE_TOKEN`
- **说明**: Vercel Blob 存储令牌
- **获取**: Vercel 项目设置 → Storage → Blob
- **必需**: 否（如需文件上传功能则必需）
- **用途**:
  - 会议录音上传
  - 用户头像存储
  - 文档附件
- **格式**: `vercel_blob_rw_...`

---

### 6. 认证与安全

#### `NEXTAUTH_SECRET`
- **说明**: NextAuth.js 加密密钥
- **生成**: `openssl rand -base64 32`
- **必需**: 生产环境必需
- **用途**: 加密 JWT token 和会话数据
- **格式**: 32 字符随机字符串

#### `NEXTAUTH_URL`
- **说明**: NextAuth.js 回调 URL
- **示例**: `https://yyc3.app` 或 `http://localhost:3000`
- **必需**: 生产环境必需
- **用途**: OAuth 回调和会话管理

---

### 7. 监控与分析

#### `NEXT_PUBLIC_VERCEL_ANALYTICS_ID`
- **说明**: Vercel Analytics ID
- **获取**: Vercel 项目设置 → Analytics
- **必需**: 否
- **用途**: 网站访问分析

#### `SENTRY_DSN`
- **说明**: Sentry 错误追踪 DSN
- **获取**: [Sentry 控制台](https://sentry.io/)
- **必需**: 否（生产环境推荐）
- **用途**: 错误监控和性能追踪

---

## 数据库初始化

### Supabase 数据库设置

1. 运行知识库表创建脚本：
   \`\`\`bash
   # 在 Supabase SQL Editor 中执行
   # 或使用 Supabase CLI
   supabase db push
   \`\`\`

2. 执行 `scripts/create-knowledge-base-tables.sql`

3. 启用 Row Level Security (RLS)：
   \`\`\`sql
   -- 示例 RLS 策略
   ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Users can read public knowledge base"
   ON knowledge_base FOR SELECT
   USING (is_public = true OR auth.uid() = user_id);
   \`\`\`

### Neon 数据库设置

1. 使用 Prisma 或直接 SQL 创建表结构
2. 运行迁移脚本

---

## 环境变量优先级

1. `.env.local` - 本地开发（不提交到 Git）
2. `.env.production` - 生产环境
3. `.env.development` - 开发环境
4. `.env` - 默认配置

**推荐做法**:
- 将 `.env.example` 提交到 Git 作为模板
- 将 `.env.local` 添加到 `.gitignore`
- 在 Vercel 项目设置中配置生产环境变量

---

## 安全最佳实践

1. **永远不要提交真实密钥到 Git**
   ```bash
   # 确保 .gitignore 包含
   .env.local
   .env*.local
   ```

2. **使用环境变量而非硬编码**
   ```typescript
   // ❌ 错误
   const apiKey = "sk-1234567890"
   
   // ✅ 正确
   const apiKey = process.env.OPENAI_API_KEY
   ```

3. **区分客户端和服务端变量**
   - `NEXT_PUBLIC_*` 前缀的变量会暴露到浏览器
   - 敏感密钥（如 API Key）不要使用 `NEXT_PUBLIC_` 前缀

4. **定期轮换密钥**
   - 建议每 90 天更换一次 API 密钥
   - 使用密钥管理服务（如 Vercel Secrets）

5. **使用最小权限原则**
   - 为不同环境使用不同的 API 密钥
   - 限制 API 密钥的权限范围

6. **配置 API 密钥加密**
   - 添加 `API_KEY_ENCRYPTION_KEY` 环境变量（至少32字符的随机字符串）
   - 用于加密存储的 API 密钥
   - 使用命令生成安全的加密密钥：`openssl rand -hex 32`

7. **监控 API 密钥使用情况**
   - 记录所有 API 调用
   - 设置使用限制
   - 检测异常访问模式

---

## 故障排查

### 问题：AI 功能无法使用

**检查清单**:
1. 确认 `OPENAI_API_KEY` 已正确配置
2. 检查 API 密钥是否有效（未过期、有余额）
3. 查看浏览器控制台和服务器日志
4. 验证网络连接（某些地区可能需要代理）

### 问题：数据库连接失败

**检查清单**:
1. 确认数据库 URL 格式正确
2. 检查数据库服务是否运行
3. 验证网络防火墙设置
4. 确认数据库表已创建

### 问题：环境变量未生效

**解决方案**:
1. 重启开发服务器
2. 清除 Next.js 缓存：`rm -rf .next`
3. 检查变量名拼写
4. 确认文件名为 `.env.local`（不是 `.env.local.txt`）

---

## 成本估算

### 开发环境（免费）
- Supabase: 免费额度（500MB 数据库，1GB 文件存储）
- Upstash: 免费额度（10,000 命令/天）
- Vercel: 免费部署

### 生产环境（月度估算）
- OpenAI API: $20-100（取决于使用量）
- Supabase Pro: $25/月
- Upstash: $10-30/月
- Vercel Pro: $20/月

**总计**: 约 $75-175/月（中小型应用）

---

## 相关资源

- [Next.js 环境变量文档](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel 环境变量指南](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase 文档](https://supabase.com/docs)
- [OpenAI API 文档](https://platform.openai.com/docs)

---

**更新时间**: 2024-12-25
**维护者**: YYC³ 开发团队
