import { Metadata } from 'next'
import { getAllProjects } from '@/lib/projects'
import { ProjectsSearchWrapper } from '@/components/projects-search-wrapper'

export const metadata: Metadata = {
  title: '프로젝트',
  description: '진행했던 프로젝트 목록',
  alternates: {
    canonical: '/projects/',
  },
  openGraph: {
    title: '프로젝트 | Kaameo Dev Blog',
    description: '진행했던 프로젝트 목록',
    url: 'https://kaameo.github.io/projects/',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '프로젝트 | Kaameo Dev Blog',
    description: '진행했던 프로젝트 목록',
  },
}

export default async function ProjectsPage() {
  const projects = await getAllProjects()

  return (
    <div className="mx-auto max-w-[960px] px-4 md:px-6 py-10 md:py-14">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-muted-foreground">
          그동안 만들고, 기여하고, 실험했던 프로젝트들을 모아두었습니다.
        </p>
      </div>
      <ProjectsSearchWrapper projects={projects} />
    </div>
  )
}
