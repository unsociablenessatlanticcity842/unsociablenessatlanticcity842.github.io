import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const dynamic = 'force-static'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #3b49df 0%, #2563eb 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
          }}
        >
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
              textAlign: 'center',
            }}
          >
            Kaameo Dev Blog
          </h1>
          <p
            style={{
              fontSize: '36px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0,
              textAlign: 'center',
            }}
          >
            개발 여정을 기록하는 블로그
          </p>
        </div>

        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            width: '200px',
            height: '200px',
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
