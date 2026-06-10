"use client"

import { BrandHeader } from "@yyc3/ui"
import { BrandFooter } from "@yyc3/ui"

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col bg-white">
      <BrandHeader />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <BrandFooter />
    </div>
  )
}
