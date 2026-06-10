import Link from "next/link"
import { cn } from "@yyc3/core"
import type { Project, ProjectStatus } from "@yyc3/core"

const STATUS_MAP: Record<ProjectStatus, { label: string; color: string }> = {
  online: { label: "在线", color: "bg-emerald-500" },
  development: { label: "开发中", color: "bg-blue-500" },
  planning: { label: "规划中", color: "bg-purple-500" },
  prototype: { label: "原型", color: "bg-amber-500" },
  deprecated: { label: "已弃用", color: "bg-neutral-400" },
}

interface ProjectCardProps {
  project: Project
  className?: string
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const status = STATUS_MAP[project.status] ?? STATUS_MAP.planning

  return (
    <Link href={project.url ?? "#"}>
      <div
        className={cn(
          "group relative rounded-lg border border-neutral-200 bg-white p-4",
          "hover:border-neutral-300 hover:shadow-sm transition-all cursor-pointer",
          className
        )}
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-semibold font-sans text-neutral-900 group-hover:text-black truncate">
            {project.name}
          </h3>
          <span className={cn("ml-2 shrink-0 inline-block w-2 h-2 rounded-full", status.color)} />
        </div>
        <p className="text-xs text-neutral-500 line-clamp-2 mb-3 font-sans">
          {project.description}
        </p>
        <div className="flex items-center gap-1.5 flex-wrap">
          {project.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 font-sans"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 3 && (
            <span className="text-[10px] text-neutral-400 font-sans">
              +{project.techStack.length - 3}
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans">
            {status.label}
          </span>
        </div>
      </div>
    </Link>
  )
}
