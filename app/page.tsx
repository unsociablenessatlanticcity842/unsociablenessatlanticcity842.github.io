import { getAllPosts } from "@/lib/mdx"
import HomePageClient from "./home-page-client"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

export default function HomePage() {
  const posts = getAllPosts()

  return <HomePageClient posts={posts} />
}