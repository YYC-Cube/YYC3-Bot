import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
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
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, display_name, description, type, category, command, args, env, timeout, enabled } = body

  if (!name || !type) {
    return NextResponse.json({ error: "name and type required" }, { status: 400 })
  }

  const result = await sql`
    INSERT INTO mcp_servers (name, display_name, description, type, category, command, args, env, timeout, enabled)
    VALUES (${name}, ${display_name || null}, ${description || null}, ${type}, ${category || null}, ${command || null}, ${JSON.stringify(args || [])}::jsonb, ${JSON.stringify(env || {})}::jsonb, ${timeout || 30000}, ${enabled !== false})
    RETURNING id, name, display_name, type, enabled, category
  `

  return NextResponse.json({ server: result[0] }, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { id, display_name, description, enabled, category, timeout } = body

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 })
  }

  const result = await sql`
    UPDATE mcp_servers
    SET display_name = COALESCE(${display_name || null}, display_name),
        description = COALESCE(${description || null}, description),
        enabled = COALESCE(${enabled !== undefined ? enabled : null}, enabled),
        category = COALESCE(${category || null}, category),
        timeout = COALESCE(${timeout || null}, timeout)
    WHERE id = ${id}
    RETURNING id, name, display_name, type, enabled, category
  `

  if (result.length === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 })
  }

  return NextResponse.json({ server: result[0] })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 })
  }

  const result = await sql`
    DELETE FROM mcp_servers WHERE id = ${id}
    RETURNING id, name
  `

  if (result.length === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 })
  }

  return NextResponse.json({ deleted: result[0] })
}

export const dynamic = "force-dynamic"
