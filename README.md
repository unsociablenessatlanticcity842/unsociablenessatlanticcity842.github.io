# Kaameo Dev Blog

Next.js와 shadcn/ui를 사용하여 구축한 개발 블로그입니다.

## 🚀 기능

- 📝 MDX를 사용한 블로그 포스트 작성
- 🎨 shadcn/ui 컴포넌트 시스템
- 🌙 다크 모드 지원
- 📱 반응형 디자인
- 🏷️ 태그 및 카테고리 시스템
- 🔍 SEO 최적화 (구조화 데이터: BlogPosting, BreadcrumbList, WebSite)
- ⚡ GitHub Pages 자동 배포
- 💬 Giscus 댓글 시스템
- 📊 Core Web Vitals GA4 보고
- 📈 Mermaid 다이어그램 지원
- 📚 시리즈 포스트 지원

## 🛠️ 기술 스택

- **Framework**: Next.js 16.1.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Content**: MDX
- **Deployment**: GitHub Pages

## 📦 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드 (정적 파일 생성 포함)
npm run build

# 린트
npm run lint

# 코드 포맷팅
npm run format

# 포맷팅 검사
npm run format:check

# 새 포스트 생성
npm run new-post
```

## 📝 포스트 작성

`content/posts` 디렉토리에 `.mdx` 파일을 생성하여 새로운 포스트를 작성할 수 있습니다.

```mdx
---
title: "포스트 제목"
date: "2025-03-15"
description: "포스트 요약"
category: "카테고리"
tags: ["태그1", "태그2"]
author: "작성자"
coverImage: "/images/cover.jpg"
series: "시리즈 이름"
seriesOrder: 1
---

포스트 내용...
```

### Frontmatter 필드

| 필드 | 필수 | 설명 |
|------|------|------|
| `title` | ✅ | 포스트 제목 |
| `date` | ✅ | 작성일 (YYYY-MM-DD) |
| `description` | ✅ | 포스트 요약 |
| `tags` | | 태그 배열 |
| `category` | | 카테고리 |
| `author` | | 작성자 |
| `coverImage` | | 커버 이미지 경로 |
| `series` | | 시리즈 이름 |
| `seriesOrder` | | 시리즈 내 순서 (숫자) |

## ⚙️ 환경변수 설정

`.env.example`을 `.env.local`로 복사하고 값을 설정합니다.

```bash
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=

# Google AdSense
NEXT_PUBLIC_ADSENSE_CLIENT_ID=
NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=

# Giscus Comments
NEXT_PUBLIC_GISCUS_REPO=
NEXT_PUBLIC_GISCUS_REPO_ID=
NEXT_PUBLIC_GISCUS_CATEGORY=
NEXT_PUBLIC_GISCUS_CATEGORY_ID=
```

## 🚀 배포

main 브랜치에 push하면 GitHub Actions를 통해 자동으로 GitHub Pages에 배포됩니다.

## 📄 라이센스

MIT License
