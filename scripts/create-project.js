#!/usr/bin/env node

/**
 * 프로젝트 페이지 생성 스크립트
 *
 * 사용법:
 *   npm run new-project
 *   npm run new-project -- --category Web
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function getCurrentDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function toKebabCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

const defaultContent = `## 개요

[프로젝트의 목적, 해결하려는 문제, 만든 동기]

## 기술 스택

[사용한 기술 선택의 이유]

## 주요 기능

- [핵심 기능 1]
- [핵심 기능 2]
- [핵심 기능 3]

## 아키텍처

[전체 시스템 구조 설명]

\`\`\`mermaid
graph LR
    A[Client] --> B[Server] --> C[Database]
\`\`\`

## 구현 하이라이트

### [기능/문제]

[구현 방법과 인사이트]

\`\`\`tsx
// 코드 예제
\`\`\`

## 트러블슈팅

[개발 중 마주친 문제와 해결 방법]

## 회고

[배운 점, 개선할 점, 다음 단계]

## 링크

- 저장소: [GitHub URL]
- 데모: [Demo URL]
`

async function createProject() {
  console.log('\n📦 프로젝트 생성 스크립트\n')

  const args = process.argv.slice(2)
  let customCategory = null

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--category' && args[i + 1]) {
      customCategory = args[i + 1]
      i++
    }
  }

  const title = await question('📌 프로젝트 이름: ')
  if (!title.trim()) {
    console.log('❌ 이름은 필수입니다.')
    rl.close()
    return
  }

  const description = await question('📝 한 줄 설명: ')
  const category =
    customCategory || (await question('📂 카테고리 (예: Web, Mobile, Tool, 기본값 Web): ')) || 'Web'

  const stackInput = await question('🛠  기술 스택 (쉼표로 구분, 예: Next.js, TypeScript): ')
  const stack = stackInput.trim()
    ? stackInput.split(',').map((s) => s.trim()).filter(Boolean)
    : []

  const tagsInput = await question('🏷  태그 (쉼표로 구분, Enter로 건너뛰기): ')
  const tags = tagsInput.trim()
    ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  const period = await question('📅 진행 기간 (예: 2024.01 ~ 2024.06, Enter로 건너뛰기): ')

  const githubInput = await question('🔗 GitHub URL (Enter로 건너뛰기): ')
  const github = githubInput.trim() || null

  const demoInput = await question('🌐 Demo URL (Enter로 건너뛰기): ')
  const demo = demoInput.trim() || null

  const coverImageInput = await question(
    '🖼  커버 이미지 경로 (예: /images/projects/my-project.jpg, Enter로 건너뛰기): ',
  )
  const coverImage = coverImageInput.trim() || null

  const statusInput = await question('📊 상태 (active / completed / archived, Enter로 건너뛰기): ')
  const status = ['active', 'completed', 'archived'].includes(statusInput.trim())
    ? statusInput.trim()
    : null

  const folderInput = await question(
    '📁 저장 폴더 (content/projects/ 기준, 예: web, 또는 Enter로 루트): ',
  )

  const fileName = toKebabCase(title)

  let filePath
  if (folderInput.trim()) {
    const folderPath = folderInput.trim().replace(/^\/+|\/+$/g, '')
    filePath = path.join(process.cwd(), 'content', 'projects', folderPath, `${fileName}.mdx`)
  } else {
    filePath = path.join(process.cwd(), 'content', 'projects', `${fileName}.mdx`)
  }

  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`✅ 폴더 생성: ${dir}`)
  }

  const frontmatterLines = [
    '---',
    `title: "${title}"`,
    `date: "${getCurrentDate()}"`,
    `description: "${description || title}"`,
    `category: "${category}"`,
    'author: "Kaameo"',
  ]

  if (tags.length > 0) {
    frontmatterLines.push(`tags: [${tags.map((t) => `"${t}"`).join(', ')}]`)
  }
  if (stack.length > 0) {
    frontmatterLines.push(`stack: [${stack.map((s) => `"${s}"`).join(', ')}]`)
  }
  if (period.trim()) {
    frontmatterLines.push(`period: "${period.trim()}"`)
  }
  if (github) {
    frontmatterLines.push(`github: "${github}"`)
  }
  if (demo) {
    frontmatterLines.push(`demo: "${demo}"`)
  }
  if (coverImage) {
    frontmatterLines.push(`coverImage: "${coverImage}"`)
  }
  if (status) {
    frontmatterLines.push(`status: "${status}"`)
  }

  frontmatterLines.push('---')

  const fullContent = frontmatterLines.join('\n') + '\n\n' + defaultContent

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
    console.log('\n✅ 프로젝트가 생성되었습니다!')
    console.log(`📁 파일 경로: ${filePath}`)
    console.log(`🔗 URL 경로: /projects/${fileName}`)
    console.log('\n💡 다음 단계:')
    console.log('   1. 생성된 MDX 파일을 열어 내용을 작성하세요')
    console.log('   2. npm run dev 로 개발 서버를 실행하여 확인하세요\n')
  } catch (error) {
    console.error('❌ 파일 생성 중 오류 발생:', error.message)
  }

  rl.close()
}

createProject().catch((error) => {
  console.error('오류 발생:', error)
  rl.close()
})
