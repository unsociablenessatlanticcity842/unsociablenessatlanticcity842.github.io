# 🚀 블로그 포스트 작성 빠른 가이드

## 1️⃣ 새 포스트 만들기 (30초)

```bash
# 1. 포스트 파일 생성
touch content/posts/my-new-post.mdx

# 2. 아래 템플릿 복사 & 붙여넣기
```

```markdown
---
title: "포스트 제목"
date: "2024-01-27"
excerpt: "한 줄 요약"
category: "Spring"  # 또는 "Apache Kafka", "Frontend" 등
tags: ["태그1", "태그2", "태그3"]
author: "Kaameo"
---

여기에 내용을 작성하세요...
```

## 2️⃣ 카테고리 추가하기

**새 카테고리는 자동으로 생성됩니다!** 
포스트의 `category` 필드에 원하는 카테고리명을 입력하기만 하면 됩니다.

### 예시: Spring 카테고리 추가
```markdown
category: "Spring"
```

### 예시: Apache Kafka 카테고리 추가  
```markdown
category: "Apache Kafka"
```

### 예시: DevOps 카테고리 추가
```markdown
category: "DevOps"
```

## 3️⃣ 확인하기

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

## 📁 파일 구조

```
content/posts/
├── hello-world.mdx          # 기존 포스트
├── typescript-tips.mdx      # 기존 포스트
├── spring-boot-getting-started.mdx    # Spring 카테고리
└── apache-kafka-introduction.mdx      # Apache Kafka 카테고리
```

## 🏷️ 추천 카테고리

- **Spring** - Spring Framework 관련
- **Apache Kafka** - Kafka 및 이벤트 스트리밍
- **Frontend** - React, Next.js, UI/UX
- **Backend** - 서버, API, 데이터베이스
- **DevOps** - Docker, K8s, CI/CD
- **Database** - SQL, NoSQL, 데이터 모델링
- **Architecture** - 시스템 설계, 패턴
- **Career** - 개발자 성장, 회고

## ✅ 체크리스트

- [ ] 파일명은 `kebab-case.mdx` 형식
- [ ] 날짜는 `YYYY-MM-DD` 형식
- [ ] 카테고리는 일관된 이름 사용
- [ ] 태그는 3-5개 정도
- [ ] 코드 블록에 언어 명시

## 💡 팁

1. **이미지 추가**: `![설명](/images/posts/my-post/image.png)`
2. **코드 하이라이팅**: ` ```javascript ` 처럼 언어 명시
3. **링크**: `[텍스트](URL)` 형식 사용

---

**더 자세한 내용은 [BLOG_CONTENT_GUIDE.md](./BLOG_CONTENT_GUIDE.md) 참고!**