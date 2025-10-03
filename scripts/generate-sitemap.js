const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://kaameo.github.io';

// Get all MDX files from content/posts
function getAllPosts(dir) {
  const posts = [];

  function scanDirectory(currentPath) {
    const items = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(currentPath, item.name);

      if (item.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.isFile() && item.name.endsWith('.mdx')) {
        // Extract slug from filename (remove .mdx extension)
        const slug = item.name.replace(/\.mdx$/, '');

        // Get file stats for lastmod date
        const stats = fs.statSync(fullPath);

        posts.push({
          slug,
          lastmod: stats.mtime.toISOString(),
        });
      }
    }
  }

  scanDirectory(dir);
  return posts;
}

// Get categories and tags
function getCategoriesAndTags() {
  const contentDir = path.join(process.cwd(), 'content/posts');
  const categories = new Set();
  const tags = new Set();

  function scanDirectory(currentPath) {
    const items = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(currentPath, item.name);

      if (item.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.isFile() && item.name.endsWith('.mdx')) {
        const content = fs.readFileSync(fullPath, 'utf-8');

        // Extract frontmatter
        const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1];

          // Extract category
          const categoryMatch = frontmatter.match(/category:\s*["']?([^"'\n]+)["']?/);
          if (categoryMatch) {
            categories.add(categoryMatch[1].trim());
          }

          // Extract tags
          const tagsMatch = frontmatter.match(/tags:\s*\[([^\]]+)\]/);
          if (tagsMatch) {
            const tagList = tagsMatch[1].split(',').map(t => t.trim().replace(/["']/g, ''));
            tagList.forEach(tag => tags.add(tag));
          }
        }
      }
    }
  }

  scanDirectory(contentDir);
  return { categories: Array.from(categories), tags: Array.from(tags) };
}

function generateSitemap() {
  const contentDir = path.join(process.cwd(), 'content/posts');
  const posts = getAllPosts(contentDir);
  const { categories, tags } = getCategoriesAndTags();

  const urls = [];

  // Homepage
  urls.push({
    loc: `${SITE_URL}/`,
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: '1.0',
  });

  // Posts page
  urls.push({
    loc: `${SITE_URL}/posts/`,
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: '0.9',
  });

  // Individual posts
  posts.forEach(post => {
    urls.push({
      loc: `${SITE_URL}/posts/${post.slug}/`,
      lastmod: post.lastmod,
      changefreq: 'weekly',
      priority: '0.8',
    });
  });

  // Category pages
  categories.forEach(category => {
    const slug = encodeURIComponent(category);
    urls.push({
      loc: `${SITE_URL}/categories/${slug}/`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.7',
    });
  });

  // Tag pages
  tags.forEach(tag => {
    const slug = encodeURIComponent(tag);
    urls.push({
      loc: `${SITE_URL}/tags/${slug}/`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.6',
    });
  });

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Write to public directory
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
  console.log(`✅ Sitemap generated with ${urls.length} URLs`);
}

generateSitemap();
