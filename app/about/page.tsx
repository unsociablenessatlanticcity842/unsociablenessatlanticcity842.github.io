import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Mail, Twitter } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About",
  description: "Kaameo 개발자 소개",
}

export default function AboutPage() {
  const skills = [
    "React", "Next.js", "TypeScript", "JavaScript",
    "Node.js", "Tailwind CSS", "Git", "GitHub",
    "HTML5", "CSS3", "REST API", "GraphQL"
  ]

  return (
    <div className="container py-10 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">About Me</h1>
          <p className="text-xl text-muted-foreground">
            안녕하세요, 프론트엔드 개발자 Kaameo입니다.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>소개</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              웹 개발에 열정을 가진 프론트엔드 개발자입니다. 
              사용자 경험을 개선하고 아름다운 인터페이스를 만드는 것을 좋아합니다.
            </p>
            <p>
              주로 React와 Next.js를 사용하여 웹 애플리케이션을 개발하고 있으며,
              TypeScript를 통한 타입 안정성과 코드 품질 향상에 관심이 많습니다.
            </p>
            <p>
              이 블로그를 통해 개발하면서 배운 것들을 기록하고,
              다른 개발자들과 지식을 공유하고자 합니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>기술 스택</CardTitle>
            <CardDescription>
              주로 사용하는 기술들입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
            <CardDescription>
              저와 연락하고 싶으시다면 아래 채널을 이용해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Link href="https://github.com/kaameo" target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </Link>
              <Link href="https://twitter.com/kaameo" target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm">
                  <Twitter className="mr-2 h-4 w-4" />
                  Twitter
                </Button>
              </Link>
              <Link href="https://linkedin.com/in/kaameo" target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm">
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </Button>
              </Link>
              <Link href="mailto:kaameo@example.com">
                <Button variant="outline" size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}