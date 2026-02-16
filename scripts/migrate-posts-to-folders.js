#!/usr/bin/env node

/**
 * Migration script to organize MDX posts into category folders
 * This script will:
 * 1. Read all MDX files in content/posts/
 * 2. Extract categories from frontmatter
 * 3. Create category folders
 * 4. Move posts to appropriate folders
 * 5. Keep a backup of the original structure
 */

const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const POSTS_DIR = path.join(process.cwd(), 'content/posts')
const BACKUP_DIR = path.join(process.cwd(), 'content/posts-backup')

// Category mapping for organizing posts
const CATEGORY_MAPPING = {
  DevOps: 'devops',
  Frontend: 'frontend',
  Backend: 'backend',
  Spring: 'backend/spring',
  'Apache Kafka': 'data/kafka',
  Algorithm: 'algorithm',
  // Add more mappings as needed
}

// Special handling for series
const SERIES_MAPPING = {
  docker: 'devops/docker',
  kubernetes: 'devops/kubernetes',
}

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    console.log(`✅ Created directory: ${dirPath}`)
  }
}

function getTargetFolder(fileName, category) {
  // Check if it's part of a series based on filename
  for (const [prefix, folder] of Object.entries(SERIES_MAPPING)) {
    if (fileName.toLowerCase().startsWith(prefix)) {
      return folder
    }
  }

  // Use category mapping
  if (category && CATEGORY_MAPPING[category]) {
    return CATEGORY_MAPPING[category]
  }

  // Default to lowercase category or uncategorized
  if (category) {
    return category.toLowerCase().replace(/\s+/g, '-')
  }

  return 'uncategorized'
}

async function migratePost(filePath, dryRun = false) {
  const fileName = path.basename(filePath)

  // Skip if it's not an MDX file
  if (!fileName.endsWith('.mdx')) {
    return null
  }

  // Read file content to extract category
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const { data } = matter(fileContent)
  const category = data.category

  // Determine target folder
  const targetFolder = getTargetFolder(fileName.replace('.mdx', ''), category)
  const targetDir = path.join(POSTS_DIR, targetFolder)
  const targetPath = path.join(targetDir, fileName)

  // Skip if already in a subfolder
  const relativePath = path.relative(POSTS_DIR, filePath)
  if (relativePath.includes(path.sep)) {
    console.log(`⏭️  Skipping ${fileName} (already in folder)`)
    return null
  }

  // Skip if source and target are the same
  if (filePath === targetPath) {
    console.log(`⏭️  Skipping ${fileName} (already in correct location)`)
    return null
  }

  if (dryRun) {
    console.log(`📋 Would move: ${fileName} → ${targetFolder}/${fileName}`)
  } else {
    // Ensure target directory exists
    ensureDirectoryExists(targetDir)

    // Move the file
    fs.renameSync(filePath, targetPath)
    console.log(`✅ Moved: ${fileName} → ${targetFolder}/${fileName}`)
  }

  return { fileName, targetFolder }
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const backup = args.includes('--backup')

  console.log('🚀 Starting post migration...')
  if (dryRun) {
    console.log('📋 DRY RUN MODE - No files will be moved')
  }

  // Create backup if requested
  if (backup && !dryRun) {
    console.log('📦 Creating backup...')
    if (fs.existsSync(BACKUP_DIR)) {
      console.log('❌ Backup directory already exists. Please remove it first.')
      process.exit(1)
    }

    // Copy entire posts directory to backup
    fs.cpSync(POSTS_DIR, BACKUP_DIR, { recursive: true })
    console.log(`✅ Backup created at: ${BACKUP_DIR}`)
  }

  // Get all files in posts directory (only at root level)
  const files = fs
    .readdirSync(POSTS_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => path.join(POSTS_DIR, dirent.name))

  console.log(`📁 Found ${files.length} files to process`)

  // Create necessary directories first (in dry-run, just log them)
  const categories = new Set()
  for (const filePath of files) {
    if (filePath.endsWith('.mdx')) {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContent)
      const fileName = path.basename(filePath).replace('.mdx', '')
      const targetFolder = getTargetFolder(fileName, data.category)
      categories.add(targetFolder)
    }
  }

  console.log('\n📂 Directory structure to be created:')
  for (const category of Array.from(categories).sort()) {
    console.log(`  └── ${category}/`)
    if (!dryRun) {
      ensureDirectoryExists(path.join(POSTS_DIR, category))
    }
  }

  // Process each file
  console.log('\n📝 Processing posts:')
  let movedCount = 0
  let skippedCount = 0

  for (const filePath of files) {
    const result = await migratePost(filePath, dryRun)
    if (result) {
      movedCount++
    } else {
      skippedCount++
    }
  }

  // Summary
  console.log('\n📊 Migration Summary:')
  console.log(`  ✅ Posts to be moved: ${movedCount}`)
  console.log(`  ⏭️  Posts skipped: ${skippedCount}`)

  if (dryRun) {
    console.log('\n💡 Run without --dry-run to actually move the files')
    console.log('💡 Use --backup to create a backup before migration')
  } else {
    console.log('\n✨ Migration completed successfully!')
    if (backup) {
      console.log(`📦 Backup available at: ${BACKUP_DIR}`)
      console.log('💡 To restore: rm -rf content/posts && mv content/posts-backup content/posts')
    }
  }
}

// Run the migration
main().catch((error) => {
  console.error('❌ Migration failed:', error)
  process.exit(1)
})
