"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { saveConversation } from "@/lib/chat-storage"
import { cn } from "@yyc3/core"
import { Bot, Send, Sparkles, User, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

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

interface AiChatSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AiChatSheet({ open, onOpenChange }: AiChatSheetProps) {
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

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

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
          { role: "assistant", content: `请求失败 (${res.status})` },
        ])
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
              } catch { /* ignore */ }
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "连接失败，请检查网络。" },
      ])
    }
    setLoading(false)
    setMessages((current) => {
      if (current.length > 0) {
        saveConversation(CONV_ID, current as { role: "user" | "assistant"; content: string }[]).catch(() => { })
      }
      return current
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col bg-neutral-950 text-white border-l border-white/10"
      >
        <SheetHeader className="px-4 py-3 border-b border-white/10 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <SheetTitle className="text-sm font-semibold font-sans text-white">
                YYC³ AI 助手
              </SheetTitle>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-blue-300 font-sans">
                GLM-4
              </span>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-7 h-7 rounded-md flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="关闭"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </SheetHeader>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-2">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3">
                <Bot className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-xs text-white/50 font-sans mb-4 max-w-xs">
                我了解你的 140+ 项目和「五高五标五化五维」框架。
              </p>
              <div className="space-y-2 w-full">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="w-full text-left px-3 py-2 rounded-lg border border-white/10 text-xs text-white/60 font-sans hover:bg-white/5 hover:border-white/20 transition-all"
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
                  "max-w-[85%] rounded-lg px-3 py-2 text-xs font-sans leading-relaxed",
                  msg.role === "user"
                    ? "bg-white text-black"
                    : "bg-white/10 text-white/90"
                )}
              >
                <div className="whitespace-pre-wrap break-words">
                  {msg.content || (
                    <span className="inline-block w-1.5 h-3.5 bg-white/40 animate-pulse" />
                  )}
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

        <div className="shrink-0 px-3 py-3 border-t border-white/10">
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
              placeholder="输入消息..."
              rows={1}
              className="flex-1 resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-sans text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 min-h-[36px] max-h-[100px]"
              style={{ height: "auto", overflow: "hidden" }}
              onInput={(e) => {
                const t = e.target as HTMLTextAreaElement
                t.style.height = "auto"
                t.style.height = Math.min(t.scrollHeight, 100) + "px"
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              aria-label="发送"
              className={cn(
                "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                input.trim() && !loading
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-white/10 text-white/30"
              )}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
