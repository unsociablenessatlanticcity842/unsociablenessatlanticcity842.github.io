import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ProjectCardSkeleton() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-12" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
        </div>
      </CardFooter>
    </Card>
  )
}
