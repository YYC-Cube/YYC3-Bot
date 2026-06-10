import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200)
  const serverId = searchParams.get("server_id")

  let logs
  if (serverId) {
    logs = await sql`
      SELECT l.id, l.method, l.status, l.duration_ms, l.error_message, l.prompt_tokens, l.completion_tokens, l.total_tokens, l.created_at,
             s.name as server_name
      FROM mcp_call_logs l
      LEFT JOIN mcp_servers s ON l.server_id = s.id
      WHERE l.server_id = ${serverId}
      ORDER BY l.created_at DESC
      LIMIT ${limit}
    `
  } else {
    logs = await sql`
      SELECT l.id, l.method, l.status, l.duration_ms, l.error_message, l.prompt_tokens, l.completion_tokens, l.total_tokens, l.created_at,
             s.name as server_name
      FROM mcp_call_logs l
      LEFT JOIN mcp_servers s ON l.server_id = s.id
      ORDER BY l.created_at DESC
      LIMIT ${limit}
    `
  }

  const summary = await sql`
    SELECT status, count(*)::int as count, avg(duration_ms)::int as avg_duration_ms
    FROM mcp_call_logs
    GROUP BY status
  `

  return NextResponse.json({ logs, summary })
}

export const dynamic = "force-dynamic"
