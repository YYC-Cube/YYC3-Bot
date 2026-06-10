import { cn } from "@yyc3/core"
import type { Device } from "@yyc3/core"

const TYPE_LABELS: Record<string, string> = {
  workstation: "工作站",
  server: "服务器",
  compute: "算力节点",
  nas: "存储",
}

interface DeviceCardProps {
  device: Device
  className?: string
}

export function DeviceCard({ device, className }: DeviceCardProps) {
  const isOnline = device.status === "online"

  return (
    <div
      className={cn(
        "rounded-lg border border-neutral-200 bg-white p-4",
        className
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold font-sans text-neutral-900">
          {device.name}
        </span>
        <span
          className={cn(
            "w-2 h-2 rounded-full",
            isOnline ? "bg-emerald-500" : device.status === "unknown" ? "bg-amber-400" : "bg-neutral-400"
          )}
        />
      </div>
      <div className="text-xs text-neutral-500 font-sans space-y-0.5">
        <div className="flex justify-between">
          <span>类型</span>
          <span className="text-neutral-700">{TYPE_LABELS[device.type] ?? device.type}</span>
        </div>
        <div className="flex justify-between">
          <span>主机</span>
          <span className="text-neutral-700 font-mono text-[11px]">{device.hostname}</span>
        </div>
        <div className="flex justify-between">
          <span>IP</span>
          <span className="text-neutral-700 font-mono text-[11px]">{device.ip}</span>
        </div>
      </div>
    </div>
  )
}
