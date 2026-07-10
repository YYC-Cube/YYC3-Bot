import { sqlAify } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const latest = await sqlAify`
      SELECT DISTINCT ON (device_name)
        id, device_name, device_host, device_type, status, latency_ms, checked_at, metadata
      FROM health_checks
      ORDER BY device_name, checked_at DESC
    `

    const history = await sqlAify`
      SELECT device_name, status, latency_ms, checked_at
      FROM health_checks
      ORDER BY checked_at DESC
      LIMIT 200
    `

    const stats = {
      devices: latest.length,
      online: latest.filter((d) => d.status === "healthy" || d.status === "online").length,
      offline: latest.filter((d) => d.status === "unhealthy" || d.status === "offline").length,
      unknown: latest.filter((d) => d.status === "unknown").length,
    }

    return NextResponse.json({ devices: latest, history, stats })
  } catch {
    return NextResponse.json({ devices: [], history: [], stats: { devices: 0, online: 0, offline: 0, unknown: 0 } })
  }
}

export const dynamic = "force-static"
