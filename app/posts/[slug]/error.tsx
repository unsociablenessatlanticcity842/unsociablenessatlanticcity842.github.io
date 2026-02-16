"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FileWarning } from "lucide-react"
import Link from "next/link"

export default function PostError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Optionally log to error reporting service
  }, [error])

  return (
    <div className="container flex flex-col items-center justify-center min-h-[60vh] gap-6 py-10">
      <FileWarning className="h-16 w-16 text-destructive" />
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">포스트를 불러올 수 없습니다</h2>
        <p className="text-muted-foreground">
          포스트를 렌더링하는 중 오류가 발생했습니다.
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={reset} variant="default">
          다시 시도
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    </div>
  )
}
