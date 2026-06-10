import { useDraggable } from "@/hooks/use-draggable"
import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

describe("useDraggable", () => {
  beforeEach(() => {
    // Reset getBoundingClientRect
    Object.defineProperty(HTMLElement.prototype, "getBoundingClientRect", {
      configurable: true,
      value: () => ({ width: 200, height: 100, left: 0, top: 0, right: 200, bottom: 100 }),
    })
  })

  it("returns default position", () => {
    const { result } = renderHook(() => useDraggable())
    expect(result.current.position).toEqual({ x: 0, y: 0 })
    expect(result.current.isDragging).toBe(false)
  })

  it("accepts initial position", () => {
    const { result } = renderHook(() =>
      useDraggable({ initialPosition: { x: 100, y: 200 } }),
    )
    expect(result.current.position).toEqual({ x: 100, y: 200 })
  })

  it("setPosition updates position", () => {
    const { result } = renderHook(() => useDraggable())
    act(() => result.current.setPosition({ x: 50, y: 75 }))
    expect(result.current.position).toEqual({ x: 50, y: 75 })
  })

  it("setPosition accepts updater function", () => {
    const { result } = renderHook(() =>
      useDraggable({ initialPosition: { x: 10, y: 20 } }),
    )
    act(() =>
      result.current.setPosition((prev) => ({ x: prev.x + 5, y: prev.y + 5 })),
    )
    expect(result.current.position).toEqual({ x: 15, y: 25 })
  })

  it("resetPosition restores initial position", () => {
    const { result } = renderHook(() =>
      useDraggable({ initialPosition: { x: 100, y: 200 } }),
    )
    act(() => result.current.setPosition({ x: 300, y: 400 }))
    act(() => result.current.resetPosition())
    expect(result.current.position).toEqual({ x: 100, y: 200 })
  })

  it("handleMouseDown starts dragging", () => {
    const { result } = renderHook(() => useDraggable())
    const mouseEvent = new MouseEvent("mousedown", {
      clientX: 100,
      clientY: 200,
    }) as unknown as React.MouseEvent
    act(() => result.current.handleMouseDown(mouseEvent))
    expect(result.current.isDragging).toBe(true)
  })

  it("provides draggableRef", () => {
    const { result } = renderHook(() => useDraggable())
    expect(result.current.draggableRef).toBeDefined()
    expect(result.current.draggableRef.current).toBeNull()
  })

  it("onPositionChange is called when position changes via direct setter", () => {
    const onPositionChange = vi.fn()
    const { result } = renderHook(() =>
      useDraggable({ onPositionChange }),
    )
    act(() => result.current.setPosition({ x: 50, y: 50 }))
    expect(onPositionChange).not.toHaveBeenCalled() // direct setter doesn't trigger callback
  })
})
