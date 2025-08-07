import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import readingTime from 'reading-time'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrism from 'rehype-prism-plus'
import { extractHeadings, type Heading } from './extract-headings'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export type Post = {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  readingTime: string
  wordCount?: number
  tags?: string[]
  category?: string
  author?: string
  coverImage?: string
  headings?: Heading[]
}

export type PostMatter = {
  title: string
  date: string
  excerpt: string
  tags?: string[]
  category?: string
  author?: string
  coverImage?: string
}

export async function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, '')
  const fullPath = path.join(postsDirectory, `${realSlug}.mdx`)
  
  if (!fs.existsSync(fullPath)) {
    return null
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        rehypeCodeTitles,
        rehypePrism,
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
  })
  
  const readTime = readingTime(content)
  const headings = extractHeadings(content)
  
  return {
    slug: realSlug,
    content: mdxSource,
    rawContent: content,
    readingTime: readTime.text,
    wordCount: readTime.words,
    headings,
    ...(data as PostMatter),
  } as Post & { content: MDXRemoteSerializeResult, rawContent: string }
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
    return []
  }
  
  const slugs = fs.readdirSync(postsDirectory)
  const posts = slugs
    .filter((slug) => slug.endsWith('.mdx'))
    .map((slug) => {
      const realSlug = slug.replace(/\.mdx$/, '')
      const fullPath = path.join(postsDirectory, slug)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      const readTime = readingTime(content)
      
      return {
        slug: realSlug,
        content,
        readingTime: readTime.text,
        wordCount: readTime.words,
        ...(data as PostMatter),
      } as Post
    })
    .sort((post1, post2) => (new Date(post2.date) > new Date(post1.date) ? 1 : -1))
  
  return posts
}

export function getPostsByTag(tag: string): Post[] {
  const allPosts = getAllPosts()
  return allPosts.filter((post) => post.tags?.includes(tag))
}

export function getPostsByCategory(category: string): Post[] {
  const allPosts = getAllPosts()
  return allPosts.filter((post) => post.category === category)
}

export function getAllTags(): string[] {
  const allPosts = getAllPosts()
  const tags = new Set<string>()
  
  allPosts.forEach((post) => {
    post.tags?.forEach((tag) => tags.add(tag))
  })
  
  return Array.from(tags).sort()
}

export function getAllCategories(): string[] {
  const allPosts = getAllPosts()
  const categories = new Set<string>()
  
  allPosts.forEach((post) => {
    if (post.category) {
      categories.add(post.category)
    }
  })
  
  return Array.from(categories).sort()
}