import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

// Load extra env files for build time
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.dev.vars') });

/**
 * This script is intended to be run during the build process to ensure
 * the blog data is available locally even if the R2 binding isn't active.
 * This avoids bundling the S3 SDK into the Cloudflare Worker.
 */
async function syncBlogData() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME || 'vialacteasuenoylactancia';

  if (!accountId || !accessKeyId || !secretAccessKey) {
    console.log('Skipping R2 sync: Missing credentials in environment.');
    return;
  }

  console.log('Syncing blog data from R2 for build...');
  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  try {
    const response = await s3.send(new GetObjectCommand({ Bucket: bucketName, Key: 'blog_posts.json' }));
    const body = await response.Body?.transformToString();
    if (body) {
      const dataDir = path.join(process.cwd(), 'src/data');
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      
      const localPath = path.join(dataDir, 'blog_posts_merged.json');
      fs.writeFileSync(localPath, body);
      console.log(`Successfully synced blog data to ${localPath}`);
    }
  } catch (error) {
    console.error('Error syncing from R2:', error);
  }
}

syncBlogData();
