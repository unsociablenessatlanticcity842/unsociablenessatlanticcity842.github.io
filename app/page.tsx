import { getAllPosts } from '@/lib/mdx'
import HomePageClient from './home-page-client'
import { WebSiteStructuredData } from '@/components/structured-data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

export default async function HomePage() {
  const posts = await getAllPosts()

  return (
    <>
      <WebSiteStructuredData />
      <HomePageClient posts={posts} />
    </>
  )
}
