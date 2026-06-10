import { NextRequest, NextResponse } from "next/server"
import { chatStream, chatStreamWithModel } from "@yyc3/ai"
import type { ModelOverride } from "@yyc3/ai"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { messages, provider, model, baseUrl, apiKey } = body

  // If dynamic model config provided, use it directly
  if (provider && model) {
    const override: ModelOverride = {
      provider: provider as "zhipu" | "ollama",
      model,
      baseUrl: baseUrl || undefined,
      apiKey: apiKey || undefined,
    }
    try {
      const result = await chatStreamWithModel(messages, override)
      return new Response(result.stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "X-AI-Provider": result.provider,
        },
      })
    } catch (err) {
      return NextResponse.json(
        { error: `模型请求失败: ${err instanceof Error ? err.message : "未知错误"}` },
        { status: 502 },
      )
    }
  }

  // Fallback: use env-based auto-fallback (zhipu → ollama)
  try {
    const result = await chatStream(messages, {
      zhipuKey: process.env.ZHIPU_API_KEY,
      zhipuBase: process.env.ZHIPU_BASE_URL,
      ollamaBase: process.env.OLLAMA_BASE_URL,
    })

    return new Response(result.stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-AI-Provider": result.provider,
      },
    })
  } catch {
    return NextResponse.json(
      { error: "智谱和 Ollama 均不可用，请检查网络或启动 Ollama" },
      { status: 503 },
    )
  }
}