export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface ChatResult {
  provider: "zhipu" | "ollama"
  stream: ReadableStream<Uint8Array>
}

export interface HealthStatus {
  provider: string
  online: boolean
  models?: string[]
  baseUrl?: string
  latencyMs?: number
}
