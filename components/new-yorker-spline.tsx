/**
 * file: new-yorker-spline.tsx
 * description: YYC³ Bot 首页主视觉组件 · 品牌展示 + 核心理念 + Spline 3D 机器人动画
 * author: YanYuCloudCube Team <admin@0379.email>
 * version: v1.1.0
 * created: 2026-04-25
 * updated: 2026-04-25
 * status: active
 * tags: [component],[ui],[landing]
 *
 * brief: YYC³ 智能应用链首页，展示品牌标识、五高五标五化核心理念与 Spline 3D 机器人
 *
 * details:
 * - YYC³ 品牌视觉体系（言启象限 | 语枢未来）
 * - 五高五标五化五维核心机制展示（2×2 卡片网格）
 * - Spline 3D 机器人动画（右侧自适应）
 * - Spotlight 跟随光效交互
 * - 鼠标跟随暗影交互（左侧）
 * - 完整响应式（移动端竖排 / 桌面端横排）
 *
 * dependencies: React, lucide-react, @splinetool/react-spline, @/components/ui/spotlight
 * exports: NewYorkerSpline
 * notes: 客户端组件，包含鼠标交互与 Spline 懒加载逻辑
 */

"use client"

import NextImage from "next/image"
import Link from "next/link"
import type React from "react"

import { SplineScene } from "@/components/ui/splite"
import { Spotlight } from "@/components/ui/spotlight"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

const PHILOSOPHY_CARDS = [
  { label: "五高架构", content: "高可用 · 高性能 · 高安全 · 高扩展 · 高智能" },
  { label: "五标体系", content: "标准化 · 规范化 · 自动化 · 可视化 · 智能化" },
  { label: "五化转型", content: "流程化 · 数字化 · 生态化 · 工具化 · 服务化" },
  { label: "五维评估", content: "时间维 · 空间维 · 属性维 · 事件维 · 关联维" },
]

export function NewYorkerSpline() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }

  return (
    <div
      className="h-screen w-full bg-white text-black relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 flex flex-col">
        <header className="z-30 shrink-0 px-4 py-3 md:px-6 md:py-4 flex justify-between items-center bg-black/90 text-white">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/60 hidden sm:block">Est. 2025</span>
          <div className="flex items-center gap-2.5">
            <NextImage
              src="/yyc3-dist/yanyu_cloud_64x64.png"
              alt="YYC³"
              width={32}
              height={32}
              className="rounded shrink-0"
            />
            <Link href="/" className="text-base md:text-lg font-semibold tracking-tight font-sans whitespace-nowrap hover:text-white/90 transition-colors">
              YYC³ — YanYuCloudCube
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-white/60 hover:text-white transition-colors font-sans">仪表盘</Link>
            <Link href="/projects" className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-white/60 hover:text-white transition-colors font-sans">项目矩阵</Link>
            <Link href="/status" className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-white/60 hover:text-white transition-colors font-sans">状态监控</Link>
            <Link href="/settings" className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-white/60 hover:text-white transition-colors font-sans">设置</Link>
            <Link href="/chat" className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-white/60 hover:text-white transition-colors font-sans flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI 助手
            </Link>
          </nav>
        </header>

        <div className="flex-1 min-h-0 flex flex-col md:flex-row">
          <div className="w-full md:w-[48%] h-full flex flex-col justify-center px-6 py-6 md:px-12 md:py-8 lg:px-16 relative z-10 overflow-y-auto">
            <div
              className="absolute pointer-events-none bg-black rounded-full opacity-[0.04] blur-3xl transition-transform duration-200 ease-out"
              style={{
                width: "320px",
                height: "320px",
                left: `${mousePosition.x - 160}px`,
                top: `${mousePosition.y - 160}px`,
                transform: `translate(${(mousePosition.x - 160) * 0.02}px, ${(mousePosition.y - 160) * 0.02}px)`,
              }}
            />
            <div className="max-w-lg relative">
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight whitespace-nowrap">
                YYC³ 智能应用链
              </h1>

              <p className="mt-2 text-xs md:text-sm text-neutral-400 font-sans tracking-wide leading-relaxed">
                YanYuCloudCube · Words Initiate Quadrants, Language Serves as Core for Future
              </p>

              <div className="mt-4 md:mt-5 mb-4 md:mb-5 border-t border-b border-neutral-200 py-2.5 md:py-3 space-y-0.5">
                <p className="font-serif text-sm md:text-base italic leading-snug">
                  万象归元于云枢 · 深栈智启新纪元
                </p>
                <p className="text-[11px] md:text-xs italic text-neutral-400 font-sans">
                  All things converge in cloud pivot; Deep stacks ignite a new era of intelligence
                </p>
              </div>

              <div className="space-y-2 md:space-y-2.5">
                {PHILOSOPHY_CARDS.map((card) => (
                  <div
                    key={card.label}
                    className="flex items-baseline gap-2 md:gap-3 bg-neutral-50/80 border border-neutral-100 rounded-md px-3 py-2 md:px-3.5 md:py-2.5 transition-all hover:bg-neutral-100/80 hover:border-neutral-200 group"
                  >
                    <span className="shrink-0 text-[10px] md:text-xs uppercase tracking-[0.15em] text-neutral-400 font-sans group-hover:text-neutral-600 transition-colors">
                      {card.label}
                    </span>
                    <span className="text-[11px] md:text-xs font-medium font-sans leading-relaxed text-neutral-700 group-hover:text-neutral-900 transition-colors whitespace-nowrap overflow-hidden text-ellipsis">
                      {card.content}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-3 md:mt-4 text-[11px] md:text-xs text-neutral-500 font-sans leading-relaxed">
                以「五高五标五化五维」为核心骨架，构建面向 AI 时代的智能应用开发范式，提供从架构设计到落地实施的全链路指导框架。
              </p>

              <div className="mt-6 md:mt-8 flex items-center">
                <div className="h-px bg-neutral-300 flex-grow mr-3"></div>
                <span className="text-[10px] md:text-xs uppercase tracking-[0.15em] font-sans text-neutral-400">
                  探索智能应用
                </span>
                <ChevronDown className="ml-1.5 h-3.5 w-3.5 text-neutral-400 animate-bounce" />
              </div>
            </div>
          </div>

          <div className="w-full md:w-[52%] h-full relative bg-black overflow-hidden">
            <div className="absolute inset-0 grid-background"></div>
            <div className="relative z-10 w-full h-full">
              <Spotlight className="left-1/2 top-1/2" size={300} fill="white" />
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full [&>iframe]:!w-full [&>iframe]:!h-full [&>canvas]:!w-full [&>canvas]:!h-full"
              />
            </div>
          </div>
        </div>

        <footer className="z-20 shrink-0 px-4 py-3 md:px-6 md:py-4 flex justify-between items-center bg-black/90 text-white/50">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.15em]">© 2025-2026 YYC³ Team. All Rights Reserved.</span>
          <span className="text-[10px] md:text-xs uppercase tracking-[0.15em]">admin@0379.email</span>
        </footer>
      </div>
    </div>
  )
}
