/**
 * Sanity Export Script
 * Exports Sanity content with images to a backup file.
 * Optionally uploads to S3.
 *
 * Usage:
 *   npm run sanity:export           # Export to local file
 *   npm run sanity:export -- --s3   # Export and upload to S3
 *
 * Required env vars:
 *   PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, SANITY_API_TOKEN
 *
 * Optional for S3:
 *   AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, BACKUP_S3_BUCKET, AWS_REGION, S3_PREFIX
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, unlinkSync } from 'fs';
import { join } from 'path';

const BACKUP_DIR = './backups';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

// Load environment variables
const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error('❌ Missing required environment variables: PUBLIC_SANITY_PROJECT_ID, SANITY_API_TOKEN');
  process.exit(1);
}

// Create backup directory
if (!existsSync(BACKUP_DIR)) {
  mkdirSync(BACKUP_DIR, { recursive: true });
}

const filename = `sanity-export-${dataset}-${timestamp}.tar.gz`;
const filepath = join(BACKUP_DIR, filename);

console.log(`📦 Exporting Sanity dataset: ${dataset}\n`);

try {
  // Run Sanity export
  execSync(`npx sanity dataset export ${dataset} ${filepath} --project ${projectId} --token ${token}`, {
    stdio: 'inherit',
  });

  console.log(`\n✅ Export completed: ${filepath}\n`);

  // Check if we should upload to S3
  const uploadToS3 = process.argv.includes('--s3');

  if (uploadToS3) {
    const s3Bucket = process.env.BACKUP_S3_BUCKET;
    const s3Region = process.env.AWS_REGION || 'us-east-1';
    const s3Prefix = process.env.S3_PREFIX || 'sanity-backups/';

    if (!s3Bucket) {
      console.error('❌ BACKUP_S3_BUCKET environment variable is required for S3 upload');
      process.exit(1);
    }

    const s3Key = `${s3Prefix}${filename}`;

    console.log(`☁️  Uploading to S3: s3://${s3Bucket}/${s3Key}\n`);

    try {
      execSync(`aws s3 cp ${filepath} s3://${s3Bucket}/${s3Key} --region ${s3Region}`, { stdio: 'inherit' });

      console.log(`\n✅ Uploaded to S3 successfully\n`);

      // Optionally delete local file after S3 upload
      if (process.argv.includes('--delete-local')) {
        unlinkSync(filepath);
        console.log(`🗑️  Local file deleted: ${filepath}\n`);
      }
    } catch (s3Error) {
      console.error(`\n❌ S3 upload failed. Local backup preserved at: ${filepath}`);
      process.exit(1);
    }
  }

  // List recent backups
  console.log('📁 Recent local backups:');
  execSync(`ls -lh ${BACKUP_DIR}/*.tar.gz 2>/dev/null | tail -5 || echo "  No backups found"`, {
    stdio: 'inherit',
  });
} catch (error) {
  console.error('\n❌ Export failed:', error);
  process.exit(1);
}
