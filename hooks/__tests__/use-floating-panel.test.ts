import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useFloatingPanel } from "@/hooks/use-floating-panel"

describe("useFloatingPanel", () => {
  it("returns default closed state", () => {
    const { result } = renderHook(() => useFloatingPanel())
    expect(result.current.isOpen).toBe(false)
    expect(result.current.isMaximized).toBe(false)
    expect(result.current.activeTab).toBe("chat")
  })

  it("accepts default open state", () => {
    const { result } = renderHook(() => useFloatingPanel({ defaultOpen: true }))
    expect(result.current.isOpen).toBe(true)
  })

  it("accepts custom default tab", () => {
    const { result } = renderHook(() =>
      useFloatingPanel({ defaultTab: "commands" }),
    )
    expect(result.current.activeTab).toBe("commands")
  })

  it("openPanel sets isOpen to true", () => {
    const { result } = renderHook(() => useFloatingPanel())
    act(() => result.current.openPanel())
    expect(result.current.isOpen).toBe(true)
  })

  it("closePanel sets isOpen to false and resets maximize", () => {
    const { result } = renderHook(() =>
      useFloatingPanel({ defaultOpen: true }),
    )
    act(() => result.current.toggleMaximize())
    expect(result.current.isMaximized).toBe(true)
    act(() => result.current.closePanel())
    expect(result.current.isOpen).toBe(false)
    expect(result.current.isMaximized).toBe(false)
  })

  it("togglePanel toggles isOpen", () => {
    const { result } = renderHook(() => useFloatingPanel())
    act(() => result.current.togglePanel())
    expect(result.current.isOpen).toBe(true)
    act(() => result.current.togglePanel())
    expect(result.current.isOpen).toBe(false)
  })

  it("toggleMaximize toggles isMaximized", () => {
    const { result } = renderHook(() => useFloatingPanel())
    act(() => result.current.toggleMaximize())
    expect(result.current.isMaximized).toBe(true)
    act(() => result.current.toggleMaximize())
    expect(result.current.isMaximized).toBe(false)
  })

  it("setActiveTab changes active tab", () => {
    const { result } = renderHook(() => useFloatingPanel())
    act(() => result.current.setActiveTab("prompts"))
    expect(result.current.activeTab).toBe("prompts")
    act(() => result.current.setActiveTab("settings"))
    expect(result.current.activeTab).toBe("settings")
  })

  it("returns correct panelClass for maximized state", () => {
    const { result } = renderHook(() => useFloatingPanel())
    act(() => result.current.toggleMaximize())
    expect(result.current.panelClass).toContain("inset-4")
    expect(result.current.panelClass).toContain("z-[60]")
  })

  it("returns correct panelClass for mobile", () => {
    const { result } = renderHook(() => useFloatingPanel({ isMobile: true }))
    expect(result.current.panelClass).toContain("inset-0")
  })
})