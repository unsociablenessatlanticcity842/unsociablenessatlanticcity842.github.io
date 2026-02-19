import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/mdx'
import { getCategoriesWithCount, getTagsWithCount } from '@/lib/posts-data'
import { tagToSlug } from '@/lib/slug'

// Required for static export
export const dynamic = 'force-static'

const SITE_URL = 'https://kaameo.github.io'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const categories = await getCategoriesWithCount()
  const tags = await getTagsWithCount()

  // Static pages (no lastModified to avoid unnecessary crawling on every build)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/posts/`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about/`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/tags/`,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/categories/`,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ]

  // Post pages
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/posts/${post.slug}/`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}/`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Tag pages
  const tagPages: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${SITE_URL}/tags/${tagToSlug(tag.name)}/`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticPages, ...postPages, ...categoryPages, ...tagPages]
}
