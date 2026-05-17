import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Github, ExternalLink, Calendar } from 'lucide-react'
import type { Project } from '@/lib/projects'

interface ProjectMetaHeaderProps {
  project: Pick<Project, 'github' | 'demo' | 'stack' | 'period' | 'status'>
}

export function ProjectMetaHeader({ project }: ProjectMetaHeaderProps) {
  const hasAny =
    project.github ||
    project.demo ||
    project.period ||
    project.status ||
    (project.stack && project.stack.length > 0)

  if (!hasAny) return null

  return (
    <div className="mt-8 space-y-4">
      {(project.period || project.status) && (
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {project.period && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {project.period}
            </span>
          )}
          {project.status && (
            <Badge variant="secondary" className="uppercase tracking-wider text-[10px]">
              {project.status}
            </Badge>
          )}
        </div>
      )}

      {project.stack && project.stack.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      )}

      {(project.github || project.demo) && (
        <div className="flex flex-wrap gap-2 pt-2">
          {project.github && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </a>
            </Button>
          )}
          {project.demo && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Live Demo
              </a>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
