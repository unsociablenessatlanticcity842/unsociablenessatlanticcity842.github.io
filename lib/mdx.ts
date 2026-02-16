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
import { frontmatterSchema } from './frontmatter-schema'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export type Post = {
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
  series?: string
  seriesOrder?: number
}

export type PostMatter = {
  title: string
  date: string
  description: string
  tags?: string[]
  category?: string
  author?: string
  coverImage?: string
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

export async function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, '')

  async function findPostFile(
    searchSlug: string,
  ): Promise<{ path: string; category?: string } | null> {
    const directPath = path.join(postsDirectory, `${searchSlug}.mdx`)
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

    return searchInDirectory(postsDirectory)
  }

  const fileInfo = await findPostFile(realSlug)
  if (!fileInfo) {
    return null
  }

  const fileContents = await fs.readFile(fileInfo.path, 'utf8')
  const { data, content } = matter(fileContents)

  const parsed = frontmatterSchema.safeParse(data)
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
    ...(data as PostMatter),
  } as Post & { content: ReactElement; rawContent: string }
}

export async function getAllPosts(): Promise<Post[]> {
  if (!(await fileExists(postsDirectory))) {
    await fs.mkdir(postsDirectory, { recursive: true })
    return []
  }

  const posts: Post[] = []

  async function processMdxFile(filePath: string, categoryFromPath?: string): Promise<Post | null> {
    const fileContents = await fs.readFile(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    const parsed = frontmatterSchema.safeParse(data)
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
      ...(data as PostMatter),
    } as Post
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
        const post = await processMdxFile(fullPath, categoryPath)
        if (post) {
          posts.push(post)
        }
      }
    }
  }

  await scanDirectory(postsDirectory)

  return posts.sort((post1, post2) => (new Date(post2.date) > new Date(post1.date) ? 1 : -1))
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter((post) => post.tags?.includes(tag))
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter((post) => post.category === category)
}

export async function getAllTags(): Promise<string[]> {
  const allPosts = await getAllPosts()
  const tags = new Set<string>()

  allPosts.forEach((post) => {
    post.tags?.forEach((tag) => tags.add(tag))
  })

  return Array.from(tags).sort()
}

export async function getRelatedPosts(currentSlug: string, limit = 4): Promise<Post[]> {
  const allPosts = await getAllPosts()
  const current = allPosts.find((p) => p.slug === currentSlug)
  if (!current) return []

  const currentTags = new Set(current.tags ?? [])

  const others = allPosts.filter((p) => p.slug !== currentSlug)

  const scored = others
    .map((post) => {
      let score = 0

      if (current.series && post.series === current.series) {
        score += 30
      }

      if (current.category && post.category === current.category) {
        score += 20
      }

      const postTags = post.tags ?? []
      for (const tag of postTags) {
        if (currentTags.has(tag)) {
          score += 5
        }
      }

      return { post, score }
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
    })

  return scored.slice(0, limit).map(({ post }) => post)
}

export async function getAllCategories(): Promise<string[]> {
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

  if (await fileExists(postsDirectory)) {
    await scanForCategories(postsDirectory)
  }

  const allPosts = await getAllPosts()
  allPosts.forEach((post) => {
    if (post.category) {
      const mainCategory = post.category.split('/')[0]
      categories.add(mainCategory)

      if (post.category.includes('/')) {
        categories.add(post.category)
      }
    }
  })

  return Array.from(categories).sort()
}
