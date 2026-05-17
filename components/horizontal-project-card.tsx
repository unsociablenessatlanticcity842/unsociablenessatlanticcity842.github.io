import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Project } from '@/lib/projects'

interface HorizontalProjectCardProps {
  project: Project
  className?: string
}

export function HorizontalProjectCard({ project, className }: HorizontalProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <article className={cn('group cursor-pointer', className)}>
        <div className="flex gap-4 sm:gap-6">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 text-lg">
              {project.title}
            </h3>

            <p className="mt-2 text-muted-foreground text-sm line-clamp-2">{project.description}</p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <time>{project.period || formatDate(project.date)}</time>
              {project.stack && project.stack.length > 0 && (
                <>
                  <span>·</span>
                  <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                    {project.stack[0]}
                  </span>
                </>
              )}
            </div>
          </div>

          {project.coverImage && (
            <div className="relative flex-shrink-0 w-24 h-24 sm:w-32 sm:h-24 rounded-md overflow-hidden bg-muted">
              <Image
                src={project.coverImage}
                alt={project.title}
                width={128}
                height={96}
                className="object-cover w-full h-full"
                unoptimized
              />
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
