import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAllPosts, getPostBySlug } from "@/lib/mdx"
import { MDXContent } from "@/components/mdx-content"
import { BlogLayout } from "@/components/blog-layout"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { tagToSlug } from "@/lib/slug"
import Link from "next/link"
import Image from "next/image"

import { BlogPostingStructuredData } from "@/components/structured-data"
import { GiscusCommentsWrapper } from "@/components/giscus-comments-wrapper"
import { AdUnit } from "@/components/analytics/adsense"

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
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
    <BlogLayout
      headings={post.headings}
      header={
        <>
          <BlogPostingStructuredData
            title={post.title}
            description={post.description}
            date={post.date}
            author={post.author}
            slug={post.slug}
            category={post.category}
            tags={post.tags}
          />
          {/* Hero Header with background image */}
          <div className="relative overflow-hidden">
            {/* Background */}
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 dark:from-primary/40 dark:via-primary/20 dark:to-secondary/40" />
            )}
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Header content */}
            <header className="relative z-10 mx-auto max-w-[800px] px-6 py-12 md:py-20 text-white">
              <h1 className="text-3xl md:text-[40px] font-bold leading-tight tracking-tight">
                {post.title}
              </h1>

              {post.description && (
                <p className="mt-4 text-lg text-white/80 leading-relaxed">
                  {post.description}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/70">
                {post.author && (
                  <span className="font-medium text-white">{post.author}</span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingTime}
                </span>
              </div>
            </header>
          </div>
        </>
      }
    >
      <article className="pb-14">
        {/* Body */}
        <div className="prose dark:prose-invert max-w-none">
          <MDXContent source={post.content} />
        </div>

        {/* Tags - bottom */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/tags/${tagToSlug(tag)}`}>
                <Badge variant="outline" className="rounded-full text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Ad between content and comments */}
        <AdUnit
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_POST_BOTTOM || ''}
          format="auto"
          className="my-8"
        />

        {/* Comments */}
        <GiscusCommentsWrapper className="border-t pt-8 mt-12" />
      </article>
    </BlogLayout>
  )
}
