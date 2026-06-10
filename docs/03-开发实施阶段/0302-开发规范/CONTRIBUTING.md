# 贡献指南

感谢您对 YYC³ 项目的关注！我们欢迎所有形式的贡献。

## 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发流程](#开发流程)
- [提交规范](#提交规范)
- [代码审查](#代码审查)

## 行为准则

### 我们的承诺

为了营造开放和友好的环境，我们承诺：

- 使用友好和包容的语言
- 尊重不同的观点和经验
- 优雅地接受建设性批评
- 关注对社区最有利的事情
- 对其他社区成员表示同理心

## 如何贡献

### 报告 Bug

在提交 Bug 报告前，请：

1. 检查是否已有相关 Issue
2. 确认问题可以复现
3. 收集相关信息（版本、环境、错误日志）

**Bug 报告模板**:

\`\`\`markdown
**描述**
简要描述问题

**复现步骤**
1. 访问 '...'
2. 点击 '...'
3. 滚动到 '...'
4. 看到错误

**预期行为**
描述预期的正确行为

**实际行为**
描述实际发生的情况

**截图**
如果适用，添加截图

**环境**
- OS: [e.g. macOS 14.0]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

**附加信息**
其他相关信息
\`\`\`

### 功能建议

**功能建议模板**:

\`\`\`markdown
**问题描述**
当前存在什么问题？

**建议方案**
您希望如何解决？

**替代方案**
是否考虑过其他方案？

**附加信息**
其他相关信息或截图
\`\`\`

### 提交代码

1. **Fork 仓库**
2. **创建分支**: `git checkout -b feature/amazing-feature`
3. **提交更改**: `git commit -m 'feat: add amazing feature'`
4. **推送分支**: `git push origin feature/amazing-feature`
5. **创建 Pull Request**

## 开发流程

### 1. 设置开发环境

\`\`\`bash
# 克隆仓库
git clone https://github.com/your-username/yyc3-saas.git
cd yyc3-saas

# 安装依赖
pnpm install

# 复制环境变量
cp .env.example .env.local

# 启动开发服务器
pnpm dev
\`\`\`

### 2. 创建功能分支

\`\`\`bash
# 从 main 分支创建新分支
git checkout -b feature/your-feature-name

# 或修复 bug
git checkout -b fix/bug-description
\`\`\`

### 3. 开发和测试

\`\`\`bash
# 运行开发服务器
pnpm dev

# 运行测试
pnpm test

# 运行类型检查
pnpm type-check

# 运行 lint
pnpm lint
\`\`\`

### 4. 提交代码

遵循 [提交规范](#提交规范)

### 5. 创建 Pull Request

**PR 标题格式**: `<type>(<scope>): <description>`

**PR 描述模板**:

\`\`\`markdown
## 变更类型
- [ ] Bug 修复
- [ ] 新功能
- [ ] 重构
- [ ] 文档更新
- [ ] 性能优化
- [ ] 其他

## 变更描述
简要描述此 PR 的变更内容

## 相关 Issue
Closes #123

## 测试
- [ ] 单元测试已通过
- [ ] 集成测试已通过
- [ ] 手动测试已完成

## 截图
如果适用，添加截图

## 检查清单
- [ ] 代码遵循项目规范
- [ ] 已添加必要的测试
- [ ] 文档已更新
- [ ] 无破坏性变更
\`\`\`

## 提交规范

### 提交消息格式

\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

### Type 类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具链更新

### Scope 范围

- `analytics`: 数据分析模块
- `collaboration`: 协作模块
- `support`: 客服模块
- `workflow`: 工作流模块
- `ui`: UI 组件
- `api`: API 相关
- `docs`: 文档

### 示例

\`\`\`
feat(analytics): 添加数据导出功能

- 支持 CSV 和 JSON 格式
- 添加导出进度提示
- 优化大数据集导出性能

Closes #123
\`\`\`

## 代码审查

### 审查清单

**功能性**
- [ ] 代码实现了需求
- [ ] 边界情况已处理
- [ ] 错误处理完善

**代码质量**
- [ ] 遵循代码规范
- [ ] 无重复代码
- [ ] 函数职责单一
- [ ] 变量命名清晰

**性能**
- [ ] 无不必要的重渲染
- [ ] 大数据集已优化
- [ ] 图片已优化

**安全**
- [ ] 输入已验证
- [ ] 敏感数据已脱敏
- [ ] XSS 防护

**测试**
- [ ] 单元测试覆盖
- [ ] 集成测试通过
- [ ] 手动测试完成

### 审查流程

1. **自动检查**: CI/CD 自动运行测试和 lint
2. **代码审查**: 至少一位维护者审查代码
3. **测试验证**: 在测试环境验证功能
4. **合并**: 审查通过后合并到 main 分支

## 开发资源

### 文档

- [架构文档](./ARCHITECTURE.md)
- [API 文档](./API.md)
- [代码规范](./CODING_STANDARDS.md)
- [部署指南](./DEPLOYMENT.md)

### 工具

- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [AI SDK 文档](https://sdk.vercel.ai/docs)

## 社区

- **GitHub Discussions**: 讨论功能和想法
- **GitHub Issues**: 报告 Bug 和功能请求
- **Discord**: 实时交流（即将推出）

## 许可证

通过贡献代码，您同意您的贡献将在 MIT 许可证下发布。

---

**感谢您的贡献！** 🎉

**维护者**: YYC³ 核心团队  
**最后更新**: 2024-01  
**版本**: 1.0.0
