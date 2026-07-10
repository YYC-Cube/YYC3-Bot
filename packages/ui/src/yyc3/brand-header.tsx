"use client"

import { cn } from "@yyc3/core"
import NextImage from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { LocaleSwitcher } from "./locale-switcher"

const NAV_ITEMS = [
  { label: "首页", href: "/" },
  { label: "仪表盘", href: "/dashboard" },
  { label: "项目矩阵", href: "/projects" },
  { label: "状态监控", href: "/status" },
  { label: "AI 助手", href: "/chat" },
  { label: "设置", href: "/settings" },
]

interface BrandHeaderProps {
  className?: string
  showNav?: boolean
}

export function BrandHeader({ className, showNav = true }: BrandHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header
      className={cn(
        "z-50 shrink-0 px-4 py-3 md:px-6 md:py-4",
        "flex justify-between items-center bg-black/90 text-white",
        "border-b border-white/5",
        className
      )}
    >
      <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/60 font-sans hidden sm:block">
        Est. 2025
      </span>

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

      {showNav && (
        <>
          <nav className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs uppercase tracking-[0.15em] text-white/60 hover:text-white transition-colors font-sans"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <LocaleSwitcher />
          {mounted && (
            <button
              className="md:hidden text-white/60 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                {mobileOpen ? (
                  <path d="M5 5l10 10M15 5L5 15" />
                ) : (
                  <path d="M3 6h14M3 10h14M3 14h14" />
                )}
              </svg>
            </button>
          )}
        </>
      )}

      {!showNav && (
        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/60 font-sans">
          言启象限 · 语枢未来
        </span>
      )}

      {mounted && mobileOpen && showNav && (
        <div className="absolute top-full left-0 right-0 bg-black/95 border-b border-white/5 px-4 py-3 md:hidden z-50">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 text-sm text-white/70 hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
