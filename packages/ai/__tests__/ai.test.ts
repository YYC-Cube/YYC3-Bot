import { describe, it, expect } from "vitest"
import { PROVIDERS, SYSTEM_PROMPT } from "../src/constants"

describe("PROVIDERS", () => {
  it("has zhipu config", () => {
    expect(PROVIDERS.zhipu.name).toContain("智谱")
    expect(PROVIDERS.zhipu.baseUrl).toContain("bigmodel.cn")
    expect(PROVIDERS.zhipu.model).toBeTruthy()
    expect(PROVIDERS.zhipu.timeout).toBeGreaterThan(0)
  })

  it("has ollama config", () => {
    expect(PROVIDERS.ollama.name).toBe("Ollama")
    expect(PROVIDERS.ollama.baseUrl).toContain("11434")
    expect(PROVIDERS.ollama.model).toBeTruthy()
    expect(PROVIDERS.ollama.timeout).toBeGreaterThan(0)
  })

  it("ollama timeout is shorter than zhipu", () => {
    expect(PROVIDERS.ollama.timeout).toBeLessThan(PROVIDERS.zhipu.timeout)
  })
})

describe("SYSTEM_PROMPT", () => {
  it("contains YYC³ branding", () => {
    expect(SYSTEM_PROMPT).toContain("YYC³")
    expect(SYSTEM_PROMPT).toContain("五高五标五化五维")
  })

  it("is non-empty", () => {
    expect(SYSTEM_PROMPT.length).toBeGreaterThan(50)
  })
})
