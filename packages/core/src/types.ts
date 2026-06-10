export interface Project {
  id: string
  name: string
  category: ProjectCategory
  description: string
  status: ProjectStatus
  techStack: string[]
  repository?: string
  url?: string
}

export type ProjectCategory =
  | "ai-application"
  | "ai-llm"
  | "ai-platform"
  | "education"
  | "office"
  | "tools"
  | "medical"
  | "entertainment"
  | "management"
  | "infrastructure"

export type ProjectStatus = "online" | "development" | "planning" | "deprecated" | "prototype"

export interface McpService {
  name: string
  type: "stdio" | "http"
  status: "online" | "offline" | "pending"
  tools: string[]
  quotaUsed?: number
  quotaTotal?: number
}

export interface Device {
  name: string
  hostname: string
  ip: string
  type: "workstation" | "server" | "compute" | "nas"
  status: "online" | "offline" | "unknown"
}
