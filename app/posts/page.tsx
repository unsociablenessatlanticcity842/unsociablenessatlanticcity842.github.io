import { Metadata } from 'next'
import { getAllPosts } from '@/lib/mdx'
import { PostsSearchWrapper } from '@/components/posts-search-wrapper'

export const metadata: Metadata = {
  title: '전체 포스트',
  description: '모든 블로그 포스트 목록',
  alternates: {
    canonical: '/posts/',
  },
  openGraph: {
    title: '전체 포스트 | Kaameo Dev Blog',
    description: '모든 블로그 포스트 목록',
    url: 'https://kaameo.github.io/posts/',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '전체 포스트 | Kaameo Dev Blog',
    description: '모든 블로그 포스트 목록',
  },
}

export default async function PostsPage() {
  const posts = await getAllPosts()

  return (
    <div className="mx-auto max-w-[720px] px-4 md:px-6 py-10 md:py-14">
      <h1 className="text-3xl font-bold mb-8">Posts</h1>
      <PostsSearchWrapper posts={posts} />
    </div>
  )
}
