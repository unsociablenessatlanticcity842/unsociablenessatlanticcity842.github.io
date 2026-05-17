import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'
import readingTime from 'reading-time'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrism from 'rehype-prism-plus'
import { extractHeadings, type Heading } from './extract-headings'
import { ReactElement } from 'react'
import { mdxComponents } from '@/components/mdx-components'
import { projectFrontmatterSchema } from './project-frontmatter-schema'

const projectsDirectory = path.join(process.cwd(), 'content/projects')

export type ProjectStatus = 'active' | 'completed' | 'archived'

export type Project = {
  slug: string
  title: string
  date: string
  description: string
  content: string
  readingTime: string
  wordCount?: number
  tags?: string[]
  category?: string
  author?: string
  coverImage?: string
  headings?: Heading[]
  github?: string
  demo?: string
  stack?: string[]
  period?: string
  status?: ProjectStatus
}

export type ProjectMatter = {
  title: string
  date: string
  description: string
  tags?: string[]
  category?: string
  author?: string
  coverImage?: string
  github?: string
  demo?: string
  stack?: string[]
  period?: string
  status?: ProjectStatus
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

export async function getProjectBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, '')

  async function findProjectFile(
    searchSlug: string,
  ): Promise<{ path: string; category?: string } | null> {
    const directPath = path.join(projectsDirectory, `${searchSlug}.mdx`)
    if (await fileExists(directPath)) {
      return { path: directPath }
    }

    async function searchInDirectory(
      dir: string,
      categoryPath?: string,
      depth = 0,
    ): Promise<{ path: string; category?: string } | null> {
      if (depth > 2) return null

      try {
        const entries = await fs.readdir(dir, { withFileTypes: true })

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name)

          if (entry.isDirectory()) {
            const newCategoryPath = categoryPath ? `${categoryPath}/${entry.name}` : entry.name

            const result = await searchInDirectory(fullPath, newCategoryPath, depth + 1)
            if (result) return result
          } else if (entry.name === `${searchSlug}.mdx`) {
            return { path: fullPath, category: categoryPath }
          }
        }
      } catch {
        return null
      }

      return null
    }

    return searchInDirectory(projectsDirectory)
  }

  const fileInfo = await findProjectFile(realSlug)
  if (!fileInfo) {
    return null
  }

  const fileContents = await fs.readFile(fileInfo.path, 'utf8')
  const { data, content } = matter(fileContents)

  const parsed = projectFrontmatterSchema.safeParse(data)
  if (!parsed.success) {
    return null
  }

  const { content: mdxContent } = await compileMDX({
    source: content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          rehypeCodeTitles,
          [
            rehypePrism,
            {
              ignoreMissing: true,
              defaultLanguage: 'plaintext',
            },
          ],
          [
            rehypeAutolinkHeadings,
            {
              properties: {
                className: ['anchor'],
              },
            },
          ],
        ],
      },
    },
  })

  const readTime = readingTime(content)
  const headings = extractHeadings(content)

  const category = data.category || fileInfo.category

  return {
    slug: realSlug,
    content: mdxContent,
    rawContent: content,
    readingTime: readTime.text,
    wordCount: readTime.words,
    headings,
    category,
    ...(data as ProjectMatter),
  } as Project & { content: ReactElement; rawContent: string }
}

export async function getAllProjects(): Promise<Project[]> {
  if (!(await fileExists(projectsDirectory))) {
    await fs.mkdir(projectsDirectory, { recursive: true })
    return []
  }

  const projects: Project[] = []

  async function processMdxFile(
    filePath: string,
    categoryFromPath?: string,
  ): Promise<Project | null> {
    const fileContents = await fs.readFile(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    const parsed = projectFrontmatterSchema.safeParse(data)
    if (!parsed.success) {
      return null
    }

    const readTime = readingTime(content)
    const fileName = path.basename(filePath, '.mdx')
    const category = data.category || categoryFromPath

    return {
      slug: fileName,
      content,
      readingTime: readTime.text,
      wordCount: readTime.words,
      category,
      ...(data as ProjectMatter),
    } as Project
  }

  async function scanDirectory(dir: string, categoryPath?: string, depth = 0): Promise<void> {
    if (depth > 2) return

    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        const newCategoryPath = categoryPath ? `${categoryPath}/${entry.name}` : entry.name

        await scanDirectory(fullPath, newCategoryPath, depth + 1)
      } else if (entry.name.endsWith('.mdx')) {
        const project = await processMdxFile(fullPath, categoryPath)
        if (project) {
          projects.push(project)
        }
      }
    }
  }

  await scanDirectory(projectsDirectory)

  return projects.sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1))
}

export async function getProjectsByTag(tag: string): Promise<Project[]> {
  const all = await getAllProjects()
  return all.filter((project) => project.tags?.includes(tag))
}

export async function getProjectsByCategory(category: string): Promise<Project[]> {
  const all = await getAllProjects()
  return all.filter((project) => project.category === category)
}

export async function getAllProjectTags(): Promise<string[]> {
  const all = await getAllProjects()
  const tags = new Set<string>()

  all.forEach((project) => {
    project.tags?.forEach((tag) => tags.add(tag))
  })

  return Array.from(tags).sort()
}

export async function getRelatedProjects(currentSlug: string, limit = 4): Promise<Project[]> {
  const all = await getAllProjects()
  const current = all.find((p) => p.slug === currentSlug)
  if (!current) return []

  const currentTags = new Set(current.tags ?? [])

  const others = all.filter((p) => p.slug !== currentSlug)

  const scored = others
    .map((project) => {
      let score = 0

      if (current.category && project.category === current.category) {
        score += 20
      }

      const projectTags = project.tags ?? []
      for (const tag of projectTags) {
        if (currentTags.has(tag)) {
          score += 5
        }
      }

      return { project, score }
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return new Date(b.project.date).getTime() - new Date(a.project.date).getTime()
    })

  return scored.slice(0, limit).map(({ project }) => project)
}

export async function getAllProjectCategories(): Promise<string[]> {
  const categories = new Set<string>()

  async function scanForCategories(dir: string, depth = 0): Promise<void> {
    if (depth > 2) return

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        if (entry.isDirectory()) {
          categories.add(entry.name)
        }
      }
    } catch {
      // Directory doesn't exist or can't be read
    }
  }

  if (await fileExists(projectsDirectory)) {
    await scanForCategories(projectsDirectory)
  }

  const all = await getAllProjects()
  all.forEach((project) => {
    if (project.category) {
      const mainCategory = project.category.split('/')[0]
      categories.add(mainCategory)

      if (project.category.includes('/')) {
        categories.add(project.category)
      }
    }
  })

  return Array.from(categories).sort()
}
