import postgres from "postgres"

const DEFAULT_URL = process.env.DATABASE_URL || "postgresql://yanyu@localhost:5433/yyc3_mcp"

const connections = new Map<string, postgres.Sql>()

function getSql(url?: string): postgres.Sql {
  const key = url || DEFAULT_URL
  if (!connections.has(key)) {
    connections.set(key, postgres(key, { max: 5, idle_timeout: 20 }))
  }
  return connections.get(key)!
}

export const sql = getSql()
export const sqlCore = getSql(process.env.DATABASE_CORE_URL)
export const sqlAify = getSql(process.env.DATABASE_AIFY_URL)
export const sqlApi = getSql(process.env.DATABASE_API_URL)

export { getSql }
