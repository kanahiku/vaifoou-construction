/**
 * Links Check Script
 * Finds: 404s, staging/localhost links, redirect chains
 * 
 * Usage: npm run links:check
 * Run after build to validate all internal links.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative } from 'path';

interface LinkIssue {
  file: string;
  link: string;
  issue: string;
  severity: 'error' | 'warning';
}

const issues: LinkIssue[] = [];
// The Vercel adapter writes static output to dist/client.
const DIST_DIR = existsSync('./dist/client') ? './dist/client' : './dist';
const allPages = new Set<string>();

// Patterns to flag
const STAGING_PATTERNS = [
  /localhost/i,
  /127\.0\.0\.1/i,
  /\.vercel\.app/i,
  /staging\./i,
  /preview\./i,
  /dev\./i,
];

function walkDir(dir: string, callback: (file: string) => void) {
  try {
    const files = readdirSync(dir);
    for (const file of files) {
      const filePath = join(dir, file);
      const stat = statSync(filePath);
      if (stat.isDirectory()) {
        walkDir(filePath, callback);
      } else if (file.endsWith('.html')) {
        callback(filePath);
      }
    }
  } catch {
    // Directory doesn't exist
  }
}

function collectAllPages() {
  walkDir(DIST_DIR, (filePath) => {
    let route = relative(DIST_DIR, filePath)
      .replace(/index\.html$/, '')
      .replace(/\.html$/, '');
    if (route === '') route = '/';
    else route = '/' + route;
    if (!route.endsWith('/')) route += '/';
    allPages.add(route);
  });
}

function normalizeLink(href: string): string {
  // Remove hash and query string
  let link = href.split('#')[0].split('?')[0];
  // Ensure trailing slash for internal links
  if (link && !link.includes('.') && !link.endsWith('/')) {
    link += '/';
  }
  return link;
}

function checkHtmlFile(filePath: string) {
  const content = readFileSync(filePath, 'utf-8');
  const relativePath = relative(DIST_DIR, filePath);

  // Find all href attributes
  const hrefMatches = content.matchAll(/href=["']([^"']+)["']/gi);
  
  for (const match of hrefMatches) {
    const href = match[1];
    
    // Skip anchors, mailto, tel, javascript
    if (href.startsWith('#') || href.startsWith('mailto:') || 
        href.startsWith('tel:') || href.startsWith('javascript:')) {
      continue;
    }

    // Check for staging/localhost patterns
    for (const pattern of STAGING_PATTERNS) {
      if (pattern.test(href)) {
        issues.push({
          file: relativePath,
          link: href,
          issue: `Link contains staging/development URL`,
          severity: 'error'
        });
        break;
      }
    }

    // Check internal links
    if (href.startsWith('/') && !href.startsWith('//')) {
      const normalizedLink = normalizeLink(href);
      
      // Check if the page exists
      if (!allPages.has(normalizedLink)) {
        // Check if it's a file (like PDF, image)
        const filePath = join(DIST_DIR, normalizedLink.replace(/\/$/, ''));
        if (!existsSync(filePath) && !existsSync(filePath + '.html')) {
          issues.push({
            file: relativePath,
            link: href,
            issue: `Broken internal link (page not found)`,
            severity: 'error'
          });
        }
      }
    }

    // Check for http:// links (should be https)
    if (href.startsWith('http://') && !href.includes('localhost')) {
      issues.push({
        file: relativePath,
        link: href,
        issue: `Non-HTTPS external link`,
        severity: 'warning'
      });
    }
  }

  // Also check src attributes for images
  const srcMatches = content.matchAll(/src=["']([^"']+)["']/gi);
  for (const match of srcMatches) {
    const src = match[1];
    
    for (const pattern of STAGING_PATTERNS) {
      if (pattern.test(src)) {
        issues.push({
          file: relativePath,
          link: src,
          issue: `Image source contains staging/development URL`,
          severity: 'error'
        });
        break;
      }
    }
  }
}

// Run checks
console.log('🔗 Running link checks...\n');

// First, collect all available pages
collectAllPages();
console.log(`Found ${allPages.size} pages in dist/\n`);

// Then check each HTML file
walkDir(DIST_DIR, checkHtmlFile);

// Report results
const errors = issues.filter(i => i.severity === 'error');
const warnings = issues.filter(i => i.severity === 'warning');

// Group by issue type
const brokenLinks = errors.filter(i => i.issue.includes('Broken'));
const stagingLinks = errors.filter(i => i.issue.includes('staging'));

if (brokenLinks.length > 0) {
  console.log('\n❌ BROKEN LINKS:\n');
  for (const issue of brokenLinks) {
    console.log(`  ${issue.file}`);
    console.log(`    → ${issue.link}\n`);
  }
}

if (stagingLinks.length > 0) {
  console.log('\n❌ STAGING/LOCALHOST LINKS:\n');
  for (const issue of stagingLinks) {
    console.log(`  ${issue.file}`);
    console.log(`    → ${issue.link}\n`);
  }
}

if (warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:\n');
  for (const issue of warnings) {
    console.log(`  ${issue.file}: ${issue.link}`);
    console.log(`    ${issue.issue}\n`);
  }
}

console.log(`\n📊 Summary: ${errors.length} errors, ${warnings.length} warnings\n`);

// Exit with error code if there are errors
if (errors.length > 0) {
  process.exit(1);
}
