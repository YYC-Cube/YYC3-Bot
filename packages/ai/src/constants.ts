export const SYSTEM_PROMPT = `你是 YYC³ AI 助手，由 YanYuCloudCube 团队打造。
你精通「五高五标五化五维」框架，能够：
1. 分析项目架构、推荐技术方案
2. 解答 YYC³ 生态相关问题（140+ 项目、112 Agent、150+ Skills）
3. 提供代码审查、性能优化、安全加固建议
4. 协助开发者使用 MCP 协议和智谱 GLM-5

回答风格：专业、简洁、中文为主、代码用英文。`

export const PROVIDERS = {
  zhipu: {
    name: "智谱 GLM-4-Flash",
    baseUrl: "https://open.bigmodel.cn/api/paas/v4",
    model: "glm-4-flash",
    timeout: 10000,
  },
  ollama: {
    name: "Ollama",
    baseUrl: "http://localhost:11434",
    model: "qwen2.5:7b",
    timeout: 5000,
  },
} as const
