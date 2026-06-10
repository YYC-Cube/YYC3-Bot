import { cn } from "@yyc3/core"
import { PHILOSOPHY } from "@yyc3/core"

const CARDS = [
  { label: PHILOSOPHY.highs.label, content: PHILOSOPHY.highs.items.join(" \xB7 ") },
  { label: PHILOSOPHY.standards.label, content: PHILOSOPHY.standards.items.join(" \xB7 ") },
  { label: PHILOSOPHY.transforms.label, content: PHILOSOPHY.transforms.items.join(" \xB7 ") },
  { label: PHILOSOPHY.dimensions.label, content: PHILOSOPHY.dimensions.items.join(" \xB7 ") },
]

interface PhilosophyGridProps {
  className?: string
  columns?: 2 | 4
}

export function PhilosophyGrid({ className, columns = 2 }: PhilosophyGridProps) {
  return (
    <div
      className={cn(
        "grid gap-2 md:gap-3",
        columns === 2 ? "grid-cols-2" : "grid-cols-4"
      )}
    >
      {CARDS.map((card) => (
        <div
          key={card.label}
          className={cn(
            "bg-neutral-50/80 border border-neutral-100 rounded-md",
            "p-2.5 md:p-3 transition-colors hover:bg-neutral-100/80",
            className
          )}
        >
          <span className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-neutral-400 font-sans block mb-1">
            {card.label}
          </span>
          <span className="text-xs md:text-sm font-medium font-sans leading-relaxed">
            {card.content}
          </span>
        </div>
      ))}
    </div>
  )
}
