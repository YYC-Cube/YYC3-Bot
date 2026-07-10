/**
 * file: next.config.mjs
 * description: YYC³ Bot Next.js 配置 · Turbopack 配置、图片优化、TypeScript 设置
 * author: YanYuCloudCube Team <admin@0379.email>
 * version: v1.0.0
 * created: 2026-04-25
 * updated: 2026-04-25
 * status: active
 * tags: [config],[build],[next]
 *
 * brief: Next.js 16 项目配置，Turbopack 默认启用
 *
 * details:
 * - TypeScript 构建错误跳过（开发阶段）
 * - 图片优化关闭（适配静态导出场景）
 * - Turbopack root 配置（多 lockfile 环境适配）
 *
 * dependencies: Next.js 16
 * notes: Turbopack 为 Next.js 16 默认构建工具
 */

import { dirname, resolve } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
