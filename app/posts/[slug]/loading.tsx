export default function PostLoading() {
  return (
    <div className="container py-10 max-w-4xl">
      <div className="space-y-6 animate-pulse">
        <div className="h-4 bg-muted rounded w-1/4" />
        <div className="h-10 bg-muted rounded w-3/4" />
        <div className="flex gap-4">
          <div className="h-4 bg-muted rounded w-24" />
          <div className="h-4 bg-muted rounded w-20" />
        </div>
        <div className="border-t pt-8 space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 bg-muted rounded" style={{ width: `${75 + Math.random() * 25}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
