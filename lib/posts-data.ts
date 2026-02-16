import { getAllPosts } from "./mdx"

export async function getCategoriesWithCount() {
  const posts = await getAllPosts()
  const categoryCounts = new Map<string, number>()

  posts.forEach((post) => {
    if (post.category) {
      const count = categoryCounts.get(post.category) || 0
      categoryCounts.set(post.category, count + 1)
    }
  })

  return Array.from(categoryCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export async function getTagsWithCount() {
  const posts = await getAllPosts()
  const tagCounts = new Map<string, number>()

  posts.forEach((post) => {
    post.tags?.forEach((tag) => {
      const count = tagCounts.get(tag) || 0
      tagCounts.set(tag, count + 1)
    })
  })

  return Array.from(tagCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}