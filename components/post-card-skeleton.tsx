import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function PostCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-16" />
      </CardFooter>
    </Card>
  )
}
