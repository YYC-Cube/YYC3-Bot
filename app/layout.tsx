/**
 * file: layout.tsx
 * description: YYC³ Bot 根布局组件 · 全局元数据、字体、样式注入
 * author: YanYuCloudCube Team <admin@0379.email>
 * version: v1.0.0
 * created: 2026-04-25
 * updated: 2026-04-25
 * status: active
 * tags: [layout],[root],[config]
 *
 * brief: Next.js App Router 根布局，定义全局 HTML 结构与元数据
 *
 * details:
 * - 全局元数据配置（YYC³ 品牌信息）
 * - Geist 字体加载与注入
 * - Vercel Analytics 集成
 * - 全局样式引入
 *
 * dependencies: next/font, @vercel/analytics
 * exports: RootLayout (default)
 * notes: 此文件为 App Router 必需的根布局
 */

import { AiChatProvider } from '@/components/ai-chat-provider'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: 'YYC³ Bot — YanYuCloudCube 智能应用',
  description: 'YYC³ (YanYuCloudCube) 智能应用链 · 言启象限 | 语枢未来 · 五高五标五化五维核心机制',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/yyc3-dist/yanyu_cloud_32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/yyc3-dist/yanyu_cloud_16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/yyc3-dist/yanyu_cloud_192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <AiChatProvider>
          {children}
        </AiChatProvider>
        <Analytics />
      </body>
    </html>
  )
}
