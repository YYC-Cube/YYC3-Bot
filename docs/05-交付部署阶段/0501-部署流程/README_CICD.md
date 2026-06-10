# YYC³ CI/CD 流程文档

## 目录

- [概述](#概述)
- [CI/CD 流程](#cicd-流程)
- [环境变量配置](#环境变量配置)
- [本地开发环境](#本地开发环境)
- [部署流程](#部署流程)
- [Docker 部署](#docker-部署)
- [故障排查](#故障排查)

## 概述

本项目使用 GitHub Actions 实现持续集成和持续部署 (CI/CD) 流程，确保代码质量并自动化部署过程。CI/CD 工作流包含以下主要阶段：

1. **代码质量检查**：自动运行 lint 确保代码符合项目规范
2. **构建测试**：验证项目是否能正常构建
3. **自动部署**：将主分支代码自动部署到 Vercel
4. **Docker 构建**：为自托管环境构建 Docker 镜像

## CI/CD 流程

### 工作流触发条件

- **Pull Request**：当向 `main` 或 `master` 分支提交 Pull Request 时
- **Push**：当代码推送到 `main` 或 `master` 分支时

### 工作流阶段

1. **代码质量检查 (`lint`)**
   - 检出代码
   - 设置 Node.js 环境
   - 安装依赖
   - 运行 lint 检查

2. **构建测试 (`build`)**
   - 检出代码
   - 设置 Node.js 环境
   - 安装依赖
   - 构建项目
   - 上传构建产物

3. **部署到 Vercel (`deploy`)**
   - 仅在主分支推送时触发
   - 使用 Vercel CLI 部署
   - 应用生产环境配置

4. **Docker 构建 (`docker-build`)**
   - 配置 Docker Buildx
   - 登录 DockerHub
   - 构建并推送 Docker 镜像
   - 支持多标签构建

## 环境变量配置

### GitHub Actions Secrets

在 GitHub 仓库设置中配置以下环境变量：

- `VERCEL_TOKEN`：Vercel 部署令牌
- `DOCKER_USERNAME`：DockerHub 用户名
- `DOCKER_PASSWORD`：DockerHub 密码或访问令牌

### 本地环境变量

创建 `.env.local` 文件，配置以下环境变量：

```bash
# 数据库连接
DATABASE_URL=postgresql://user:password@localhost:5432/yyc3
POSTGRES_PASSWORD=your_postgres_password

# Redis 连接
REDIS_URL=redis://localhost:6379

# AI 服务
OPENAI_API_KEY=sk-...

# 认证
NEXTAUTH_SECRET=your-secret-key
```

## 本地开发环境

### 安装依赖

```bash
pnpm install
```

### 本地开发服务

```bash
pnpm dev
```

### 本地构建测试

```bash
pnpm build
pnpm start
```

### CI 脚本

```bash
# 安装依赖（模拟 CI 环境）
pnpm ci:setup

# 构建（模拟 CI 环境）
pnpm ci:build

# 运行测试（预留）
pnpm ci:test

# 健康检查（预留）
pnpm health:check
```

## 部署流程

### Vercel 部署

主分支推送后自动部署到 Vercel，无需手动操作。

### Docker 部署

本地 Docker 构建和运行：

```bash
# 构建 Docker 镜像
pnpm docker:build

# 启动 Docker 容器（包含应用、PostgreSQL 和 Redis）
pnpm docker:up
```

使用 Docker Compose 配置：

```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止容器
docker-compose down
```

## 故障排查

### GitHub Actions 故障

1. **构建失败**
   - 检查依赖安装是否成功
   - 查看 lint 错误信息
   - 验证构建脚本

2. **部署失败**
   - 确认 Vercel 令牌有效
   - 检查环境变量配置
   - 验证构建产物是否正确上传

3. **Docker 构建失败**
   - 检查 Dockerfile 语法
   - 验证依赖安装
   - 确认网络连接正常

### 本地故障

1. **依赖冲突**
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

2. **构建缓存问题**
   ```bash
   rm -rf .next
   pnpm build
   ```

3. **Docker 网络问题**
   ```bash
   docker network prune
   docker-compose up -d
   ```

## 维护和更新

- 定期检查依赖版本并更新
- 监控 CI/CD 流程性能
- 根据项目需求调整工作流配置

---

**文档维护者**: YYC³ DevOps 团队  
**最后更新**: 2024-10  
**版本**: 1.0.0