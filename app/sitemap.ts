import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/mdx'
import { getAllProjects } from '@/lib/projects'
import { getCategoriesWithCount, getTagsWithCount } from '@/lib/posts-data'
import { getProjectCategoriesWithCount, getProjectTagsWithCount } from '@/lib/projects-data'
import { tagToSlug } from '@/lib/slug'

// Required for static export
export const dynamic = 'force-static'

const SITE_URL = 'https://kaameo.github.io'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects, categories, tags, projectCategories, projectTags] = await Promise.all([
    getAllPosts(),
    getAllProjects(),
    getCategoriesWithCount(),
    getTagsWithCount(),
    getProjectCategoriesWithCount(),
    getProjectTagsWithCount(),
  ])

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
      url: `${SITE_URL}/projects/`,
      changeFrequency: 'weekly',
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
    {
      url: `${SITE_URL}/projects/tags/`,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/projects/categories/`,
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

  // Project pages
  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}/`,
    lastModified: new Date(project.date),
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

  // Project category pages
  const projectCategoryPages: MetadataRoute.Sitemap = projectCategories.map((category) => ({
    url: `${SITE_URL}/projects/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}/`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Project tag pages
  const projectTagPages: MetadataRoute.Sitemap = projectTags.map((tag) => ({
    url: `${SITE_URL}/projects/tags/${tagToSlug(tag.name)}/`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...postPages,
    ...projectPages,
    ...categoryPages,
    ...tagPages,
    ...projectCategoryPages,
    ...projectTagPages,
  ]
}
