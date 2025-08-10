import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Tag } from "lucide-react"
import { highlightText } from "@/lib/search-utils"
import { cn } from "@/lib/utils"
import type { Post } from "@/lib/mdx"

interface PostCardProps {
  post: Post
  highlightTitle?: string
  highlightTags?: string[]
}

export function PostCard({ post, highlightTitle, highlightTags = [] }: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="line-clamp-2">
            {highlightTitle ? highlightText(post.title, highlightTitle) : post.title}
          </CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readingTime}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{post.description}</p>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          {post.category && (
            <Badge variant="secondary">{post.category}</Badge>
          )}
          {post.tags?.map((tag) => (
            <Badge 
              key={tag} 
              variant={highlightTags.includes(tag) ? "default" : "outline"} 
              className={cn(
                "text-xs",
                highlightTags.includes(tag) && "ring-2 ring-primary ring-offset-1"
              )}
            >
              <Tag className="mr-1 h-2 w-2" />
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </Link>
  )
}