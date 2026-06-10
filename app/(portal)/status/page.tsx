"use client"

import type { Device, McpService } from "@yyc3/core"
import { DeviceCard, McpStatusCard } from "@yyc3/ui"
import { Database, RefreshCw } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

interface McpServerRow {
  id: string
  name: string
  display_name: string | null
  description: string | null
  type: string
  enabled: boolean
  category: string | null
  version: string | null
  timeout: number
}

interface HealthDevice {
  device_name: string
  device_host: string
  device_type: string | null
  status: string
  latency_ms: number
  checked_at: string
}

interface StatusData {
  mcpServers: McpServerRow[]
  mcpStats: { total: number; enabled: number }
  callSummary: { status: string; count: number; avg_duration_ms: number | null }[]
  healthDevices: HealthDevice[]
  healthStats: { devices: number; online: number; offline: number; unknown: number }
  ollama: { status: string; models: string[] }
  timestamp: number
}

export default function StatusPage() {
  const [data, setData] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [serversRes, logsRes, healthRes, statusRes] = await Promise.all([
        fetch("/api/mcp/servers"),
        fetch("/api/mcp/call-logs"),
        fetch("/api/health"),
        fetch("/api/status"),
      ])

      const servers = serversRes.ok ? await serversRes.json() : { servers: [], stats: { total: 0, enabled: 0 } }
      const logs = logsRes.ok ? await logsRes.json() : { summary: [] }
      const health = healthRes.ok ? await healthRes.json() : { devices: [], stats: { devices: 0, online: 0, offline: 0, unknown: 0 } }
      const status = statusRes.ok ? await statusRes.json() : { ollama: { status: "offline", models: [] } }

      setData({
        mcpServers: servers.servers || [],
        mcpStats: servers.stats || { total: 0, enabled: 0 },
        callSummary: logs.summary || [],
        healthDevices: health.devices || [],
        healthStats: health.stats || { devices: 0, online: 0, offline: 0, unknown: 0 },
        ollama: status.ollama || { status: "offline", models: [] },
        timestamp: Date.now(),
      })
    } catch { }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, 30000)
    return () => clearInterval(interval)
  }, [fetchAll])

  if (!data && loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold font-sans text-neutral-900">状态监控</h1>
        <p className="mt-1 text-sm text-neutral-500 font-sans">正在连接 PostgreSQL...</p>
        <div className="animate-pulse mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border border-neutral-200 bg-white p-4 h-24" />
          ))}
        </div>
      </div>
    )
  }

  const allMcp: McpService[] = [
    {
      name: "Ollama",
      type: "http",
      status: data?.ollama.status === "online" ? "online" : "offline",
      tools: data?.ollama.models || [],
      quotaUsed: 0,
      quotaTotal: 0,
    },
    ...(data?.mcpServers.map((s) => ({
      name: s.display_name || s.name,
      type: (s.type === "stdio" || s.type === "http" ? s.type : "stdio") as "stdio" | "http",
      status: (s.enabled ? "online" : "offline") as "online" | "offline",
      tools: [] as string[],
      quotaUsed: 0,
      quotaTotal: 0,
    })) || []),
  ]

  const onlineMcp = allMcp.filter((s) => s.status === "online").length
  const devices: Device[] = (data?.healthDevices || []).map((d) => ({
    name: d.device_name,
    hostname: d.device_name,
    ip: d.device_host,
    type: (d.device_type || "server") as Device["type"],
    status: (d.status === "healthy" || d.status === "online" ? "online" : d.status === "unhealthy" || d.status === "offline" ? "offline" : "unknown") as Device["status"],
  }))
  const lastUpdate = data?.timestamp ? new Date(data.timestamp).toLocaleTimeString("zh-CN") : "--"
  const totalCalls = data?.callSummary.reduce((sum, s) => sum + s.count, 0) || 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-sans text-neutral-900">状态监控</h1>
          <p className="mt-1 text-sm text-neutral-500 font-sans flex items-center gap-1.5">
            <Database className="w-3 h-3" />
            PostgreSQL 实时数据 · 每 30s 刷新 · {lastUpdate}
          </p>
        </div>
        <button
          onClick={fetchAll}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs text-neutral-600 font-sans hover:bg-neutral-50 transition-all"
          aria-label="刷新状态"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          刷新
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 font-sans mb-1">MCP 服务</p>
          <p className="text-2xl font-bold font-sans text-neutral-900">
            {onlineMcp}<span className="text-sm text-neutral-400 font-normal">/{allMcp.length}</span>
          </p>
          <p className="text-xs text-emerald-600 font-sans mt-1">在线</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 font-sans mb-1">设备在线</p>
          <p className="text-2xl font-bold font-sans text-neutral-900">
            {data?.healthStats.online ?? 0}<span className="text-sm text-neutral-400 font-normal">/{data?.healthStats.devices ?? 0}</span>
          </p>
          <p className="text-xs text-neutral-500 font-sans mt-1">台</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 font-sans mb-1">调用次数</p>
          <p className="text-2xl font-bold font-sans text-neutral-900">{totalCalls}</p>
          <p className="text-xs text-neutral-500 font-sans mt-1">MCP 总调用</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 font-sans mb-1">Ollama</p>
          <p className="text-2xl font-bold font-sans">
            {data?.ollama.status === "online" ? (
              <span className="text-emerald-600">在线</span>
            ) : (
              <span className="text-neutral-400">离线</span>
            )}
          </p>
          <p className="text-xs text-neutral-500 font-sans mt-1">{data?.ollama.models?.length ?? 0} 个模型</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 font-sans mb-1">数据源</p>
          <p className="text-2xl font-bold font-sans text-neutral-900">
            <span className="text-blue-600">PG</span>
          </p>
          <p className="text-xs text-neutral-500 font-sans mt-1">PostgreSQL 15</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold font-sans text-neutral-900 mb-4">MCP 服务状态</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {allMcp.map((service) => (
            <McpStatusCard key={service.name} service={service} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold font-sans text-neutral-900 mb-4">设备矩阵</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {devices.map((device) => (
            <DeviceCard key={device.hostname} device={device} />
          ))}
        </div>
      </div>
    </div>
  )
}
