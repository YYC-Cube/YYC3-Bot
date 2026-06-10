import { cn } from "@yyc3/core"
import { BRAND } from "@yyc3/core"

interface BrandFooterProps {
  className?: string
}

export function BrandFooter({ className }: BrandFooterProps) {
  return (
    <footer
      className={cn(
        "z-20 shrink-0 px-4 py-3 md:px-6 md:py-4",
        "flex justify-between items-center bg-black/90 text-white/50",
        "border-t border-white/5",
        className
      )}
    >
      <span className="text-[10px] md:text-xs uppercase tracking-[0.15em] font-sans">
        {BRAND.copyright}
      </span>
      <span className="text-[10px] md:text-xs uppercase tracking-[0.15em] font-sans">
        {BRAND.email}
      </span>
    </footer>
  )
}
