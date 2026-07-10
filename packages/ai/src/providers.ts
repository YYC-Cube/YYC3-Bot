import { PROVIDERS, SYSTEM_PROMPT } from "./constants"
import type { ChatMessage, ChatResult, HealthStatus } from "./types"

export interface ModelOverride {
  provider: "zhipu" | "ollama"
  model: string
  baseUrl?: string
  apiKey?: string
  timeout?: number
}

export async function checkHealth(
  provider: "zhipu" | "ollama",
  envOverrides?: { apiKey?: string; baseUrl?: string },
): Promise<HealthStatus> {
  const config = PROVIDERS[provider]
  const baseUrl = envOverrides?.baseUrl || config.baseUrl
  const start = Date.now()

  if (provider === "ollama") {
    try {
      const res = await fetch(`${baseUrl}/api/tags`, {
        signal: AbortSignal.timeout(config.timeout),
      })
      const data = await res.json()
      return {
        provider: config.name,
        online: true,
        models: (data.models || []).map((m: { name: string }) => m.name),
        baseUrl,
        latencyMs: Date.now() - start,
      }
    } catch {
      return { provider: config.name, online: false, baseUrl, latencyMs: Date.now() - start }
    }
  }

  try {
    const apiKey = envOverrides?.apiKey
    if (!apiKey) return { provider: config.name, online: false }
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 1,
      }),
      signal: AbortSignal.timeout(config.timeout),
    })
    return {
      provider: config.name,
      online: res.ok,
      baseUrl,
      latencyMs: Date.now() - start,
    }
  } catch {
    return { provider: config.name, online: false, baseUrl, latencyMs: Date.now() - start }
  }
}

/**
 * Original chatStream with automatic fallback (zhipu → ollama).
 * Kept for backward compatibility.
 */
export async function chatStream(
  messages: ChatMessage[],
  env: { zhipuKey?: string; zhipuBase?: string; ollamaBase?: string },
): Promise<ChatResult> {
  const allMessages: ChatMessage[] = [{ role: "system", content: SYSTEM_PROMPT }, ...messages]

  try {
    const zhipuBase = env.zhipuBase || PROVIDERS.zhipu.baseUrl
    const res = await fetch(`${zhipuBase}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.zhipuKey}`,
      },
      body: JSON.stringify({
        model: PROVIDERS.zhipu.model,
        messages: allMessages,
        stream: true,
        temperature: 0.7,
        top_p: 0.9,
      }),
      signal: AbortSignal.timeout(PROVIDERS.zhipu.timeout),
    })
    if (!res.ok) throw new Error(`Zhipu ${res.status}`)
    return { provider: "zhipu", stream: res.body! }
  } catch { /* ignore */ }

  const ollamaBase = env.ollamaBase || PROVIDERS.ollama.baseUrl
  const res = await fetch(`${ollamaBase}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: PROVIDERS.ollama.model,
      messages: allMessages,
      stream: true,
    }),
    signal: AbortSignal.timeout(PROVIDERS.ollama.timeout),
  })
  if (!res.ok) throw new Error(`Ollama ${res.status}`)

  return { provider: "ollama", stream: res.body!.pipeThrough(createOllamaTransformStream()) }
}

/**
 * Dynamic chatStream — accepts model override from user config.
 */
export async function chatStreamWithModel(
  messages: ChatMessage[],
  override: ModelOverride,
): Promise<ChatResult> {
  const allMessages: ChatMessage[] = [{ role: "system", content: SYSTEM_PROMPT }, ...messages]
  const apiKey = override.apiKey || process.env.ZHIPU_API_KEY || ""
  const timeout = override.timeout || PROVIDERS[override.provider]?.timeout || 10000
  const baseUrl = override.baseUrl || PROVIDERS[override.provider]?.baseUrl || ""

  if (override.provider === "zhipu") {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: override.model,
        messages: allMessages,
        stream: true,
        temperature: 0.7,
        top_p: 0.9,
      }),
      signal: AbortSignal.timeout(timeout),
    })
    if (!res.ok) throw new Error(`Zhipu ${res.status}`)
    return { provider: "zhipu", stream: res.body! }
  }

  // Ollama
  const res = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: override.model,
      messages: allMessages,
      stream: true,
    }),
    signal: AbortSignal.timeout(timeout),
  })
  if (!res.ok) throw new Error(`Ollama ${res.status}`)

  return { provider: "ollama", stream: res.body!.pipeThrough(createOllamaTransformStream()) }
}

function createOllamaTransformStream(): TransformStream<Uint8Array, Uint8Array> {
  return new TransformStream({
    transform(chunk, controller) {
      const decoder = new TextDecoder()
      const text = decoder.decode(chunk, { stream: true })
      for (const line of text.split("\n")) {
        if (!line.trim()) continue
        try {
          const parsed = JSON.parse(line)
          if (parsed.message?.content) {
            controller.enqueue(
              new TextEncoder().encode(
                `data: ${JSON.stringify({ choices: [{ delta: { content: parsed.message.content } }] })}\n\n`,
              ),
            )
          }
          if (parsed.done) {
            controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"))
          }
        } catch { /* ignore */ }
      }
    },
  })
}
