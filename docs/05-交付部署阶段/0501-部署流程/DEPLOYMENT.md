# YYC³ 部署指南

## 目录

- [部署前准备](#部署前准备)
- [Vercel 部署](#vercel-部署)
- [Docker 部署](#docker-部署)
- [环境变量配置](#环境变量配置)
- [数据库设置](#数据库设置)
- [域名配置](#域名配置)
- [监控和日志](#监控和日志)
- [故障排查](#故障排查)

## 部署前准备

### 系统要求

- Node.js 18.17 或更高版本
- pnpm 8.0 或更高版本（推荐）
- PostgreSQL 14 或更高版本
- Redis 6.0 或更高版本（可选，用于缓存）

### 依赖检查

\`\`\`bash
# 检查 Node.js 版本
node --version

# 检查 pnpm 版本
pnpm --version

# 安装依赖
pnpm install
\`\`\`

### 构建测试

\`\`\`bash
# 本地构建测试
pnpm build

# 运行生产构建
pnpm start
\`\`\`

## Vercel 部署

### 方式一：通过 Vercel CLI

\`\`\`bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署到生产环境
vercel --prod
\`\`\`

### 方式二：通过 GitHub 集成

1. **连接 GitHub 仓库**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "New Project"
   - 选择 GitHub 仓库

2. **配置项目**
   \`\`\`
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: pnpm build
   Output Directory: .next
   Install Command: pnpm install
   \`\`\`

3. **配置环境变量**
   - 在 Vercel 项目设置中添加环境变量
   - 参考 `.env.example` 文件

4. **部署**
   - 推送代码到 main 分支自动触发部署
   - 或手动点击 "Deploy" 按钮

### Vercel 配置文件

\`\`\`json
// vercel.json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=0, stale-while-revalidate"
        }
      ]
    }
  ]
}
\`\`\`

## Docker 部署

### Dockerfile

\`\`\`dockerfile
# Dockerfile
FROM node:18-alpine AS base

# 安装依赖
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# 构建应用
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN corepack enable pnpm && pnpm build

# 生产镜像
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
\`\`\`

### Docker Compose

\`\`\`yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: yyc3
      POSTGRES_USER: yyc3
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
\`\`\`

### 构建和运行

\`\`\`bash
# 构建镜像
docker build -t yyc3-saas .

# 运行容器
docker run -p 3000:3000 --env-file .env.local yyc3-saas

# 使用 Docker Compose
docker-compose up -d
\`\`\`

## 环境变量配置

### 生产环境变量

\`\`\`bash
# .env.production

# 应用配置
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yyc3.app

# 数据库
DATABASE_URL=postgresql://user:password@host:5432/yyc3

# Redis 缓存
REDIS_URL=redis://host:6379

# AI 服务
OPENAI_API_KEY=sk-...
AI_GATEWAY_URL=https://gateway.ai.cloudflare.com/v1/...

# 认证
NEXTAUTH_URL=https://yyc3.app
NEXTAUTH_SECRET=your-secret-key

# 第三方服务
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
SENDGRID_API_KEY=SG...

# 监控
VERCEL_ANALYTICS_ID=...
SENTRY_DSN=https://...
\`\`\`

### 环境变量验证

\`\`\`typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string().url(),
  OPENAI_API_KEY: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(32),
});

export const env = envSchema.parse(process.env);
\`\`\`

## 数据库设置

### 数据库迁移

\`\`\`bash
# 运行迁移脚本
psql $DATABASE_URL -f scripts/create-knowledge-base-tables.sql
psql $DATABASE_URL -f scripts/create-privacy-tables.sql
\`\`\`

### 数据库备份

\`\`\`bash
# 备份数据库
pg_dump $DATABASE_URL > backup.sql

# 恢复数据库
psql $DATABASE_URL < backup.sql
\`\`\`

### 数据库优化

\`\`\`sql
-- 创建索引
CREATE INDEX idx_ai_usage_user_id ON ai_usage_logs(user_id);
CREATE INDEX idx_ai_usage_timestamp ON ai_usage_logs(timestamp);
CREATE INDEX idx_knowledge_base_category ON knowledge_base(category);

-- 启用查询优化
ANALYZE;
VACUUM;
\`\`\`

## 域名配置

### DNS 设置

\`\`\`
# A 记录
yyc3.app        A       76.76.21.21

# CNAME 记录
www.yyc3.app    CNAME   cname.vercel-dns.com
api.yyc3.app    CNAME   cname.vercel-dns.com
\`\`\`

### SSL 证书

Vercel 自动提供 SSL 证书，无需手动配置。

### 自定义域名

1. 在 Vercel 项目设置中添加域名
2. 配置 DNS 记录
3. 等待 SSL 证书自动配置

## 监控和日志

### Vercel Analytics

\`\`\`typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
\`\`\`

### 错误监控 (Sentry)

\`\`\`typescript
// sentry.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
\`\`\`

### 日志记录

\`\`\`typescript
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${message}`, meta);
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${message}`, meta);
  }
};
\`\`\`

## 故障排查

### 常见问题

#### 1. 构建失败

\`\`\`bash
# 清除缓存
rm -rf .next node_modules
pnpm install
pnpm build
\`\`\`

#### 2. 数据库连接失败

\`\`\`bash
# 检查数据库连接
psql $DATABASE_URL -c "SELECT 1"

# 检查环境变量
echo $DATABASE_URL
\`\`\`

#### 3. API 超时

\`\`\`typescript
// 增加超时时间
export const maxDuration = 60; // 60 秒
\`\`\`

#### 4. 内存不足

\`\`\`json
// package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
\`\`\`

### 性能优化

\`\`\`typescript
// next.config.mjs
export default {
  // 启用 SWC 压缩
  swcMinify: true,
  
  // 图片优化
  images: {
    domains: ['your-cdn.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // 启用实验性功能
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
};
\`\`\`

### 健康检查

\`\`\`typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // 检查数据库连接
    await db.query('SELECT 1');
    
    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json(
      { status: 'unhealthy', error: error.message },
      { status: 503 }
    );
  }
}
\`\`\`

## 回滚策略

### Vercel 回滚

\`\`\`bash
# 通过 CLI 回滚到上一个部署
vercel rollback

# 回滚到特定部署
vercel rollback <deployment-url>
\`\`\`

### 数据库回滚

\`\`\`bash
# 恢复数据库备份
psql $DATABASE_URL < backup-$(date +%Y%m%d).sql
\`\`\`

## 扩展和优化

### 水平扩展

Vercel 自动处理水平扩展，无需手动配置。

### CDN 配置

\`\`\`typescript
// next.config.mjs
export default {
  assetPrefix: process.env.CDN_URL,
};
\`\`\`

### 缓存策略

\`\`\`typescript
// app/api/data/route.ts
export async function GET() {
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}
\`\`\`

---

**维护者**: YYC³ DevOps 团队  
**最后更新**: 2024-01  
**版本**: 1.0.0
