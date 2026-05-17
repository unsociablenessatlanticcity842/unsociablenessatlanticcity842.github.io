import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getAllProjectCategories,
  getProjectsByCategory,
} from '@/lib/projects'
import { ProjectCard } from '@/components/project-card'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export async function generateStaticParams() {
  const categories = await getAllProjectCategories()
  return categories.map((category) => ({
    category: category.toLowerCase().replace(/\s+/g, '-'),
  }))
}

async function getCategoryFromSlug(slug: string): Promise<string> {
  const categories = await getAllProjectCategories()
  const normalizedSlug = slug.toLowerCase()

  const matched = categories.find(
    (cat) => cat.toLowerCase().replace(/\s+/g, '-') === normalizedSlug,
  )

  return matched || slug
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const categoryName = await getCategoryFromSlug(category)

  return {
    title: `${categoryName} 프로젝트`,
    description: `${categoryName} 카테고리의 프로젝트 목록`,
    alternates: {
      canonical: `/projects/categories/${category}/`,
    },
    openGraph: {
      title: `${categoryName} 프로젝트 | Kaameo Dev Blog`,
      description: `${categoryName} 카테고리의 프로젝트 목록`,
      url: `https://kaameo.github.io/projects/categories/${category}/`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${categoryName} 프로젝트 | Kaameo Dev Blog`,
      description: `${categoryName} 카테고리의 프로젝트 목록`,
    },
  }
}

export default async function ProjectCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const categoryName = await getCategoryFromSlug(category)
  const projects = await getProjectsByCategory(categoryName)

  if (projects.length === 0) {
    notFound()
  }

  return (
    <div className="container py-10">
      <div className="space-y-4 pb-8">
        <h1 className="text-4xl font-bold">{categoryName} 프로젝트</h1>
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
