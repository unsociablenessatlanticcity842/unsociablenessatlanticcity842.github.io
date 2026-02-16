#!/usr/bin/env node

/**
 * 블로그 포스트 생성 스크립트
 *
 * 사용법:
 *   node scripts/create-post.js
 *   node scripts/create-post.js --template spring
 *   node scripts/create-post.js --template backend --category Backend
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// 템플릿 정의
const templates = {
  spring: {
    category: 'Spring',
    tags: ['Spring Boot', 'Java', 'Backend'],
    content: `## 개요

이 포스트에서는 Spring을 사용하여 [주제]를 구현하는 방법을 알아봅니다.

## 환경 설정

### 의존성 추가

\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
\`\`\`

## 핵심 개념

[핵심 개념 설명]

## 구현 예제

\`\`\`java
@RestController
@RequestMapping("/api")
public class ExampleController {
    // 구현 코드
}
\`\`\`

## 테스트

[테스트 방법 설명]

## 마무리

[요약 및 다음 단계]

## 참고 자료

- [Spring 공식 문서](https://spring.io/docs)
`,
  },
  backend: {
    category: 'Backend',
    tags: ['Backend', 'Server', 'API'],
    content: `## 개요

[주제 소개 및 포스트 작성 동기]

## 핵심 개념

[이론적 배경이나 핵심 개념 설명]

## 구현

### 환경 구성

[필요한 도구, 라이브러리 설치]

### 코드 작성

\`\`\`java
// 코드 예제
\`\`\`

### 실행 결과

[스크린샷이나 실행 결과]

## 정리

[핵심 내용 요약 및 다음 학습 방향]

## 참고 자료

- [참고 링크]
`,
  },
  algorithm: {
    category: 'Algorithm',
    tags: ['Algorithm', 'Problem Solving'],
    content: `## 문제 소개

> [문제 링크]

[문제 설명]

## 내가 푼 방식

[초기 접근 방법과 코드]

\`\`\`java
// 내 코드
\`\`\`

## 최적화된 풀이

[개선된 방법과 코드]

\`\`\`java
// 최적화된 코드
\`\`\`

## 코드 분석 및 개선점

### 내 코드의 문제점

1. [문제점 1]
2. [문제점 2]

### 최적화된 풀이의 장점

1. [장점 1]
2. [장점 2]

## 핵심 인사이트

[문제의 핵심 개념과 교훈]

## 배운 점

[이 문제를 통해 배운 내용]
`,
  },
  default: {
    category: 'General',
    tags: ['Blog', 'Development'],
    content: `## 들어가며

[주제 소개 및 포스트 작성 동기]

## 핵심 개념

[이론적 배경이나 핵심 개념 설명]

## 실습

### 환경 구성

[필요한 도구, 라이브러리 설치]

### 구현

\`\`\`javascript
// 코드 예제
\`\`\`

### 실행 결과

[스크린샷이나 실행 결과]

## 정리

[핵심 내용 요약 및 다음 학습 방향]

## 참고 자료

- [공식 문서 링크]
`,
  },
}

// 현재 날짜 (YYYY-MM-DD 형식)
function getCurrentDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// kebab-case 변환
function toKebabCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// 질문 함수
function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

// MDX 파일 생성
async function createPost() {
  console.log('\n📝 블로그 포스트 생성 스크립트\n')

  // 명령줄 인자 확인
  const args = process.argv.slice(2)
  let templateName = 'default'
  let customCategory = null

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--template' && args[i + 1]) {
      templateName = args[i + 1]
      i++
    }
    if (args[i] === '--category' && args[i + 1]) {
      customCategory = args[i + 1]
      i++
    }
  }

  // 템플릿 확인
  if (!templates[templateName]) {
    console.log(`❌ 템플릿을 찾을 수 없습니다: ${templateName}`)
    console.log(`사용 가능한 템플릿: ${Object.keys(templates).join(', ')}\n`)
    rl.close()
    return
  }

  const template = templates[templateName]

  // 사용자 입력 받기
  const title = await question('📌 포스트 제목: ')
  if (!title.trim()) {
    console.log('❌ 제목은 필수입니다.')
    rl.close()
    return
  }

  const description = await question('📝 포스트 설명 (excerpt): ')
  const category = customCategory || template.category
  const tagsInput = await question(`🏷️  태그 (쉼표로 구분, 기본값: ${template.tags.join(', ')}): `)
  const tags = tagsInput.trim() ? tagsInput.split(',').map((tag) => tag.trim()) : template.tags

  // 저장 위치 입력 받기
  const folderInput = await question(
    '📁 저장 폴더 (content/posts/ 기준, 예: backend/spring, 또는 Enter로 루트): ',
  )

  // 파일명 생성
  const fileName = toKebabCase(title)

  // 파일 경로 생성
  let filePath
  if (folderInput.trim()) {
    // 폴더 경로가 입력된 경우
    const folderPath = folderInput.trim().replace(/^\/+|\/+$/g, '') // 앞뒤 슬래시 제거
    filePath = path.join(process.cwd(), 'content', 'posts', folderPath, `${fileName}.mdx`)
  } else {
    // 입력 없으면 content/posts/ 루트에 생성
    filePath = path.join(process.cwd(), 'content', 'posts', `${fileName}.mdx`)
  }

  // 폴더가 없으면 생성
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`✅ 폴더 생성: ${dir}`)
  }

  // Frontmatter 생성
  const frontmatter = `---
title: "${title}"
date: "${getCurrentDate()}"
description: "${description || title}"
category: "${category}"
tags: [${tags.map((tag) => `"${tag}"`).join(', ')}]
author: "Kaameo"
---
`

  // 전체 내용 생성
  const fullContent = frontmatter + '\n' + template.content

  // 파일 쓰기
  try {
    if (fs.existsSync(filePath)) {
      const overwrite = await question('⚠️  파일이 이미 존재합니다. 덮어쓰시겠습니까? (y/N): ')
      if (overwrite.toLowerCase() !== 'y') {
        console.log('❌ 취소되었습니다.')
        rl.close()
        return
      }
    }

    fs.writeFileSync(filePath, fullContent, 'utf8')
    console.log('\n✅ 포스트가 생성되었습니다!')
    console.log(`📁 파일 경로: ${filePath}`)
    console.log(`🔗 URL 경로: /posts/${fileName}`)
    console.log('\n💡 다음 단계:')
    console.log('   1. 생성된 MDX 파일을 열어 내용을 작성하세요')
    console.log('   2. npm run dev 로 개발 서버를 실행하여 확인하세요')
    console.log('   3. 작성이 완료되면 git commit 후 배포하세요\n')
  } catch (error) {
    console.error('❌ 파일 생성 중 오류 발생:', error.message)
  }

  rl.close()
}

// 스크립트 실행
createPost().catch((error) => {
  console.error('오류 발생:', error)
  rl.close()
})
