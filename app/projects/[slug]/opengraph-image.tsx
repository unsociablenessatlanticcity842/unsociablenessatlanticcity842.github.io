import { ImageResponse } from 'next/og'
import { getProjectBySlug, getAllProjects } from '@/lib/projects'
import { formatDate } from '@/lib/utils'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const dynamic = 'force-static'

export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return new ImageResponse(
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
        <p style={{ fontSize: '48px', color: 'white' }}>Project not found</p>
      </div>,
      { ...size },
    )
  }

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '60px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
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
          Kaameo · Projects
        </div>
        {project.category && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '20px',
              fontSize: '20px',
              display: 'flex',
            }}
          >
            {project.category}
          </div>
        )}
      </div>

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
          {project.title}
        </h1>

        {project.description && (
          <p
            style={{
              fontSize: '26px',
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: 1.4,
              margin: 0,
              display: 'flex',
            }}
          >
            {project.description}
          </p>
        )}
      </div>

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
            color: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
          }}
        >
          {project.period || formatDate(project.date)}
        </div>
        {project.stack && project.stack.length > 0 && (
          <>
            <div
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.5)',
              }}
            />
            <div
              style={{
                fontSize: '22px',
                color: 'rgba(255, 255, 255, 0.7)',
                display: 'flex',
              }}
            >
              {project.stack.slice(0, 3).join(' · ')}
            </div>
          </>
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
        }}
      />
    </div>,
    { ...size },
  )
}
