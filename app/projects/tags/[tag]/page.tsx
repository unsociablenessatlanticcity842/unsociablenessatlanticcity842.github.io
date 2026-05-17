import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllProjectTags, getProjectsByTag } from '@/lib/projects'
import { ProjectCard } from '@/components/project-card'
import { tagToSlug, slugToTag } from '@/lib/slug'

interface TagPageProps {
  params: Promise<{
    tag: string
  }>
}

export async function generateStaticParams() {
  const tags = await getAllProjectTags()
  return tags.map((tag) => ({
    tag: tagToSlug(tag),
  }))
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params
  const allTags = await getAllProjectTags()
  const actualTag = slugToTag(tag, allTags)

  if (!actualTag) {
    return {}
  }

  return {
    title: `${actualTag} 프로젝트`,
    description: `${actualTag} 태그가 포함된 프로젝트 목록`,
    alternates: {
      canonical: `/projects/tags/${tag}/`,
    },
    openGraph: {
      title: `${actualTag} 프로젝트 | Kaameo Dev Blog`,
      description: `${actualTag} 태그가 포함된 프로젝트 목록`,
      url: `https://kaameo.github.io/projects/tags/${tag}/`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${actualTag} 프로젝트 | Kaameo Dev Blog`,
      description: `${actualTag} 태그가 포함된 프로젝트 목록`,
    },
  }
}

export default async function ProjectTagPage({ params }: TagPageProps) {
  const { tag } = await params
  const allTags = await getAllProjectTags()
  const actualTag = slugToTag(tag, allTags)

  if (!actualTag) {
    notFound()
  }

  const projects = await getProjectsByTag(actualTag)

  if (projects.length === 0) {
    notFound()
  }

  return (
    <div className="container py-10">
      <div className="space-y-4 pb-8">
        <h1 className="text-4xl font-bold">#{actualTag}</h1>
        <p className="text-muted-foreground">총 {projects.length}개의 프로젝트가 있습니다.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  )
}
