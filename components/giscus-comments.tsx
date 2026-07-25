'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Giscus from '@giscus/react'

interface GiscusCommentsProps {
  className?: string
}

export function GiscusComments({ className = '' }: GiscusCommentsProps) {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // theme이 시스템 설정을 따르는 경우 systemTheme 사용
  const currentTheme = theme === 'system' ? systemTheme : theme

  // 클라이언트 사이드에서만 렌더링
  if (!mounted) {
    return (
      <div className={`mt-16 ${className}`}>
        <h2 className="text-2xl font-bold mb-8">댓글</h2>
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <section className={`mt-16 ${className}`} aria-label="댓글 섹션">
      <h2 className="text-2xl font-bold mb-8">댓글</h2>
      <div className="rounded-lg border bg-card p-6">
        {/* repoId/categoryId는 클라이언트 번들에 인라인되는 공개 식별자다.
            폴백을 두어 .env.local 없이도 로컬 개발에서 댓글이 동작한다. */}
        <Giscus
          repo={
            (process.env.NEXT_PUBLIC_GISCUS_REPO ||
              'kaameo/kaameo.github.io') as `${string}/${string}`
          }
          repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID || 'R_kgDOTjWb8A'}
          category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY || 'Announcements'}
          categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || 'DIC_kwDOTjWb8M4DB87H'}
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={currentTheme === 'dark' ? 'dark' : 'light'}
          lang="ko"
          loading="lazy"
        />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        댓글을 작성하려면 GitHub 계정으로 로그인이 필요합니다.
      </p>
    </section>
  )
}
