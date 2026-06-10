"use client"

/**
 * @file ai-assistant.tsx
 * @description YYC³ AI 智能助理 · 可拖拽浮窗版
 * @author YanYuCloudCube Team
 *
 * Phase 1 架构融合 + Phase 2 模型可配置：
 * - 可拖拽浮动面板（替代 shadcn Sheet）
 * - 真实 API 流式调用 + IndexedDB 持久化
 * - 移动端全屏适配 + 触控优化
 * - 多 Provider/Model 可配置，本地 Ollama 扫描
 */

import { useDraggable } from "@/hooks/use-draggable"
import type { ModelProvider } from "@/hooks/use-model-config"
import { useModelConfig } from "@/hooks/use-model-config"
import { saveConversation } from "@/lib/chat-storage"
import { cn } from "@yyc3/core"
import {
  Bot,
  Check,
  ChevronDown,
  GripVertical,
  Maximize2,
  MessageSquare,
  Minimize2,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  Trash2,
  User,
  X,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

// ─── Types ─────────────────────────────────────────

interface Message {
  role: "user" | "assistant"
  content: string
}

const CONV_ID = "default"

const SUGGESTIONS = [
  "分析我的 140+ 项目架构",
  "帮我规划下一阶段开发",
  "解释「五高五标五化五维」",
  "推荐 MCP 使用策略",
]

// ─── Constants ──────────────────────────────────────

const PANEL_WIDTH = 480
const PANEL_HEIGHT = 640
const MOBILE_BREAKPOINT = 640

const DEFAULT_POSITION = () => ({
  x: typeof window !== "undefined" ? Math.max(window.innerWidth - PANEL_WIDTH - 24, 24) : 1400,
  y: 80,
})

const DRAGGABLE_BOUNDS = {
  left: 16,
  top: 60,
  right: typeof window !== "undefined" ? window.innerWidth - 16 : 1920,
  bottom: typeof window !== "undefined" ? window.innerHeight - 16 : 1080,
}

// ─── Component ──────────────────────────────────────

interface AiAssistantProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AiAssistant({ open, onOpenChange }: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const {
    activeProvider,
    setActiveProvider,
    addProvider,
    updateProvider,
    removeProvider,
    scanOllamaModels,
  } = useModelConfig()

  // ── Mobile detection ──
  useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  // ── Draggable ──
  const {
    position,
    handleMouseDown,
    handleTouchStart,
    draggableRef,
    resetPosition,
    setPosition,
  } = useDraggable({
    initialPosition: DEFAULT_POSITION(),
    bounds: !isMobile ? DRAGGABLE_BOUNDS : undefined,
  })

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  useEffect(() => {
    if (typeof window === "undefined" || isMobile) return
    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.min(prev.x, window.innerWidth - PANEL_WIDTH - 16),
        y: Math.min(prev.y, window.innerHeight - 100),
      }))
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [setPosition, isMobile])

  // ── Send message ──
  async function sendMessage(text: string) {
    if (!text.trim() || loading) return

    const userMsg: Message = { role: "user", content: text.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          provider: activeProvider.type,
          model: activeProvider.model,
          baseUrl: activeProvider.baseUrl || undefined,
          apiKey: activeProvider.apiKey || undefined,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `请求失败 (${res.status})` }))
        setMessages((prev) => [...prev, { role: "assistant", content: err.error }])
        setLoading(false)
        return
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let content = ""

      setMessages((prev) => [...prev, { role: "assistant", content: "" }])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          for (const line of chunk.split("\n")) {
            if (line.startsWith("data:")) {
              const data = line.slice(5).trim()
              if (data === "[DONE]") continue
              try {
                const parsed = JSON.parse(data)
                const delta = parsed.choices?.[0]?.delta?.content
                if (delta) {
                  content += delta
                  setMessages((prev) => {
                    const updated = [...prev]
                    updated[updated.length - 1] = { role: "assistant", content }
                    return updated
                  })
                }
              } catch {
                // skip
              }
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "连接失败，请检查网络。" }])
    }
    setLoading(false)

    setMessages((current) => {
      if (current.length > 0) {
        saveConversation(CONV_ID, current as Message[]).catch(() => { })
      }
      return current
    })
  }

  const handleClose = () => {
    resetPosition()
    setIsMaximized(false)
    setShowSettings(false)
    onOpenChange(false)
  }

  const handleToggleMaximize = () => setIsMaximized((prev) => !prev)

  // ── Render ──
  if (!open) return null

  // Mobile: fullscreen
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[60] flex flex-col bg-neutral-950 text-white">
        {/* Mobile header */}
        <HeaderBar
          activeProvider={activeProvider}
          showSettings={showSettings}
          onToggleSettings={() => setShowSettings((prev) => !prev)}
          onClose={handleClose}
        />

        {showSettings ? (
          <SettingsPanel
            activeProvider={activeProvider}
            onSelectProvider={setActiveProvider}
            onAddProvider={addProvider}
            onUpdateProvider={updateProvider}
            onRemoveProvider={removeProvider}
            onScan={scanOllamaModels}
          />
        ) : (
          <>
            <ChatArea
              messages={messages}
              sendMessage={sendMessage}
              scrollRef={scrollRef}
              isMobile
            />
            <ChatInput
              input={input}
              setInput={setInput}
              loading={loading}
              sendMessage={sendMessage}
              inputRef={inputRef}
            />
          </>
        )}
      </div>
    )
  }

  // Desktop: draggable panel
  const panelStyle: React.CSSProperties = isMaximized
    ? { top: "1rem", left: "1rem", right: "1rem", bottom: "1rem", width: "auto", height: "auto" }
    : { width: PANEL_WIDTH, height: PANEL_HEIGHT, left: position.x, top: position.y }

  return (
    <div
      ref={draggableRef}
      style={panelStyle}
      className={cn(
        "fixed z-[60] flex flex-col overflow-hidden rounded-2xl border border-white/10 shadow-2xl",
        "bg-neutral-950 text-white",
      )}
    >
      {/* Desktop header */}
      <div
        className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-neutral-900/80 select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="flex items-center gap-2 min-w-0">
          <GripVertical className="w-4 h-4 text-white/30 shrink-0 cursor-grab active:cursor-grabbing" />
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-white truncate">YYC³ AI 助手</h3>
            <ModelSelectorInline
              activeProvider={activeProvider}
              onSelect={setActiveProvider}
              onOpenSettings={() => setShowSettings(true)}
            />
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setShowSettings((prev) => !prev)}
            className={cn(
              "w-7 h-7 rounded-md flex items-center justify-center transition-colors",
              showSettings
                ? "text-blue-400 bg-blue-500/10"
                : "text-white/40 hover:text-white hover:bg-white/10",
            )}
            aria-label="模型设置"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleToggleMaximize}
            className="w-7 h-7 rounded-md flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={isMaximized ? "还原" : "最大化"}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="关闭"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {showSettings ? (
        <SettingsPanel
          activeProvider={activeProvider}
          onSelectProvider={setActiveProvider}
          onAddProvider={addProvider}
          onUpdateProvider={updateProvider}
          onRemoveProvider={removeProvider}
          onScan={scanOllamaModels}
        />
      ) : (
        <>
          <ChatArea
            messages={messages}
            sendMessage={sendMessage}
            scrollRef={scrollRef}
            isMobile={false}
          />
          <ChatInput
            input={input}
            setInput={setInput}
            loading={loading}
            sendMessage={sendMessage}
            inputRef={inputRef}
          />
        </>
      )}
    </div>
  )
}

