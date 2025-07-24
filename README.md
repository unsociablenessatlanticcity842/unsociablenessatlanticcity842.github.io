# Kaameo Dev Blog

Next.js와 shadcn/ui를 사용하여 구축한 개발 블로그입니다.

## 🚀 기능

- 📝 MDX를 사용한 블로그 포스트 작성
- 🎨 shadcn/ui 컴포넌트 시스템
- 🌙 다크 모드 지원
- 📱 반응형 디자인
- 🏷️ 태그 및 카테고리 시스템
- 🔍 SEO 최적화
- ⚡ GitHub Pages 자동 배포

## 🛠️ 기술 스택

- **Framework**: Next.js 14
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

# 빌드
npm run build

# 정적 파일 생성
npm run export
```

## 📝 포스트 작성

`content/posts` 디렉토리에 `.mdx` 파일을 생성하여 새로운 포스트를 작성할 수 있습니다.

```mdx
---
title: "포스트 제목"
date: "2024-01-15"
excerpt: "포스트 요약"
category: "카테고리"
tags: ["태그1", "태그2"]
author: "작성자"
---

포스트 내용...
```

## 🚀 배포

main 브랜치에 push하면 GitHub Actions를 통해 자동으로 GitHub Pages에 배포됩니다.

## 📄 라이센스

MIT License