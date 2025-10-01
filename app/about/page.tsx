"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Github, 
  Globe, 
  Award, 
  Briefcase, 
  GraduationCap,
  Code,
  BookOpen,
  Sparkles
} from "lucide-react"
import Link from "next/link"

type Language = "en" | "ko"

interface TechCategory {
  category: string
  items: string[]
  badges: string[]
}

interface Project {
  title: string
  techStack: string
  features: string[]
  icon: string
}

interface Content {
  name: string
  tagline: string
  intro: string
  education: {
    title: string
    school: string
    period: string
  }
  techStack: {
    title: string
    categories: TechCategory[]
  }
  certifications: {
    title: string
    items: string[]
  }
  internship: {
    title: string
    period: string
    points: string[]
  }
  projects: {
    title: string
    items: Project[]
  }
  learning: {
    title: string
    items: string[]
  }
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
  stats: {
    title: string
  }
}

const content: Record<Language, Content> = {
  en: {
    name: "Hong Jinsu",
    tagline: "Hi there! I'm Hong Jinsu 👋",
    intro: "I'm a passionate developer who loves learning new things and applying them in creative ways. My main interests are in backend development, full-stack web development, network security, cloud infrastructure, and creating meaningful services for users.",
    education: {
      title: "Education",
      school: "Department of Software, Ajou University",
      period: "2021.03 ~ Present"
    },
    techStack: {
      title: "Tech Stack",
      categories: [
        {
          category: "Languages",
          items: ["Java", "JavaScript", "TypeScript", "C", "C++"],
          badges: [
            "https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white",
            "https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black",
            "https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white",
            "https://img.shields.io/badge/C-00599C?style=for-the-badge&logo=c&logoColor=white",
            "https://img.shields.io/badge/C++-00599C?style=for-the-badge&logo=cplusplus&logoColor=white"
          ]
        },
        {
          category: "Frontend",
          items: ["React", "Next.js"],
          badges: [
            "https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black",
            "https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"
          ]
        },
        {
          category: "Backend",
          items: ["Spring Boot", "ABP Framework", "Node.js"],
          badges: [
            "https://img.shields.io/badge/Spring Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white",
            "https://img.shields.io/badge/ABP Framework-3C5AFE?style=for-the-badge&logoColor=white",
            "https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"
          ]
        },
        {
          category: "Database",
          items: ["MySQL", "PostgreSQL", "Supabase"],
          badges: [
            "https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white",
            "https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white",
            "https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white"
          ]
        },
        {
          category: "Cloud & DevOps",
          items: ["Docker", "Kubernetes", "Git"],
          badges: [
            "https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white",
            "https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white",
            "https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white"
          ]
        },
        {
          category: "Security & Monitoring",
          items: ["Wazuh", "Palo Alto"],
          badges: [
            "https://img.shields.io/badge/Wazuh-0066CC?style=for-the-badge&logoColor=white",
            "https://img.shields.io/badge/Palo Alto-FF6600?style=for-the-badge&logoColor=white"
          ]
        },
        {
          category: "Others",
          items: ["Apache Kafka", "HAProxy", "Nginx"],
          badges: [
            "https://img.shields.io/badge/Apache Kafka-231F20?style=for-the-badge&logo=apachekafka&logoColor=white",
            "https://img.shields.io/badge/HAProxy-009639?style=for-the-badge&logoColor=white",
            "https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white"
          ]
        }
      ]
    },
    certifications: {
      title: "Certifications",
      items: [
        "Engineer Information Processing",
        "SQL Developer Certification (SQLD)"
      ]
    },
    internship: {
      title: "Internship Experience (26 weeks)",
      period: "2024 ~ 2025 | 6-month Internship",
      points: [
        "ABP Framework based full-stack development",
        "Real-time communication system development (Socket.io, Supabase)",
        "Cloud-native architecture design and implementation",
        "Network security SIEM system development (Palo Alto, Wazuh, XDR)",
        "Microservices and container orchestration (Kubernetes)",
        "CI/CD pipeline setup and monitoring system configuration"
      ]
    },
    projects: {
      title: "Featured Projects",
      items: [
        {
          title: "Microsoft 365 Extension Development",
          techStack: "Microsoft Graph API, Teams SDK, Office JS",
          features: [
            "Microsoft Outlook Web Access (OWA) extension",
            "Teams tab app development and iframe integration",
            "User authentication and messaging functionality integration"
          ],
          icon: "🔗"
        },
        {
          title: "KT AICC Call Center System",
          techStack: "React, Supabase, Node.js",
          features: [
            "Real-time call functionality and meeting system",
            "Real-time data synchronization and state management",
            "Client-server distributed processing (Nginx)",
            "Call/meeting functionality between users and customers"
          ],
          icon: "📞"
        },
        {
          title: "Organization Chart & Reservation Management System",
          techStack: "TypeScript, Next.js, Kubernetes, HAProxy",
          features: [
            "Department-based hierarchical structure and role-based access control",
            "Microservice architecture-based deployment",
            "Real-time reservation system integration"
          ],
          icon: "🏢"
        },
        {
          title: "Network Security Monitoring System",
          techStack: "Wazuh, Palo Alto, Kubernetes",
          features: [
            "XDR, XSIAM-based log collection and analysis",
            "Real-time security event detection and response",
            "Kubernetes cluster security monitoring",
            "Load balancing and traffic analysis dashboard"
          ],
          icon: "🔒"
        }
      ]
    },
    learning: {
      title: "Currently Learning",
      items: [
        "Advanced cloud-native architecture",
        "Network security and cybersecurity",
        "Generative AI-powered development processes",
        "Enterprise-level system design"
      ]
    },
    about: {
      title: "About Me",
      content: [
        "I believe technology creates real value when it solves actual problems.",
        "I'm particularly interested in large-scale system design that considers security and stability,",
        "and I aspire to become a developer who creates services that truly improve users' lives."
      ],
      competencies: {
        title: "Core Competencies",
        items: [
          "Full-stack web development and real-time system development",
          "Cloud infrastructure design and container orchestration",
          "Network security and monitoring system development",
          "Enterprise-level system architecture design"
        ]
      }
    },
    links: {
      velog: "My Velog Blog",
      github: "GitHub"
    },
    stats: {
      title: "GitHub Stats"
    }
  },
  ko: {
    name: "홍진수",
    tagline: "안녕하세요! 홍진수입니다 👋",
    intro: "새로운 것을 배우고 창의적으로 적용하는 것을 좋아하는 개발자입니다. 주요 관심사는 백엔드 개발, 풀스택 웹 개발, 네트워크 보안, 클라우드 인프라, 그리고 사용자에게 의미 있는 서비스를 만드는 것입니다.",
    education: {
      title: "학력",
      school: "아주대학교 소프트웨어학과",
      period: "2021.03 ~ 현재"
    },
    techStack: {
      title: "기술 스택",
      categories: [
        {
          category: "언어",
          items: ["Java", "JavaScript", "TypeScript", "C", "C++"],
          badges: [
            "https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white",
            "https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black",
            "https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white",
            "https://img.shields.io/badge/C-00599C?style=for-the-badge&logo=c&logoColor=white",
            "https://img.shields.io/badge/C++-00599C?style=for-the-badge&logo=cplusplus&logoColor=white"
          ]
        },
        {
          category: "프론트엔드",
          items: ["React", "Next.js"],
          badges: [
            "https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black",
            "https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"
          ]
        },
        {
          category: "백엔드",
          items: ["Spring Boot", "ABP Framework", "Node.js"],
          badges: [
            "https://img.shields.io/badge/Spring Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white",
            "https://img.shields.io/badge/ABP Framework-3C5AFE?style=for-the-badge&logoColor=white",
            "https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"
          ]
        },
        {
          category: "데이터베이스",
          items: ["MySQL", "PostgreSQL", "Supabase"],
          badges: [
            "https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white",
            "https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white",
            "https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white"
          ]
        },
        {
          category: "클라우드 & DevOps",
          items: ["Docker", "Kubernetes", "Git"],
          badges: [
            "https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white",
            "https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white",
            "https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white"
          ]
        },
        {
          category: "보안 & 모니터링",
          items: ["Wazuh", "Palo Alto"],
          badges: [
            "https://img.shields.io/badge/Wazuh-0066CC?style=for-the-badge&logoColor=white",
            "https://img.shields.io/badge/Palo Alto-FF6600?style=for-the-badge&logoColor=white"
          ]
        },
        {
          category: "기타",
          items: ["Apache Kafka", "HAProxy", "Nginx"],
          badges: [
            "https://img.shields.io/badge/Apache Kafka-231F20?style=for-the-badge&logo=apachekafka&logoColor=white",
            "https://img.shields.io/badge/HAProxy-009639?style=for-the-badge&logoColor=white",
            "https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white"
          ]
        }
      ]
    },
    certifications: {
      title: "자격증",
      items: [
        "SQLD (SQL 개발자 자격증)"
      ]
    },
    internship: {
      title: "현장실습 경험 (26주)",
      period: "2024년 ~ 2025년 | 6개월간 현장실습",
      points: [
        "ABP 프레임워크 기반 풀스택 개발",
        "실시간 통신 시스템 구축 (Socket.io, Supabase)",
        "클라우드 네이티브 아키텍처 설계 및 구현",
        "네트워크 보안 SIEM 시스템 구축 (Palo Alto, Wazuh, XDR)",
        "마이크로서비스 및 컨테이너 오케스트레이션 (Kubernetes)",
        "CI/CD 파이프라인 구축 및 모니터링 시스템 구성"
      ]
    },
    projects: {
      title: "주요 프로젝트",
      items: [
        {
          title: "Microsoft 365 확장 개발",
          techStack: "Microsoft Graph API, Teams SDK, Office JS",
          features: [
            "Microsoft Outlook Web Access (OWA) 확장",
            "Teams 탭앱 개발 및 iframe 통합",
            "사용자 인증 및 메시징 기능 연동"
          ],
          icon: "🔗"
        },
        {
          title: "KT AICC 콜센터 시스템",
          techStack: "React, Supabase, Node.js",
          features: [
            "실시간 통화 기능 및 미팅 시스템",
            "실시간 데이터 동기화 및 상태 관리",
            "클라이언트-서버 분산 처리 (Nginx)",
            "사용자와 고객 간 통화/미팅 기능"
          ],
          icon: "📞"
        },
        {
          title: "조직도 & 예약 관리 시스템",
          techStack: "TypeScript, Next.js, Kubernetes, HAProxy",
          features: [
            "부서별 계층 구조 및 권한별 접근 제어",
            "마이크로서비스 아키텍처 기반 배포",
            "실시간 예약 시스템 통합"
          ],
          icon: "🏢"
        },
        {
          title: "네트워크 보안 모니터링 시스템",
          techStack: "Wazuh, Palo Alto, Kubernetes",
          features: [
            "XDR, XSIAM 기반 로그 수집 및 분석",
            "실시간 보안 이벤트 탐지 및 대응",
            "Kubernetes 클러스터 보안 모니터링",
            "로드밸런싱 및 트래픽 분석 대시보드"
          ],
          icon: "🔒"
        }
      ]
    },
    learning: {
      title: "현재 배우는 중",
      items: [
        "고급 클라우드 네이티브 아키텍처",
        "네트워크 보안 및 사이버 보안",
        "생성형 AI 활용 개발 프로세스",
        "엔터프라이즈급 시스템 설계"
      ]
    },
    about: {
      title: "About Me",
      content: [
        "기술은 실제 문제를 해결할 때 진정한 가치를 만든다고 믿습니다.",
        "특히 보안과 안정성을 고려한 대규모 시스템 설계에 관심이 많으며,",
        "사용자의 삶을 진정으로 개선하는 서비스를 만드는 개발자가 되고 싶습니다."
      ],
      competencies: {
        title: "핵심 역량",
        items: [
          "풀스택 웹 개발 및 실시간 시스템 구축",
          "클라우드 인프라 설계 및 컨테이너 오케스트레이션",
          "네트워크 보안 및 모니터링 시스템 구축",
          "엔터프라이즈급 시스템 아키텍처 설계"
        ]
      }
    },
    links: {
      velog: "나의 벨로그 블로그",
      github: "GitHub"
    },
    stats: {
      title: "GitHub 통계"
    }
  }
}

