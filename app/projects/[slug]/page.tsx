import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllProjects, getProjectBySlug } from '@/lib/projects'
import { MDXContent } from '@/components/mdx-content'
import { BlogLayout } from '@/components/blog-layout'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { tagToSlug } from '@/lib/slug'
import Link from 'next/link'
import Image from 'next/image'

import { BlogPostingStructuredData, BreadcrumbStructuredData } from '@/components/structured-data'
import { GiscusCommentsWrapper } from '@/components/giscus-comments-wrapper'
import { RelatedProjects } from '@/components/related-projects'
import { ProjectMetaHeader } from '@/components/project-meta-header'

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return {}
  }

  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: `/projects/${slug}/`,
    },
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'article',
      publishedTime: project.date,
      url: `https://kaameo.github.io/projects/${slug}/`,
      ...(project.tags && project.tags.length > 0 && { tags: project.tags }),
      ...(project.category && { section: project.category }),
      authors: [project.author || 'Kaameo'],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <BlogLayout
      headings={project.headings}
      header={
        <>
          <BlogPostingStructuredData
            title={project.title}
            description={project.description}
            date={project.date}
            author={project.author}
            slug={project.slug}
            category={project.category}
            tags={project.tags}
          />
          <BreadcrumbStructuredData
            items={[
              { name: '홈', href: '/' },
              { name: '프로젝트', href: '/projects/' },
              { name: project.title, href: `/projects/${project.slug}/` },
            ]}
          />
          <div className="relative overflow-hidden">
            {project.coverImage ? (
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 dark:from-primary/40 dark:via-primary/20 dark:to-secondary/40" />
            )}
            <div className="absolute inset-0 bg-black/50" />

            <header className="relative z-10 mx-auto max-w-[800px] px-6 py-12 md:py-20 text-white">
              <h1 className="text-3xl md:text-[40px] font-bold leading-tight tracking-tight">
                {project.title}
              </h1>

              {project.description && (
                <p className="mt-4 text-lg text-white/80 leading-relaxed">{project.description}</p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/70">
                {project.author && <span className="font-medium text-white">{project.author}</span>}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(project.date)}
                </span>
              </div>
            </header>
          </div>
        </>
      }
    >
      <article className="pb-14">
        <ProjectMetaHeader project={project} />

        <div className="prose dark:prose-invert max-w-none mt-8">
          <MDXContent source={project.content} />
        </div>

        {project.tags && project.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Link key={tag} href={`/projects/tags/${tagToSlug(tag)}`}>
                <Badge
                  variant="outline"
                  className="rounded-full text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                >
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        <GiscusCommentsWrapper className="border-t pt-8 mt-12" />

        <RelatedProjects currentSlug={slug} />
      </article>
    </BlogLayout>
  )
}
