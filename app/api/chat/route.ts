import { NextRequest, NextResponse } from "next/server"
import { chatStream } from "@yyc3/ai"

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

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
      { status: 503 }
    )
  }
}
