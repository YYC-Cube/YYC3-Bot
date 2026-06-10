"use client"

/**
 * @file use-floating-panel.ts
 * @description 浮窗状态管理 Hook · 打开/关闭/最大化/标签
 * @author YanYuCloudCube Team
 */

import { useState, useCallback } from "react"

export type AITab = "chat" | "commands" | "prompts" | "settings"

export interface UseFloatingPanelOptions {
  defaultOpen?: boolean
  defaultTab?: AITab
  isMobile?: boolean
}

export interface UseFloatingPanelReturn {
  isOpen: boolean
  isMaximized: boolean
  activeTab: AITab
  openPanel: () => void
  closePanel: () => void
  togglePanel: () => void
  toggleMaximize: () => void
  setActiveTab: (tab: AITab) => void
  panelClass: string
}

export function useFloatingPanel(options: UseFloatingPanelOptions = {}): UseFloatingPanelReturn {
  const { defaultOpen = false, defaultTab = "chat", isMobile = false } = options

  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isMaximized, setIsMaximized] = useState(false)
  const [activeTab, setActiveTab] = useState<AITab>(defaultTab)

  const openPanel = useCallback(() => setIsOpen(true), [])
  const closePanel = useCallback(() => {
    setIsOpen(false)
    setIsMaximized(false)
  }, [])

  const togglePanel = useCallback(() => setIsOpen((prev) => !prev), [])
  const toggleMaximize = useCallback(() => setIsMaximized((prev) => !prev), [])

  const panelClass = isMaximized
    ? "fixed inset-4 md:inset-8 z-[60]"
    : isMobile
      ? "fixed inset-0 z-[60]"
      : "fixed z-[60]"

  return {
    isOpen,
    isMaximized,
    activeTab,
    openPanel,
    closePanel,
    togglePanel,
    toggleMaximize,
    setActiveTab,
    panelClass,
  }
}