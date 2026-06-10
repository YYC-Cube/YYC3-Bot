"use client"

/**
 * @file ai-chat-provider.tsx
 * @description YYC³ AI 助手全局挂载 Provider · FAB 按钮 + 浮动面板
 * @author YanYuCloudCube Team
 */

import { useState, useEffect } from "react"
import { AiAssistant } from "@/components/ai-assistant"
import { Bot } from "lucide-react"

export function AiChatProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {children}
      {mounted && (
        <>
          <button
            onClick={() => setOpen(true)}
            className="fixed bottom-5 right-5 z-[9999] w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
            aria-label="打开 AI 助手"
          >
            <Bot className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
          </button>
          <AiAssistant open={open} onOpenChange={setOpen} />
        </>
      )}
    </>
  )
}