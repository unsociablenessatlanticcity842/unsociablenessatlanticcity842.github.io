'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Github, Globe, BookOpen, Download } from 'lucide-react'
import Link from 'next/link'

type Language = 'en' | 'ko'

interface Content {
  tagline: string
  intro: string
  about: {
    title: string
    content: string[]
    competencies: {
      title: string
      items: string[]
    }
  }
  links: {
    velog: string
    github: string
  }
}

const content: Record<Language, Content> = {
  en: {
    tagline: 'Hi there!',
    intro:
      "I'm a passionate developer who loves learning new things and applying them in creative ways. My main interests are in backend development, full-stack web development, cloud infrastructure, and creating meaningful services for users.",
    about: {
      title: 'About Me',
      content: [
        'I believe technology creates real value when it solves actual problems.',
        "and I aspire to become a developer who creates services that truly improve users' lives.",
      ],
      competencies: {
        title: 'Core Competencies',
        items: [
          'Full-stack web development and real-time system development',
          'Cloud infrastructure design and container orchestration',
          'Enterprise-level system architecture design',
        ],
      },
    },
    links: {
      velog: 'My Velog Blog',
      github: 'GitHub',
    },
  },
  ko: {
    tagline: '안녕하세요!',
    intro:
      '새로운 것을 배우고 창의적으로 적용하는 것을 좋아하는 개발자입니다. 주요 관심사는 백엔드 개발, 풀스택 웹 개발, 클라우드 인프라, 그리고 사용자에게 의미 있는 서비스를 만드는 것입니다.',
    about: {
      title: 'About Me',
      content: [
        '기술은 실제 문제를 해결할 때 진정한 가치를 만든다고 믿습니다.',
        '사용자의 삶을 진정으로 개선하는 서비스를 만드는 개발자가 되고 싶습니다.',
      ],
      competencies: {
        title: '핵심 역량',
        items: [
          '풀스택 웹 개발 및 실시간 시스템 구축',
          '클라우드 인프라 설계 및 컨테이너 오케스트레이션',
          '엔터프라이즈급 시스템 아키텍처 설계',
        ],
      },
    },
    links: {
      velog: '나의 벨로그 블로그',
      github: 'GitHub',
    },
  },
}

export function AboutContent() {
  const [lang, setLang] = useState<Language>('ko')
  const t = content[lang]

  return (
    <div className="container py-10 max-w-5xl">
      <div className="space-y-8">
        {/* Language Toggle */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
            aria-label={lang === 'ko' ? 'Switch to English' : '한국어로 전환'}
          >
            <Globe className="mr-2 h-4 w-4" />
            {lang === 'ko' ? 'English' : '한국어'}
          </Button>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">{t.tagline}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t.intro}</p>
        </div>

        {/* About Me */}
        <Card>
          <CardHeader>
            <CardTitle>{t.about.title}</CardTitle>
            <div className="flex flex-wrap gap-4 pt-4">
              <a href="/hong-jinsu_resume.pdf" download>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  {lang === 'ko' ? '이력서' : 'Resume'}
                </Button>
              </a>
              <a href="/hong-jinsu_work_experience.pdf" download>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  {lang === 'ko' ? '경력기술서' : 'Career Summary'}
                </Button>
              </a>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose dark:prose-invert max-w-none">
              {t.about.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <div>
              <h3 className="font-semibold mb-3">{t.about.competencies.title}:</h3>
              <ul className="space-y-2">
                {t.about.competencies.items.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Links */}
        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Link href="https://velog.io/@kaameo/posts" target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm">
                  <BookOpen className="mr-2 h-4 w-4" />
                  {t.links.velog}
                </Button>
              </Link>
              <Link href="https://github.com/kaameo" target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm">
                  <Github className="mr-2 h-4 w-4" />
                  {t.links.github}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* GitHub Contributions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              {lang === 'ko' ? 'GitHub 활동' : 'GitHub Activity'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://ghchart.rshah.org/kaameo"
              alt="GitHub Contributions"
              className="w-full dark:invert dark:hue-rotate-180"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
