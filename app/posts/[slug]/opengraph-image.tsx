import { ImageResponse } from 'next/og'
import { getPostBySlug, getAllPosts } from '@/lib/mdx'
import { formatDate } from '@/lib/utils'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const dynamic = 'force-static'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#3b49df',
          }}
        >
          <p style={{ fontSize: '48px', color: 'white' }}>Post not found</p>
        </div>
      ),
      { ...size },
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #3b49df 0%, #2563eb 100%)',
          padding: '60px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Header with branding */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: 'white',
              display: 'flex',
            }}
          >
            Kaameo Dev Blog
          </div>
          {post.category && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '20px',
                display: 'flex',
              }}
            >
              {post.category}
            </div>
          )}
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: 'white',
              lineHeight: 1.2,
              margin: 0,
              marginBottom: '24px',
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {post.title}
          </h1>

          {post.description && (
            <p
              style={{
                fontSize: '28px',
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: 1.4,
                margin: 0,
                display: 'flex',
              }}
            >
              {post.description}
            </p>
          )}
        </div>

        {/* Footer with date */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginTop: '40px',
          }}
        >
          <div
            style={{
              fontSize: '22px',
              color: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
            }}
          >
            {formatDate(post.date)}
          </div>
          {post.readingTime && (
            <>
              <div
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.6)',
                }}
              />
              <div
                style={{
                  fontSize: '22px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                }}
              >
                {post.readingTime}
              </div>
            </>
          )}
        </div>

        {/* Decorative circle */}
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-100px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  )
}
