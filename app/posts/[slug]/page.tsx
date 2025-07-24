import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAllPosts, getPostBySlug } from "@/lib/mdx"
import { MDXContent } from "@/components/mdx-content"
import { BlogLayout } from "@/components/blog-layout"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Tag, ArrowLeft } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { tagToSlug } from "@/lib/slug"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface PostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <BlogLayout headings={post.headings}>
      <article className="py-10">
        <Link href="/posts">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            모든 포스트로
          </Button>
        </Link>

        <header className="space-y-4 pb-8">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readingTime}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {post.category && (
              <Link href={`/categories/${post.category.toLowerCase()}`}>
                <Badge variant="secondary">{post.category}</Badge>
              </Link>
            )}
            {post.tags?.map((tag) => (
              <Link key={tag} href={`/tags/${tagToSlug(tag)}`}>
                <Badge variant="outline" className="text-xs">
                  <Tag className="mr-1 h-2 w-2" />
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <MDXContent source={post.content} />
        </div>
      </article>
    </BlogLayout>
  )
}