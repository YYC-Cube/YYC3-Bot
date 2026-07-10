import { NextRequest, NextResponse } from "next/server"

/**
 * @route GET /api/ollama/models?baseUrl=...
 * @description 扫描本地 Ollama 可用模型列表
 */
export async function GET(req: NextRequest) {
  const baseUrl = req.nextUrl.searchParams.get("baseUrl") || "http://localhost:11434"

  try {
    const res = await fetch(`${baseUrl}/api/tags`, {
      signal: AbortSignal.timeout(5000),
    })

    if (!res.ok) {
      return NextResponse.json({ models: [], error: `Ollama 响应异常: ${res.status}` }, { status: 502 })
    }

    const data = await res.json()
    const models: string[] = (data.models || []).map((m: { name: string }) => m.name)

    return NextResponse.json({ models })
  } catch {
    return NextResponse.json(
      { models: [], error: "无法连接到 Ollama，请确认服务是否已启动" },
      { status: 503 },
    )
  }
}

export const dynamic = "force-static"