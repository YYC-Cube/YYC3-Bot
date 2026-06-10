"use client"

import { useState, useMemo } from "react"
import { ProjectCard } from "@yyc3/ui"
import { PROJECT_CATEGORIES, cn } from "@yyc3/core"
import type { Project, ProjectCategory } from "@yyc3/core"
import { Search } from "lucide-react"
import projectsData from "../../data/projects.json"

const ALL_CATEGORY = "all"

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY)
  const [searchQuery, setSearchQuery] = useState("")

  const projects = projectsData as Project[]

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory =
        activeCategory === ALL_CATEGORY || p.category === activeCategory
      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCategory && matchesSearch
    })
  }, [projects, activeCategory, searchQuery])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of projects) {
      counts[p.category] = (counts[p.category] || 0) + 1
    }
    return counts
  }, [projects])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold font-sans text-neutral-900">
          项目矩阵
        </h1>
        <p className="mt-1 text-sm text-neutral-500 font-sans">
          YYC³ 全部 {projects.length} 个项目 · 一站式导航
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="搜索项目名称、描述、技术栈..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm font-sans text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-300 transition-all"
        />
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
        <button
          onClick={() => setActiveCategory(ALL_CATEGORY)}
          className={cn(
            "shrink-0 px-3 py-1.5 rounded-full text-xs font-sans transition-all",
            activeCategory === ALL_CATEGORY
              ? "bg-black text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          )}
        >
          全部 ({projects.length})
        </button>
        {PROJECT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-full text-xs font-sans transition-all",
              activeCategory === cat.id
                ? "bg-black text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            )}
          >
            {cat.icon} {cat.label} ({categoryCounts[cat.id] ?? 0})
          </button>
        ))}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-neutral-400 font-sans">没有找到匹配的项目</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-neutral-100">
        <p className="text-xs text-neutral-400 font-sans text-center">
          显示 {filteredProjects.length} / {projects.length} 个项目
        </p>
      </div>
    </div>
  )
}
