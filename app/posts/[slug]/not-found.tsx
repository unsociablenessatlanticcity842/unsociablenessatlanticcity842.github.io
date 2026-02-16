import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'
import Link from 'next/link'

export default function PostNotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[60vh] gap-6 py-10">
      <FileQuestion className="h-16 w-16 text-muted-foreground" />
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">포스트를 찾을 수 없습니다</h2>
        <p className="text-muted-foreground">요청하신 포스트가 존재하지 않거나 삭제되었습니다.</p>
      </div>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/posts">전체 포스트 보기</Link>
        </Button>
      </div>
    </div>
  )
}
