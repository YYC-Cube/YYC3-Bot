import { NextRequest, NextResponse } from "next/server"
import projectsData from "../../data/projects.json"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")?.toLowerCase() || ""
  const category = searchParams.get("category") || ""

  let results = projectsData

  if (query) {
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.techStack?.some((t) => t.toLowerCase().includes(query))
    )
  }

  if (category) {
    results = results.filter((p) => p.category === category)
  }

  const stats = {
    total: projectsData.length,
    filtered: results.length,
    categories: [...new Set(projectsData.map((p) => p.category))].filter(Boolean),
  }

  return NextResponse.json({ projects: results, stats })
}

export const dynamic = "force-static"
