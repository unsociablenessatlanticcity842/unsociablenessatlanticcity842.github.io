import { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { FolderOpen } from 'lucide-react'
import { getProjectCategoriesWithCount } from '@/lib/projects-data'

export const metadata: Metadata = {
  title: '프로젝트 카테고리',
  description: '프로젝트 카테고리 목록',
  alternates: {
    canonical: '/projects/categories/',
  },
  openGraph: {
    title: '프로젝트 카테고리 | Kaameo Dev Blog',
    description: '프로젝트 카테고리 목록',
    url: 'https://kaameo.github.io/projects/categories/',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '프로젝트 카테고리 | Kaameo Dev Blog',
    description: '프로젝트 카테고리 목록',
  },
}

export default async function ProjectCategoriesPage() {
  const categories = await getProjectCategoriesWithCount()

  return (
    <div className="container py-10">
      <div className="space-y-4 pb-8">
        <h1 className="text-4xl font-bold flex items-center gap-2">
          <FolderOpen className="h-8 w-8" />
          프로젝트 카테고리
        </h1>
        <p className="text-muted-foreground">총 {categories.length}개의 카테고리가 있습니다.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/projects/categories/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {cat.name}
                </h2>
                <p className="text-sm text-muted-foreground">{cat.count}개의 프로젝트</p>
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {cat.count}
              </Badge>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  )
}