// ─── Sub-components ─────────────────────────────────

function ModelSelectorInline({
  activeProvider,
  onSelect,
  onOpenSettings,
}: {
  activeProvider: ModelProvider
  onSelect: (id: string) => void
  onOpenSettings: () => void
}) {
  const { config } = useModelConfig()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen((prev) => !prev)
        }}
        className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-[10px] text-white/50 hover:text-white/70 transition-colors"
      >
        <span className="truncate max-w-[120px]">{activeProvider.name}</span>
        <ChevronDown className="w-2.5 h-2.5 shrink-0" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-white/10 bg-neutral-900 shadow-2xl z-50 overflow-hidden">
            <div className="px-3 py-2 text-[10px] text-white/40 border-b border-white/10">
              选择模型
            </div>
            <div className="max-h-48 overflow-y-auto">
              {config.providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelect(p.id)
                    setOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-white/5 transition-colors",
                    p.id === activeProvider.id ? "text-white" : "text-white/60",
                  )}
                >
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      p.type === "zhipu" ? "bg-blue-400" : "bg-emerald-400",
                    )}
                  />
                  <span className="truncate flex-1">{p.name}</span>
                  <span className="text-[10px] text-white/30">{p.model}</span>
                  {p.id === activeProvider.id && <Check className="w-3 h-3 text-blue-400" />}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setOpen(false)
                onOpenSettings()
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/50 hover:text-white hover:bg-white/5 border-t border-white/10 transition-colors"
            >
              <Settings className="w-3 h-3" />
              管理模型配置
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function HeaderBar({
  activeProvider,
  showSettings,
  onToggleSettings,
  onClose,
}: {
  activeProvider: ModelProvider
  showSettings: boolean
  onToggleSettings: () => void
  onClose: () => void
}) {
  return (
    <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-neutral-900/80">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-white">YYC³ AI 助手</h3>
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full animate-pulse",
                activeProvider.type === "zhipu" ? "bg-blue-400" : "bg-emerald-400",
              )}
            />
            <span className="text-[10px] text-white/40 truncate max-w-[160px]">{activeProvider.name}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleSettings}
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
            showSettings
              ? "text-blue-400 bg-blue-500/10"
              : "text-white/50 hover:text-white hover:bg-white/10 active:bg-white/20",
          )}
          aria-label="模型设置"
        >
          <Settings className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors"
          aria-label="关闭"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

