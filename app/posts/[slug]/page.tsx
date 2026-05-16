import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/mdx'
import { MDXContent } from '@/components/mdx-content'
import { BlogLayout } from '@/components/blog-layout'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { tagToSlug } from '@/lib/slug'
import Link from 'next/link'
import Image from 'next/image'

import { BlogPostingStructuredData, BreadcrumbStructuredData } from '@/components/structured-data'
import { GiscusCommentsWrapper } from '@/components/giscus-comments-wrapper'
import { RelatedPosts } from '@/components/related-posts'

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
      type: 'article',
      publishedTime: post.date,
      url: `https://kaameo.github.io/posts/${slug}/`,
      ...(post.tags && post.tags.length > 0 && { tags: post.tags }),
      ...(post.category && { section: post.category }),
      authors: [post.author || 'Kaameo'],
    },
    twitter: {
      card: 'summary_large_image',
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
          <BreadcrumbStructuredData
            items={[
              { name: '홈', href: '/' },
              { name: '포스트', href: '/posts/' },
              { name: post.title, href: `/posts/${post.slug}/` },
            ]}
          />
          {/* Hero Header */}
          <div className="relative overflow-hidden bg-[hsl(30,8%,10%)]">
            {post.coverImage ? (
              <>
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
              </>
            ) : (
              <>
                {/* Coral mesh orbs */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                  <div className="absolute -top-24 -left-16 h-[420px] w-[420px] rounded-full bg-accent/25 blur-3xl" />
                  <div className="absolute -bottom-32 -right-10 h-[480px] w-[480px] rounded-full bg-accent/15 blur-3xl" />
                  <div className="absolute top-1/3 left-1/2 h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
                </div>
                {/* Decorative wordmark */}
                {(post.category || post.tags?.[0]) && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden pr-4 md:pr-12"
                  >
                    <span className="select-none font-mono text-[120px] md:text-[180px] font-bold uppercase tracking-tighter text-white/[0.05] whitespace-nowrap leading-none">
                      {post.category ?? post.tags?.[0]}
                    </span>
                  </div>
                )}
                {/* Subtle top fade for header chrome */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />
              </>
            )}

            {/* Header content */}
            <header className="relative z-10 mx-auto max-w-[800px] px-6 py-12 md:py-20 text-white">
              {(post.category || post.tags?.[0]) && (
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-px w-8 bg-accent" />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    {post.category ?? post.tags?.[0]}
                  </span>
                </div>
              )}
              <h1 className="text-3xl md:text-[40px] font-bold leading-tight tracking-tight">
                {post.title}
              </h1>

              {post.description && (
                <p className="mt-4 text-lg text-white/80 leading-relaxed">{post.description}</p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/70">
                {post.author && <span className="font-medium text-white">{post.author}</span>}
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
                <Badge
                  variant="outline"
                  className="rounded-full text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                >
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Comments */}
        <GiscusCommentsWrapper className="border-t pt-8 mt-12" />

        {/* Related Posts */}
        <RelatedPosts currentSlug={slug} />
      </article>
    </BlogLayout>
  )
}
