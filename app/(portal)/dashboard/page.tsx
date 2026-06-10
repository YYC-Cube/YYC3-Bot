"use client"

import { useEffect, useState, useCallback } from "react"
import { cn } from "@yyc3/core"
import { Server, Cpu, Activity, Database, Clock, Wifi, WifiOff, BarChart3 } from "lucide-react"

interface DashboardData {
  mcpTotal: number
  mcpEnabled: number
  devicesOnline: number
  devicesTotal: number
  totalCalls: number
  callSummary: { status: string; count: number }[]
  ollamaStatus: string
  ollamaModels: number
  recentLogs: { method: string; status: string; duration_ms: number | null; created_at: string; server_name: string | null }[]
  deviceList: { device_name: string; device_host: string; status: string; latency_ms: number }[]
  servers: { name: string; enabled: boolean; category: string | null }[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [serversRes, logsRes, healthRes, statusRes] = await Promise.all([
        fetch("/api/mcp/servers"),
        fetch("/api/mcp/call-logs?limit=10"),
        fetch("/api/health"),
        fetch("/api/status"),
      ])

      const servers = serversRes.ok ? await serversRes.json() : { servers: [] }
      const logs = logsRes.ok ? await logsRes.json() : { logs: [], summary: [] }
      const health = healthRes.ok ? await healthRes.json() : { devices: [], stats: {} }
      const status = statusRes.ok ? await statusRes.json() : { ollama: {} }

      const totalCalls = (logs.summary || []).reduce((sum: number, s: { count: number }) => sum + s.count, 0)

      setData({
        mcpTotal: servers.servers?.length || 0,
        mcpEnabled: servers.servers?.filter((s: { enabled: boolean }) => s.enabled).length || 0,
        devicesOnline: health.stats?.online || 0,
        devicesTotal: health.stats?.devices || 0,
        totalCalls,
        callSummary: logs.summary || [],
        ollamaStatus: status.ollama?.status || "offline",
        ollamaModels: status.ollama?.models?.length || 0,
        recentLogs: logs.logs || [],
        deviceList: health.devices || [],
        servers: servers.servers || [],
      })
    } catch {}
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
        <h1 className="text-2xl md:text-3xl font-bold font-sans text-neutral-900">仪表盘</h1>
        <div className="animate-pulse mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border border-neutral-200 bg-white p-4 h-24" />
          ))}
        </div>
      </div>
    )
  }

  const kpis = [
    { icon: Server, label: "MCP 服务", value: `${data?.mcpEnabled}/${data?.mcpTotal}`, sub: "在线", color: "text-blue-600" },
    { icon: Wifi, label: "设备在线", value: `${data?.devicesOnline}/${data?.devicesTotal}`, sub: "台", color: "text-emerald-600" },
    { icon: Activity, label: "调用总量", value: `${data?.totalCalls}`, sub: "次", color: "text-orange-600" },
    { icon: Cpu, label: "AI 模型", value: `${data?.ollamaModels}`, sub: data?.ollamaStatus === "online" ? "Ollama 在线" : "Ollama 离线", color: "text-purple-600" },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold font-sans text-neutral-900">仪表盘</h1>
        <p className="mt-1 text-sm text-neutral-500 font-sans">全局概览 · 数据来自 PostgreSQL 实时查询</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-lg border border-neutral-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon className={cn("w-4 h-4", kpi.color)} />
              <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400 font-sans">{kpi.label}</p>
            </div>
            <p className="text-2xl font-bold font-sans text-neutral-900">{kpi.value}</p>
            <p className="text-xs text-neutral-500 font-sans mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-base font-semibold font-sans text-neutral-900 mb-3 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-blue-600" />
            MCP 服务分布
          </h2>
          <div className="rounded-lg border border-neutral-200 bg-white divide-y divide-neutral-100">
            {data?.servers.map((s) => (
              <div key={s.name} className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={cn("shrink-0 w-1.5 h-1.5 rounded-full", s.enabled ? "bg-emerald-500" : "bg-neutral-300")} />
                  <span className="text-xs font-sans text-neutral-700 truncate">{s.name}</span>
                </div>
                <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500 font-sans">
                  {s.category || "other"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold font-sans text-neutral-900 mb-3 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-orange-600" />
            最近调用
          </h2>
          <div className="rounded-lg border border-neutral-200 bg-white divide-y divide-neutral-100">
            {data?.recentLogs.length === 0 && (
              <div className="px-4 py-6 text-center text-xs text-neutral-400 font-sans">暂无调用记录</div>
            )}
            {data?.recentLogs.map((log, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5">
                <div className="min-w-0">
                  <p className="text-xs font-sans text-neutral-700 truncate">{log.server_name || log.method}</p>
                  <p className="text-[10px] text-neutral-400 font-sans">
                    {new Date(log.created_at).toLocaleString("zh-CN")}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-sans",
                    log.status === "success" || log.status === "working"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                  )}>
                    {log.status}
                  </span>
                  {log.duration_ms != null && (
                    <span className="text-[10px] text-neutral-400 font-mono">{log.duration_ms}ms</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-base font-semibold font-sans text-neutral-900 mb-3 flex items-center gap-1.5">
          <Wifi className="w-4 h-4 text-emerald-600" />
          设备状态
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {data?.deviceList.map((d) => (
            <div
              key={d.device_name}
              className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3"
            >
              <div className="flex items-center gap-2">
                {d.status === "online" ? (
                  <Wifi className="w-4 h-4 text-emerald-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-neutral-300" />
                )}
                <div>
                  <p className="text-xs font-medium font-sans text-neutral-900">{d.device_name}</p>
                  <p className="text-[10px] text-neutral-400 font-mono">{d.device_host}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "text-[10px] font-sans",
                  d.status === "online" ? "text-emerald-600" : "text-neutral-400"
                )}>
                  {d.status}
                </p>
                {d.latency_ms >= 0 && (
                  <p className="text-[10px] text-neutral-400 font-mono">{d.latency_ms}ms</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
