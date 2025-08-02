import { getAllPosts } from "@/lib/mdx"
import HomePageClient from "./home-page-client"

export default function HomePage() {
  const posts = getAllPosts()
  
  return <HomePageClient posts={posts} />
}