import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Github, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Project } from '@/lib/projects'

interface ProjectCardProps {
  project: Project
  className?: string
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <Card
      className={cn(
        'h-full hover:shadow-lg transition-shadow duration-300 flex flex-col',
        className,
      )}
    >
      <CardHeader>
        <Link href={`/projects/${project.slug}`} className="group">
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
            {project.title}
          </CardTitle>
        </Link>
        <CardDescription className="flex flex-wrap items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {project.period || formatDate(project.date)}
          </span>
          {project.status && (
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
              {project.status}
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Link href={`/projects/${project.slug}`}>
          <p className="text-muted-foreground line-clamp-3 text-sm hover:text-foreground transition-colors">
            {project.description}
          </p>
        </Link>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3">
        {project.stack && project.stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.stack.slice(0, 5).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.stack.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{project.stack.length - 5}
              </Badge>
            )}
          </div>
        )}
        {(project.github || project.demo) && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Demo
              </a>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
