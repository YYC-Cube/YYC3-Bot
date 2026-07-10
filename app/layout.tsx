
import { AiChatProvider } from '@/components/ai-chat-provider'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: 'YYC³ Bot — YanYuCloudCube 智能应用',
  description: 'YYC³ (YanYuCloudCube) 智能应用链 · 言启象限 | 语枢未来 · 五高五标五化五维核心机制',
  manifest: '/manifest.json',
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
  appleWebApp: {
    capable: true,
    title: 'YYC³ Bot',
    statusBarStyle: 'black-translucent',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="theme-color" content="#18181b" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <link rel="apple-touch-icon" href="/yyc3-dist/yanyu_cloud_192x192.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <AiChatProvider>
          {children}
        </AiChatProvider>
      </body>
    </html>
  )
}
