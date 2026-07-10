"use client"

import { cn } from "@yyc3/core"
import type { Locale } from "@yyc3/i18n"
import { i18n, SUPPORTED_LOCALES } from "@yyc3/i18n"
import { Cpu, Globe, RefreshCw, Server, Settings, ToggleLeft, ToggleRight, Trash2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

interface McpServer {
  id: string
  name: string
  display_name: string | null
  description: string | null
  type: string
  enabled: boolean
  category: string | null
  timeout: number
}

interface OllamaInfo {
  status: string
  models: string[]
}

const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  ja: "日本語",
  ko: "한국어",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  "pt-BR": "Português",
  ar: "العربية",
}

export default function SettingsPage() {
  const [servers, setServers] = useState<McpServer[]>([])
  const [ollama, setOllama] = useState<OllamaInfo>({ status: "offline", models: [] })
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"mcp" | "ai" | "about" | "i18n">("mcp")
  const [currentLocale, setCurrentLocale] = useState<Locale>(i18n.getLocale())
  const [syncingLocale, setSyncingLocale] = useState(false)

  useEffect(() => {
    const unsub = i18n.subscribe((locale) => {
      setCurrentLocale(locale)
    })
    return unsub
  }, [])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [serversRes, statusRes] = await Promise.all([
        fetch("/api/mcp/servers"),
        fetch("/api/status"),
      ])
      if (serversRes.ok) {
        const data = await serversRes.json()
        setServers(data.servers || [])
      }
      if (statusRes.ok) {
        const data = await statusRes.json()
        setOllama(data.ollama || { status: "offline", models: [] })
      }
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  async function toggleServer(id: string, enabled: boolean) {
    const res = await fetch("/api/mcp/servers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, enabled: !enabled }),
    })
    if (res.ok) {
      setServers((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !enabled } : s)))
    }
  }

  async function deleteServer(id: string) {
    const res = await fetch(`/api/mcp/servers?id=${id}`, { method: "DELETE" })
    if (res.ok) {
      setServers((prev) => prev.filter((s) => s.id !== id))
    }
  }

  async function handleLocaleSwitch(locale: Locale) {
    if (locale === currentLocale || syncingLocale) return
    setSyncingLocale(true)
    try {
      await i18n.setLocale(locale)
    } finally {
      setSyncingLocale(false)
    }
  }

  const tabs = [
    { id: "mcp" as const, label: "MCP 服务", icon: Server },
    { id: "ai" as const, label: "AI 模型", icon: Cpu },
    { id: "i18n" as const, label: "语言", icon: Globe },
    { id: "about" as const, label: "关于", icon: Settings },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-sans text-neutral-900">设置</h1>
          <p className="mt-1 text-sm text-neutral-500 font-sans">MCP 服务管理 · AI 模型配置 · 系统信息</p>
        </div>
        <button
          onClick={fetchAll}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs text-neutral-600 font-sans hover:bg-neutral-50 transition-all"
          aria-label="刷新"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          刷新
        </button>
      </div>

      <div className="flex gap-1 mb-6 border-b border-neutral-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 text-xs font-sans transition-all border-b-2 -mb-px",
              tab === t.id
                ? "border-black text-neutral-900 font-medium"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            )}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "mcp" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-neutral-500 font-sans">
              {servers.length} 个服务 · {servers.filter((s) => s.enabled).length} 个启用
            </p>
          </div>
          {servers.map((server) => (
            <div
              key={server.id}
              className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 hover:border-neutral-300 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={cn(
                    "shrink-0 w-2 h-2 rounded-full",
                    server.enabled ? "bg-emerald-500" : "bg-neutral-300"
                  )}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium font-sans text-neutral-900 truncate">
                    {server.display_name || server.name}
                  </p>
                  <p className="text-xs text-neutral-400 font-sans truncate">
                    {server.type} · {server.category || "other"} · {server.timeout / 1000}s
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleServer(server.id, server.enabled)}
                  className="text-neutral-400 hover:text-neutral-700 transition-colors"
                  aria-label={server.enabled ? "禁用" : "启用"}
                >
                  {server.enabled ? (
                    <ToggleRight className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => deleteServer(server.id)}
                  className="text-neutral-300 hover:text-red-500 transition-colors"
                  aria-label="删除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "ai" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-neutral-200 bg-white p-5">
            <h3 className="text-sm font-semibold font-sans text-neutral-900 mb-3">Ollama 本地模型</h3>
            <div className="flex items-center gap-2 mb-4">
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  ollama.status === "online" ? "bg-emerald-500" : "bg-neutral-300"
                )}
              />
              <span className="text-xs font-sans text-neutral-600">
                {ollama.status === "online" ? "在线" : "离线"} · localhost:11434
              </span>
            </div>
            {ollama.models.length > 0 ? (
              <div className="space-y-1.5">
                {ollama.models.map((m) => (
                  <div
                    key={m}
                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-50 border border-neutral-100"
                  >
                    <Cpu className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="text-xs font-mono text-neutral-700">{m}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400 font-sans">无可用模型</p>
            )}
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-5">
            <h3 className="text-sm font-semibold font-sans text-neutral-900 mb-3">智谱 GLM 云端模型</h3>
            <div className="space-y-1.5">
              {[
                { model: "glm-4-flash", desc: "免费 · 快速响应", active: true },
                { model: "glm-4-plus", desc: "付费 · 更强推理", active: false },
                { model: "glm-4-long", desc: "付费 · 长上下文", active: false },
              ].map((item) => (
                <div
                  key={item.model}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-md border",
                    item.active
                      ? "bg-black text-white border-black"
                      : "bg-neutral-50 border-neutral-100"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5" />
                    <span className={cn("text-xs font-mono", item.active ? "text-white" : "text-neutral-700")}>
                      {item.model}
                    </span>
                  </div>
                  <span className={cn("text-[10px] font-sans", item.active ? "text-white/70" : "text-neutral-400")}>
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "i18n" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-neutral-200 bg-white p-5">
            <h3 className="text-sm font-semibold font-sans text-neutral-900 mb-3">界面语言</h3>
            <p className="text-xs text-neutral-500 font-sans mb-4">
              当前语言：<span className="font-medium text-neutral-900">{LOCALE_LABELS[currentLocale]}</span>
              <span className="text-neutral-400 ml-1">({currentLocale})</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {SUPPORTED_LOCALES.map((locale) => {
                const loc = locale as Locale
                const isActive = loc === currentLocale
                return (
                  <button
                    key={locale}
                    onClick={() => handleLocaleSwitch(loc)}
                    disabled={syncingLocale || isActive}
                    className={cn(
                      "px-3 py-2.5 rounded-lg border text-xs font-sans transition-all",
                      isActive
                        ? "bg-black text-white border-black"
                        : "border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50",
                      (syncingLocale || isActive) && "opacity-80 cursor-not-allowed"
                    )}
                  >
                    {LOCALE_LABELS[loc]}
                    {isActive && (
                      <span className="ml-1 text-white/70">✓</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-5">
            <h3 className="text-sm font-semibold font-sans text-neutral-900 mb-3">同步设置</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium font-sans text-neutral-700">本地存储持久化</p>
                  <p className="text-[10px] text-neutral-400 font-sans">语言偏好自动保存至浏览器 localStorage</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-sans">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  已启用
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <div>
                  <p className="text-xs font-medium font-sans text-neutral-700">浏览器语言检测</p>
                  <p className="text-[10px] text-neutral-400 font-sans">首次访问时自动检测系统语言偏好</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-sans">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  已启用
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <div>
                  <p className="text-xs font-medium font-sans text-neutral-700">实时切换同步</p>
                  <p className="text-[10px] text-neutral-400 font-sans">切换语言时立即更新所有组件显示</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-sans">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  已启用
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-5">
            <h3 className="text-sm font-semibold font-sans text-neutral-900 mb-3">支持语言</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {SUPPORTED_LOCALES.map((locale) => (
                <div key={locale} className="flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-50 border border-neutral-100">
                  <Globe className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="text-xs text-neutral-700 font-sans">{LOCALE_LABELS[locale as Locale]}</span>
                  <span className="text-[10px] text-neutral-400 font-mono">{locale}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "about" && (
        <div className="rounded-lg border border-neutral-200 bg-white p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold font-sans text-neutral-900 mb-2">YYC³ Bot</h3>
            <p className="text-xs text-neutral-500 font-sans leading-relaxed">
              YanYuCloudCube 统一智能门户 · 140+ 项目导航 · AI 双路容灾 · PostgreSQL 数据驱动
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "版本", value: "v1.0.0" },
              { label: "框架", value: "Next.js 16 + React 19" },
              { label: "数据库", value: "PostgreSQL 15" },
              { label: "包管理", value: "pnpm workspace" },
              { label: "共享包", value: "6 个 (@yyc3/*)" },
              { label: "API", value: "6 个 RESTful" },
              { label: "测试", value: "15 passing" },
              { label: "AI", value: "智谱 + Ollama" },
            ].map((item) => (
              <div key={item.label} className="px-3 py-2 rounded-md bg-neutral-50 border border-neutral-100">
                <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400 font-sans">{item.label}</p>
                <p className="text-xs font-medium font-sans text-neutral-900 mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-neutral-100">
            <p className="text-[10px] text-neutral-400 font-sans">
              © 2025-2026 YYC³ Team · admin@0379.email · 言启象限 · 语枢未来
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
