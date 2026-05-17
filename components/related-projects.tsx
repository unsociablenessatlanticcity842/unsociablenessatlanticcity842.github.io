import { getRelatedProjects } from '@/lib/projects'
import { HorizontalProjectCard } from '@/components/horizontal-project-card'

interface RelatedProjectsProps {
  currentSlug: string
  limit?: number
}

export async function RelatedProjects({ currentSlug, limit = 4 }: RelatedProjectsProps) {
  const related = await getRelatedProjects(currentSlug, limit)

  if (related.length === 0) return null

  return (
    <section className="mt-12 pt-8 border-t">
      <h2 className="text-xl font-bold mb-6">관련 프로젝트</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {related.map((project) => (
          <HorizontalProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  )
}