export default function AboutPage() {
  const [lang, setLang] = useState<Language>("ko")
  const t = content[lang]

  return (
    <div className="container py-10 max-w-5xl">
      <div className="space-y-8">
        {/* Language Toggle */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLang(lang === "ko" ? "en" : "ko")}
            aria-label={lang === "ko" ? "Switch to English" : "한국어로 전환"}
          >
            <Globe className="mr-2 h-4 w-4" />
            {lang === "ko" ? "English" : "한국어"}
          </Button>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">{t.tagline}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t.intro}
          </p>
        </div>

        {/* Education */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              {t.education.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="font-medium">{t.education.school}</p>
              <p className="text-muted-foreground text-sm">{t.education.period}</p>
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              {t.techStack.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {t.techStack.categories.map((category) => (
                <div key={category.category} className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    {category.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.badges.map((badge, index) => (
                      <Image 
                        key={index} 
                        src={badge} 
                        alt={category.items[index]}
                        width={112}
                        height={28}
                        className="h-7 w-auto"
                        unoptimized
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              {t.certifications.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {t.certifications.items.map((cert, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                  {cert}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Internship Experience */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              {t.internship.title}
            </CardTitle>
            <CardDescription>{t.internship.period}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {t.internship.points.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Featured Projects */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            {t.projects.title}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {t.projects.items.map((project, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-2xl">{project.icon}</span>
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    <strong>{lang === "ko" ? "기술 스택:" : "Tech Stack:"}</strong> {project.techStack}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    {project.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2">
                        <div className="h-1 w-1 bg-muted-foreground rounded-full mt-1.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Currently Learning */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {t.learning.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {t.learning.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                  {item}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* About Me */}
        <Card>
          <CardHeader>
            <CardTitle>{t.about.title}</CardTitle>
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

        {/* GitHub Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              {t.stats.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Image 
                src="https://github-readme-stats.vercel.app/api?username=kaameo&show_icons=true&theme=default&hide=issues&count_private=true" 
                alt="GitHub Stats"
                width={495}
                height={195}
                className="w-full rounded-lg"
                unoptimized
              />
              <Image 
                src="https://github-readme-stats.vercel.app/api/top-langs/?username=kaameo&layout=compact&theme=default" 
                alt="Top Languages"
                width={495}
                height={195}
                className="w-full rounded-lg"
                unoptimized
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}