"use client"

import { cn } from "@yyc3/core"
import { Bot, Send, Sparkles, User } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
}

const SUGGESTIONS = [
  "分析我的 140+ 项目架构，给出优化建议",
  "帮我规划 YYC³ 下一阶段开发重点",
  "解释「五高五标五化五维」框架核心",
  "推荐 MCP 服务最佳使用策略",
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

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
        }),
      })

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `请求失败 (${res.status})，请检查 API 配置。` },
        ])
        setLoading(false)
        return
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ""

      setMessages((prev) => [...prev, { role: "assistant", content: "" }])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data:")) {
              const data = line.slice(5).trim()
              if (data === "[DONE]") continue
              try {
                const parsed = JSON.parse(data)
                const delta = parsed.choices?.[0]?.delta?.content
                if (delta) {
                  assistantContent += delta
                  setMessages((prev) => {
                    const updated = [...prev]
                    updated[updated.length - 1] = {
                      role: "assistant",
                      content: assistantContent,
                    }
                    return updated
                  })
                }
              } catch { /* ignore */ }
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "连接失败，请确认网络和 API Key 配置。" },
      ])
    }

    setLoading(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0 px-4 py-3 md:px-6 border-b border-neutral-200 bg-white">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <h1 className="text-sm font-semibold font-sans text-neutral-900">YYC³ AI 助手</h1>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-sans">
            GLM-4-Flash
          </span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mb-4">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-semibold font-sans text-neutral-900 mb-1">
              你好，我是 YYC³ AI 助手
            </h2>
            <p className="text-sm text-neutral-500 font-sans mb-6 max-w-md">
              我了解你的 140+ 项目、112 个 Agent、150+ Skills，以及「五高五标五化五维」框架。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-left px-3 py-2.5 rounded-lg border border-neutral-200 bg-white text-xs text-neutral-700 font-sans hover:bg-neutral-50 hover:border-neutral-300 transition-all"
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
            className={cn(
              "flex gap-2.5",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {msg.role === "assistant" && (
              <div className="shrink-0 w-7 h-7 rounded-full bg-black flex items-center justify-center mt-0.5">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-3.5 py-2.5 text-sm font-sans leading-relaxed",
                msg.role === "user"
                  ? "bg-black text-white"
                  : "bg-neutral-100 text-neutral-900"
              )}
            >
              <div className="whitespace-pre-wrap wrap-break-word">
                {msg.content || (
                  <span className="inline-block w-2 h-4 bg-neutral-400 animate-pulse" />
                )}
              </div>
            </div>
            {msg.role === "user" && (
              <div className="shrink-0 w-7 h-7 rounded-full bg-neutral-200 flex items-center justify-center mt-0.5">
                <User className="w-3.5 h-3.5 text-neutral-600" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="shrink-0 px-4 py-3 md:px-6 border-t border-neutral-200 bg-white">
        <div className="flex items-end gap-2 max-w-3xl mx-auto">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息，Enter 发送，Shift+Enter 换行..."
            rows={1}
            className="flex-1 resize-none rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-sans text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-300 transition-all min-h-[42px] max-h-[120px]"
            style={{ height: "auto", overflow: "hidden" }}
            onInput={(e) => {
              const t = e.target as HTMLTextAreaElement
              t.style.height = "auto"
              t.style.height = Math.min(t.scrollHeight, 120) + "px"
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            aria-label="发送消息"
            className={cn(
              "shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all",
              input.trim() && !loading
                ? "bg-black text-white hover:bg-neutral-800"
                : "bg-neutral-100 text-neutral-400"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
