import { cn } from "@yyc3/core"
import type { McpService } from "@yyc3/core"

interface McpStatusCardProps {
  service: McpService
  className?: string
}

export function McpStatusCard({ service, className }: McpStatusCardProps) {
  const isOnline = service.status === "online"
  const quotaPercent =
    service.quotaTotal && service.quotaUsed
      ? Math.round((service.quotaUsed / service.quotaTotal) * 100)
      : undefined

  return (
    <div
      className={cn(
        "rounded-lg border border-neutral-200 bg-white p-4",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold font-sans text-neutral-900 truncate">
          {service.name}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-sans",
            isOnline ? "text-emerald-600" : "text-neutral-400"
          )}
        >
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              isOnline ? "bg-emerald-500" : "bg-neutral-400"
            )}
          />
          {isOnline ? "在线" : service.status === "pending" ? "待连接" : "离线"}
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs text-neutral-500 font-sans">
        <span className="uppercase tracking-wider">{service.type}</span>
        <span>·</span>
        <span>{service.tools.length} 工具</span>
      </div>

      {quotaPercent !== undefined && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] text-neutral-500 font-sans mb-1">
            <span>配额</span>
            <span>{service.quotaUsed}/{service.quotaTotal} ({quotaPercent}%)</span>
          </div>
          <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                quotaPercent > 80 ? "bg-red-500" : quotaPercent > 50 ? "bg-amber-500" : "bg-emerald-500"
              )}
              style={{ width: `${quotaPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
