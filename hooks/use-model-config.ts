"use client"

/**
 * @file use-model-config.ts
 * @description 模型配置状态管理 · 支持多 Provider/Model 选择、本地扫描、自编辑
 * @author YanYuCloudCube Team
 */

import { useState, useEffect, useCallback } from "react"

// ─── Types ─────────────────────────────────────────

export interface ModelProvider {
  id: string
  name: string
  type: "zhipu" | "ollama" | "openai-compatible"
  baseUrl: string
  model: string
  apiKey?: string
  timeout?: number
}

export interface ModelConfig {
  providers: ModelProvider[]
  activeId: string // 当前选中的 provider id
}

// ─── Defaults ──────────────────────────────────────

const STORAGE_KEY = "yyc3-model-config"

const DEFAULT_PROVIDERS: ModelProvider[] = [
  {
    id: "zhipu-glm4",
    name: "智谱 GLM-4-Flash",
    type: "zhipu",
    baseUrl: "https://open.bigmodel.cn/api/paas/v4",
    model: "glm-4-flash",
    apiKey: "",
    timeout: 10000,
  },
  {
    id: "ollama-qwen",
    name: "Ollama Qwen 2.5",
    type: "ollama",
    baseUrl: "http://localhost:11434",
    model: "qwen2.5:7b",
    timeout: 5000,
  },
]

function loadConfig(): ModelConfig {
  if (typeof window === "undefined") return { providers: DEFAULT_PROVIDERS, activeId: DEFAULT_PROVIDERS[0].id }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as ModelConfig
      // Ensure activeId still exists
      if (!parsed.providers.find((p) => p.id === parsed.activeId)) {
        parsed.activeId = parsed.providers[0]?.id || DEFAULT_PROVIDERS[0].id
      }
      return parsed
    }
  } catch { /* ignore */ }
  return { providers: DEFAULT_PROVIDERS, activeId: DEFAULT_PROVIDERS[0].id }
}

function saveConfig(config: ModelConfig) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch { /* ignore */ }
}

// ─── Hook ──────────────────────────────────────────

export function useModelConfig() {
  const [config, setConfig] = useState<ModelConfig>(loadConfig)

  // Persist on change
  useEffect(() => {
    saveConfig(config)
  }, [config])

  const activeProvider = config.providers.find((p) => p.id === config.activeId) || config.providers[0]

  const setActiveProvider = useCallback((id: string) => {
    setConfig((prev) => ({ ...prev, activeId: id }))
  }, [])

  const addProvider = useCallback((provider: ModelProvider) => {
    setConfig((prev) => ({
      providers: [...prev.providers, provider],
      activeId: provider.id,
    }))
  }, [])

  const updateProvider = useCallback((id: string, updates: Partial<ModelProvider>) => {
    setConfig((prev) => ({
      ...prev,
      providers: prev.providers.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }))
  }, [])

  const removeProvider = useCallback((id: string) => {
    setConfig((prev) => {
      const filtered = prev.providers.filter((p) => p.id !== id)
      if (filtered.length === 0) return prev // keep at least one
      return {
        providers: filtered,
        activeId: prev.activeId === id ? filtered[0].id : prev.activeId,
      }
    })
  }, [])

  const scanOllamaModels = useCallback(async (): Promise<string[]> => {
    const ollama = config.providers.find((p) => p.type === "ollama")
    if (!ollama) return []
    try {
      const res = await fetch(`/api/ollama/models?baseUrl=${encodeURIComponent(ollama.baseUrl)}`)
      if (!res.ok) return []
      const data = await res.json()
      return data.models || []
    } catch {
      return []
    }
  }, [config.providers])

  return {
    config,
    activeProvider,
    setActiveProvider,
    addProvider,
    updateProvider,
    removeProvider,
    scanOllamaModels,
  }
}