function SettingsPanel({
  activeProvider,
  onSelectProvider,
  onAddProvider,
  onUpdateProvider,
  onRemoveProvider,
  onScan,
}: {
  activeProvider: ModelProvider
  onSelectProvider: (id: string) => void
  onAddProvider: (p: ModelProvider) => void
  onUpdateProvider: (id: string, updates: Partial<ModelProvider>) => void
  onRemoveProvider: (id: string) => void
  onScan: () => Promise<string[]>
}) {
  const { config } = useModelConfig()
  const [scanning, setScanning] = useState(false)
  const [scanResults, setScanResults] = useState<string[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleScan = async () => {
    setScanning(true)
    setScanResults([])
    const models = await onScan()
    setScanResults(models)
    setScanning(false)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        <h4 className="text-xs font-medium text-white/80">模型配置</h4>
        <div className="flex items-center gap-2">
          <button
            onClick={handleScan}
            disabled={scanning}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[10px] text-white/60 hover:text-white/80 transition-colors disabled:opacity-40"
          >
            <Search className={cn("w-3 h-3", scanning && "animate-spin")} />
            扫描本地模型
          </button>
          <button
            onClick={() => {
              setShowAdd(true)
              setEditingId(null)
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500/20 hover:bg-blue-500/30 text-[10px] text-blue-400 transition-colors"
          >
            <Plus className="w-3 h-3" />
            添加
          </button>
        </div>
      </div>

      {/* Scan results */}
      {scanResults.length > 0 && (
        <div className="px-4 py-2 bg-emerald-500/5 border-b border-emerald-500/10">
          <p className="text-[10px] text-emerald-400 mb-1">本地可用模型：</p>
          <div className="flex flex-wrap gap-1">
            {scanResults.map((m) => (
              <button
                key={m}
                onClick={() => {
                  const ollama = config.providers.find((p) => p.type === "ollama")
                  if (ollama) {
                    onUpdateProvider(ollama.id, { model: m })
                  }
                  setScanResults([])
                }}
                className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-[10px] text-white/60 hover:text-white transition-colors"
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Provider list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {config.providers.map((p) => (
          <div
            key={p.id}
            className={cn(
              "rounded-xl border p-3 transition-colors",
              p.id === activeProvider.id
                ? "border-blue-500/30 bg-blue-500/5"
                : "border-white/10 bg-white/5",
            )}
          >
            {editingId === p.id ? (
              <ProviderEditForm
                provider={p}
                onSave={(updates) => {
                  onUpdateProvider(p.id, updates)
                  setEditingId(null)
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        p.type === "zhipu" ? "bg-blue-400" : "bg-emerald-400",
                      )}
                    />
                    <span className="text-xs font-medium text-white truncate">{p.name}</span>
                    <span className="text-[10px] px-1 py-0.5 rounded-md bg-white/10 text-white/40">
                      {p.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {p.id !== activeProvider.id && (
                      <button
                        onClick={() => onSelectProvider(p.id)}
                        className="px-2 py-0.5 rounded-md bg-blue-500/20 hover:bg-blue-500/30 text-[10px] text-blue-400 transition-colors"
                      >
                        使用
                      </button>
                    )}
                    <button
                      onClick={() => setEditingId(p.id)}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Settings className="w-3 h-3" />
                    </button>
                    {config.providers.length > 1 && (
                      <button
                        onClick={() => onRemoveProvider(p.id)}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px] text-white/40">
                  <span>模型: {p.model}</span>
                  <span className="truncate">地址: {p.baseUrl}</span>
                </div>
              </>
            )}
          </div>
        ))}

        {/* Add new provider form */}
        {showAdd && (
          <ProviderAddForm
            onSave={(p) => {
              onAddProvider(p)
              setShowAdd(false)
            }}
            onCancel={() => setShowAdd(false)}
          />
        )}
      </div>
    </div>
  )
}

function ProviderEditForm({
  provider,
  onSave,
  onCancel,
}: {
  provider: ModelProvider
  onSave: (updates: Partial<ModelProvider>) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(provider.name)
  const [model, setModel] = useState(provider.model)
  const [baseUrl, setBaseUrl] = useState(provider.baseUrl)
  const [apiKey, setApiKey] = useState(provider.apiKey || "")

  return (
    <div className="space-y-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="显示名称"
        className="w-full px-2 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/20"
      />
      <input
        value={model}
        onChange={(e) => setModel(e.target.value)}
        placeholder="模型名称 (e.g. glm-4-flash)"
        className="w-full px-2 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/20"
      />
      <input
        value={baseUrl}
        onChange={(e) => setBaseUrl(e.target.value)}
        placeholder="API 地址"
        className="w-full px-2 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/20"
      />
      <input
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="API Key (可选)"
        type="password"
        className="w-full px-2 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/20"
      />
      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onCancel}
          className="px-3 py-1 rounded-md text-[10px] text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          取消
        </button>
        <button
          onClick={() => onSave({ name, model, baseUrl, apiKey: apiKey || undefined })}
          className="px-3 py-1 rounded-md bg-blue-500/20 hover:bg-blue-500/30 text-[10px] text-blue-400 transition-colors"
        >
          保存
        </button>
      </div>
    </div>
  )
}

function ProviderAddForm({
  onSave,
  onCancel,
}: {
  onSave: (p: ModelProvider) => void
  onCancel: () => void
}) {
  const [name, setName] = useState("")
  const [type, setType] = useState<"zhipu" | "ollama">("zhipu")
  const [model, setModel] = useState("")
  const [baseUrl, setBaseUrl] = useState("")
  const [apiKey, setApiKey] = useState("")

  return (
    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 space-y-2">
      <p className="text-[10px] text-blue-400 font-medium">添加模型</p>
      <select
        value={type}
        onChange={(e) => setType(e.target.value as "zhipu" | "ollama")}
        className="w-full px-2 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-white/20"
      >
        <option value="zhipu">智谱 API (OpenAI 兼容)</option>
        <option value="ollama">Ollama (本地)</option>
      </select>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="显示名称"
        className="w-full px-2 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/20"
      />
      <input
        value={model}
        onChange={(e) => setModel(e.target.value)}
        placeholder="模型名称"
        className="w-full px-2 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/20"
      />
      <input
        value={baseUrl}
        onChange={(e) => setBaseUrl(e.target.value)}
        placeholder="API 基础地址"
        className="w-full px-2 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/20"
      />
      <input
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="API Key (智谱必填)"
        type="password"
        className="w-full px-2 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/20"
      />
      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onCancel}
          className="px-3 py-1 rounded-md text-[10px] text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          取消
        </button>
        <button
          onClick={() => {
            if (!name || !model || !baseUrl) return
            onSave({
              id: `${type}-${Date.now()}`,
              name,
              type,
              model,
              baseUrl,
              apiKey: apiKey || undefined,
              timeout: type === "zhipu" ? 10000 : 5000,
            })
          }}
          disabled={!name || !model || !baseUrl}
          className="px-3 py-1 rounded-md bg-blue-500/20 hover:bg-blue-500/30 text-[10px] text-blue-400 transition-colors disabled:opacity-40"
        >
          添加
        </button>
      </div>
    </div>
  )
}

function ChatArea({
  messages,
  sendMessage,
  scrollRef,
  isMobile,
}: {
  messages: Message[]
  sendMessage: (text: string) => void
  scrollRef: React.RefObject<HTMLDivElement | null>
  isMobile: boolean
}) {
  return (
    <div
      ref={scrollRef}
      className={cn("flex-1 overflow-y-auto", isMobile ? "px-3 py-3 space-y-3" : "px-4 py-4 space-y-4")}
    >
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center px-2">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3">
            <MessageSquare className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-xs text-white/50 mb-4 max-w-xs">
            我了解你的 140+ 项目和「五高五标五化五维」框架。
          </p>
          <div className={cn("space-y-2 w-full", isMobile && "max-w-sm")}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className={cn(
                  "w-full text-left rounded-lg border border-white/10 text-xs text-white/60",
                  "hover:bg-white/5 hover:border-white/20 transition-all",
                  isMobile ? "px-4 py-3" : "px-3 py-2",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.map((msg, i) => (
        <div
          key={i}
          className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}
        >
          {msg.role === "assistant" && (
            <div className="shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mt-0.5">
              <Bot className="w-3 h-3 text-blue-400" />
            </div>
          )}
          <div
            className={cn(
              "rounded-lg px-3 py-2 text-xs font-sans leading-relaxed",
              msg.role === "user"
                ? "bg-white text-black max-w-[80%]"
                : "bg-white/10 text-white/90 max-w-[85%]",
              isMobile && msg.role === "user" && "max-w-[85%]",
            )}
          >
            <div className="whitespace-pre-wrap break-words">
              {msg.content || <span className="inline-block w-1.5 h-3.5 bg-white/40 animate-pulse" />}
            </div>
          </div>
          {msg.role === "user" && (
            <div className="shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
              <User className="w-3 h-3 text-white/70" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function ChatInput({
  input,
  setInput,
  loading,
  sendMessage,
  inputRef,
}: {
  input: string
  setInput: (v: string) => void
  loading: boolean
  sendMessage: (text: string) => void
  inputRef: React.RefObject<HTMLTextAreaElement | null>
}) {
  return (
    <div className="shrink-0 p-3 border-t border-white/10">
      <div className="flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              sendMessage(input)
            }
          }}
          placeholder="输入指令... (Enter 发送)"
          rows={1}
          className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-white/20 resize-none text-sm"
          style={{ maxHeight: "100px" }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all disabled:opacity-30 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
