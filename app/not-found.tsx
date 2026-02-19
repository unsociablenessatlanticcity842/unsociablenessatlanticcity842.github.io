import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다',
  description: '요청하신 페이지가 존재하지 않거나 이동되었습니다.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[60vh] gap-6 py-10">
      <FileQuestion className="h-16 w-16 text-muted-foreground" />
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">페이지를 찾을 수 없습니다</h2>
        <p className="text-muted-foreground">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
      </div>
      <Button asChild>
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </div>
  )
}
