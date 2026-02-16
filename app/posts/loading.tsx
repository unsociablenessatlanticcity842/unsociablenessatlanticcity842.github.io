export default function PostsLoading() {
  return (
    <div className="container py-10 max-w-5xl">
      <div className="space-y-8 animate-pulse">
        <div className="h-12 bg-muted rounded-lg" />
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-muted rounded" />
          <div className="h-10 w-24 bg-muted rounded" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-lg border p-6">
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
