import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AiAssistant } from "@/components/ai-assistant"

// Mock fetch for streaming API
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock IndexedDB storage
vi.mock("@/lib/chat-storage", () => ({
  saveConversation: vi.fn().mockResolvedValue(undefined),
}))

// Mock matchMedia for mobile detection
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe("AiAssistant", () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockReset()
  })

  it("renders when open is true", () => {
    render(<AiAssistant {...defaultProps} />)
    expect(screen.getByText("YYC³ AI 助手")).toBeDefined()
  })

  it("does not render when open is false", () => {
    const { container } = render(
      <AiAssistant {...defaultProps} open={false} />,
    )
    expect(container.innerHTML).toBe("")
  })

  it("shows suggestion buttons when no messages", () => {
    render(<AiAssistant {...defaultProps} />)
    expect(screen.getByText("分析我的 140+ 项目架构")).toBeDefined()
    expect(screen.getByText("帮我规划下一阶段开发")).toBeDefined()
    expect(screen.getByText("解释「五高五标五化五维」")).toBeDefined()
    expect(screen.getByText("推荐 MCP 使用策略")).toBeDefined()
  })

  it("has input textarea", () => {
    render(<AiAssistant {...defaultProps} />)
    const input = screen.getByPlaceholderText(/输入指令/)
    expect(input).toBeDefined()
  })

  it("has send button", () => {
    render(<AiAssistant {...defaultProps} />)
    const sendButton = screen.getByRole("button", { name: "" })
    expect(sendButton).toBeDefined()
  })

  it("typing in input updates value", async () => {
    const user = userEvent.setup()
    render(<AiAssistant {...defaultProps} />)
    const input = screen.getByPlaceholderText(/输入指令/) as HTMLTextAreaElement
    await user.type(input, "测试消息")
    expect(input.value).toBe("测试消息")
  })

  it("calls close handler when close button clicked", async () => {
    const onOpenChange = vi.fn()
    const user = userEvent.setup()
    render(<AiAssistant {...defaultProps} onOpenChange={onOpenChange} />)
    const closeButton = screen.getByLabelText("关闭")
    await user.click(closeButton)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("sends message on Enter key", async () => {
    const user = userEvent.setup()
    render(<AiAssistant {...defaultProps} />)

    const input = screen.getByPlaceholderText(/输入指令/)
    await user.type(input, "测试消息")
    await user.keyboard("{Enter}")

    // Check user message appeared
    await waitFor(() => {
      expect(screen.getByText("测试消息")).toBeDefined()
    })
  })

  it("sends message when clicking send button", async () => {
    const user = userEvent.setup()
    render(<AiAssistant {...defaultProps} />)

    const input = screen.getByPlaceholderText(/输入指令/) as HTMLTextAreaElement
    await user.type(input, "点击发送")

    const sendButton = screen.getAllByRole("button")
    const actualSend = sendButton[sendButton.length - 1] // last button is send
    await user.click(actualSend)

    await waitFor(() => {
      expect(screen.getByText("点击发送")).toBeDefined()
    })
  })

  it("calls fetch API when sending message", async () => {
    const mockStream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder()
        controller.enqueue(
          encoder.encode(
            'data: {"choices":[{"delta":{"content":"你好"}}]}\n\ndata: [DONE]\n\n',
          ),
        )
        controller.close()
      },
    })

    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: mockStream,
    })

    const user = userEvent.setup()
    render(<AiAssistant {...defaultProps} />)

    const input = screen.getByPlaceholderText(/输入指令/)
    await user.type(input, "你好")
    await user.keyboard("{Enter}")

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "你好" }],
          provider: "zhipu",
          model: "glm-4-flash",
          baseUrl: "https://open.bigmodel.cn/api/paas/v4",
        }),
      })
    })
  })

  it("shows loading state during API call", async () => {
    // Create a stream that never finishes to keep loading state
    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder()
          controller.enqueue(
            encoder.encode(
              'data: {"choices":[{"delta":{"content":"思考中..."}}]}\n\n',
            ),
          )
          // Don't close the stream
        },
      }),
    })

    const user = userEvent.setup()
    render(<AiAssistant {...defaultProps} />)

    const input = screen.getByPlaceholderText(/输入指令/)
    await user.type(input, "测试")
    await user.keyboard("{Enter}")

    // Send button should be disabled while loading
    await waitFor(() => {
      const buttons = screen.getAllByRole("button")
      const sendBtn = buttons[buttons.length - 1]
      expect(sendBtn.hasAttribute("disabled")).toBe(true)
    })
  })
})