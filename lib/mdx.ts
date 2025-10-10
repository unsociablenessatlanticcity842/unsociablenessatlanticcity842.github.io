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
  description: string
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
  description: string
  tags?: string[]
  category?: string
  author?: string
  coverImage?: string
}

export async function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, '')
  
  // Helper function to find post file
  function findPostFile(searchSlug: string): { path: string; category?: string } | null {
    // 1. First try direct path (backward compatibility for flat structure)
    const directPath = path.join(postsDirectory, `${searchSlug}.mdx`)
    if (fs.existsSync(directPath)) {
      return { path: directPath }
    }
    
    // 2. Search in category folders
    function searchInDirectory(dir: string, categoryPath?: string, depth = 0): { path: string; category?: string } | null {
      if (depth > 2) return null // Max depth limit
      
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true })
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name)
          
          if (entry.isDirectory()) {
            // Build category path
            const newCategoryPath = categoryPath 
              ? `${categoryPath}/${entry.name}` 
              : entry.name
            
            // Recursively search in subdirectories
            const result = searchInDirectory(fullPath, newCategoryPath, depth + 1)
            if (result) return result
          } else if (entry.name === `${searchSlug}.mdx`) {
            // Found the file!
            return { path: fullPath, category: categoryPath }
          }
        }
      } catch (error) {
        // Directory doesn't exist or can't be read
        console.error(`Error searching directory ${dir}:`, error)
      }
      
      return null
    }
    
    // Search starting from posts directory
    return searchInDirectory(postsDirectory)
  }
  
  // Find the post file
  const fileInfo = findPostFile(realSlug)
  if (!fileInfo) {
    return null
  }
  
  // Read and process the file
  const fileContents = fs.readFileSync(fileInfo.path, 'utf8')
  const { data, content } = matter(fileContents)
  
  // Serialize MDX content
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        rehypeCodeTitles,
        [
          rehypePrism,
          {
            ignoreMissing: true, // 언어가 없거나 지원하지 않는 언어는 무시
            defaultLanguage: 'plaintext', // 기본 언어 설정
          }
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
  })
  
  const readTime = readingTime(content)
  const headings = extractHeadings(content)
  
  // Use category from frontmatter if available, otherwise from folder structure
  const category = data.category || fileInfo.category
  
  return {
    slug: realSlug,
    content: mdxSource,
    rawContent: content,
    readingTime: readTime.text,
    wordCount: readTime.words,
    headings,
    category,
    ...(data as PostMatter),
  } as Post & { content: MDXRemoteSerializeResult, rawContent: string }
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
    return []
  }
  
  const posts: Post[] = []
  
  // Helper function to process MDX files
  function processMdxFile(filePath: string, categoryFromPath?: string) {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    const readTime = readingTime(content)
    
    // Extract filename without extension for slug
    const fileName = path.basename(filePath, '.mdx')
    
    // Category priority: frontmatter > folder structure > undefined
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
  
  // Recursive function to scan directories
  function scanDirectory(dir: string, categoryPath?: string, depth = 0) {
    // Limit depth to prevent deep nesting (max 2 levels: category/subcategory)
    if (depth > 2) return
    
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      
      if (entry.isDirectory()) {
        // Build category path (e.g., "devops" or "devops/docker")
        const newCategoryPath = categoryPath 
          ? `${categoryPath}/${entry.name}` 
          : entry.name
        
        // Recursively scan subdirectories
        scanDirectory(fullPath, newCategoryPath, depth + 1)
      } else if (entry.name.endsWith('.mdx')) {
        // Process MDX file
        const post = processMdxFile(fullPath, categoryPath)
        posts.push(post)
      }
    }
  }
  
  // Start scanning from the posts directory
  scanDirectory(postsDirectory)
  
  // Sort posts by date (newest first)
  return posts.sort((post1, post2) => 
    new Date(post2.date) > new Date(post1.date) ? 1 : -1
  )
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
  const categories = new Set<string>()
  
  // Method 1: Get categories from folder structure
  function scanForCategories(dir: string, depth = 0) {
    if (depth > 2) return // Max depth limit
    
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          // Add folder name as a category
          categories.add(entry.name)
          
          // For sub-categories, you might want to add them as "parent/child"
          // Uncomment the following if you want sub-categories listed separately:
          // const subDir = path.join(dir, entry.name)
          // scanForCategories(subDir, depth + 1)
        }
      }
    } catch (error) {
      console.error(`Error scanning for categories in ${dir}:`, error)
    }
  }
  
  // Scan the posts directory for folder-based categories
  if (fs.existsSync(postsDirectory)) {
    scanForCategories(postsDirectory)
  }
  
  // Method 2: Also get categories from post frontmatter (for backward compatibility)
  const allPosts = getAllPosts()
  allPosts.forEach((post) => {
    if (post.category) {
      // Handle both simple categories and nested ones (e.g., "devops/docker")
      const mainCategory = post.category.split('/')[0]
      categories.add(mainCategory)
      
      // Optionally add the full path as a category too
      if (post.category.includes('/')) {
        categories.add(post.category)
      }
    }
  })
  
  return Array.from(categories).sort()
}