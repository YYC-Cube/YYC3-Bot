import { NextResponse } from "next/server"
import { checkHealth } from "@yyc3/ai"

interface DeviceConfig {
  name: string
  hostname: string
  ip: string
  type: string
}

const DEVICES: DeviceConfig[] = [
  { name: "MacBook M4 Max", hostname: "yyc3-22", ip: "192.168.3.22", type: "workstation" },
  { name: "NVIDIA DGX Spark N1", hostname: "yyc3-101", ip: "192.168.3.101", type: "compute" },
  { name: "NVIDIA DGX Spark N2", hostname: "yyc3-102", ip: "192.168.3.102", type: "compute" },
  { name: "iMac M4", hostname: "yyc3-imac", ip: "192.168.3.x", type: "workstation" },
  { name: "华为 MateBook Pro", hostname: "yyc3-66", ip: "192.168.3.66", type: "workstation" },
  { name: "NAS 服务器", hostname: "yyc3-45", ip: "192.168.3.45", type: "nas" },
  { name: "设备 #55 Music", hostname: "yyc3-55", ip: "192.168.3.55", type: "server" },
]

const MCP_SERVICES = [
  { name: "zai-vision-mcp", type: "stdio", quotaUsed: 0, quotaTotal: 5 },
  { name: "web-search-prime", type: "http", quotaUsed: 2680, quotaTotal: 4000 },
  { name: "web-reader", type: "http", quotaUsed: 2000, quotaTotal: 4000 },
  { name: "zread", type: "http", quotaUsed: 680, quotaTotal: 4000 },
]

async function checkDevice(device: DeviceConfig): Promise<"online" | "offline"> {
  if (device.ip.includes(".x")) return "offline"
  try {
    const res = await fetch(`http://${device.ip}`, { signal: AbortSignal.timeout(2000) })
    return res.status < 500 ? "online" : "offline"
  } catch {
    return "offline"
  }
}

export async function GET() {
  try {
    const [ollamaHealth, ...deviceStatuses] = await Promise.all([
      checkHealth("ollama", { baseUrl: process.env.OLLAMA_BASE_URL }),
      ...DEVICES.map(checkDevice),
    ])

    const devices = DEVICES.map((d, i) => ({ ...d, status: deviceStatuses[i] }))

    return NextResponse.json({
      timestamp: Date.now(),
      ollama: {
        name: "Ollama",
        type: "http",
        status: ollamaHealth.online ? "online" : "offline",
        models: ollamaHealth.models || [],
        baseUrl: ollamaHealth.baseUrl,
        latencyMs: ollamaHealth.latencyMs,
      },
      mcpServices: MCP_SERVICES.map((s) => ({ ...s, status: "online", tools: [] })),
      devices,
    })
  } catch {
    return NextResponse.json({
      timestamp: Date.now(),
      ollama: { name: "Ollama", type: "http", status: "offline", models: [], baseUrl: "", latencyMs: 0 },
      mcpServices: MCP_SERVICES.map((s) => ({ ...s, status: "unknown", tools: [] })),
      devices: DEVICES.map((d) => ({ ...d, status: "unknown" })),
    })
  }
}

export const dynamic = "force-static"
