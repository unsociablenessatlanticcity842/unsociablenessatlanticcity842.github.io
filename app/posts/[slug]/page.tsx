import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAllPosts, getPostBySlug } from "@/lib/mdx"
import { MDXContent } from "@/components/mdx-content"
import { BlogLayout } from "@/components/blog-layout"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Tag, ArrowLeft, Eye, Code } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { tagToSlug } from "@/lib/slug"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostTrackerWrapper } from "@/components/analytics/post-tracker-wrapper"
import { BlogPostingStructuredData } from "@/components/structured-data"
import { GiscusCommentsWrapper } from "@/components/giscus-comments-wrapper"

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/posts/${slug}/`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `https://kaameo.github.io/posts/${slug}/`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <BlogLayout headings={post.headings}>
      <BlogPostingStructuredData
        title={post.title}
        description={post.description}
        date={post.date}
        author={post.author}
        slug={post.slug}
        category={post.category}
        tags={post.tags}
      />
      <PostTrackerWrapper
        title={post.title}
        slug={post.slug}
        category={post.category}
        tags={post.tags}
        author={post.author}
        readingTime={post.readingTime ? parseInt(post.readingTime) : undefined}
        wordCount={post.wordCount}
      />
      <article className="py-10">
        <Link href="/posts">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            모든 포스트로
          </Button>
        </Link>

        <header className="space-y-4 pb-8">
          <h1 className="text-4xl font-bold">{post.title}</h1>

          {post.description && (
            <p className="text-lg text-muted-foreground leading-relaxed">
              {post.description}
            </p>
          )}

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
              <Link href={`/categories/${post.category.toLowerCase().replace(/\s+/g, '-')}`}>
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

        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="markdown" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Markdown
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="mt-6">
            <div className="prose dark:prose-invert max-w-5xl mx-auto">
              <MDXContent source={post.content} />
            </div>
          </TabsContent>
          
          <TabsContent value="markdown" className="mt-6">
            <div className="rounded-lg border bg-muted/50 p-4 overflow-x-auto">
              <pre className="text-sm">
                <code>{post.rawContent}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>

        {/* 댓글 섹션 */}
        <GiscusCommentsWrapper className="border-t pt-8" />
      </article>
    </BlogLayout>
  )
}