/**
 * file: page.tsx
 * description: YYC³ Bot 首页路由组件 · 加载并渲染主视觉模块
 * author: YanYuCloudCube Team <admin@0379.email>
 * version: v1.0.0
 * created: 2026-04-25
 * updated: 2026-04-25
 * status: active
 * tags: [page],[route],[landing]
 *
 * brief: 首页入口，渲染 YYC³ 品牌主视觉组件
 *
 * dependencies: @/components/new-yorker-spline
 * exports: Home (default)
 * notes: Server Component，由 Next.js App Router 自动路由
 */

import { NewYorkerSpline } from "@/components/new-yorker-spline"

export default function Home() {
  return <NewYorkerSpline />
}
