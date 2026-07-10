import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const servers = await sql`
      SELECT id, name, display_name, description, type, enabled, category, version, timeout, metadata, created_at, updated_at
      FROM mcp_servers
      ORDER BY name
    `

    const stats = {
      total: servers.length,
      enabled: servers.filter((s) => s.enabled).length,
      byCategory: Object.groupBy(servers, (s) => s.category || "other"),
    }

    return NextResponse.json({ servers, stats })
  } catch {
    return NextResponse.json({ servers: [], stats: { total: 0, enabled: 0, byCategory: {} } })
  }
}

export const dynamic = "force-static"
