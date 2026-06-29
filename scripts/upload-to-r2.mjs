/**
 * Seeds the Cloudflare R2 bucket with the local JSON data files.
 * Run once: node scripts/upload-to-r2.mjs
 * Requires R2_ENDPOINT, R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY in .env.local
 */
import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { config } from 'dotenv';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local
config({ path: path.join(__dirname, '../.env.local') });

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.R2_BUCKET;
const DATA_DIR = path.join(__dirname, '../src/data');

async function upload(key, content) {
  await client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: content,
    ContentType: 'application/json',
  }));
  console.log(`  ✓ ${key}`);
}

async function main() {
  console.log(`\nUploading to R2 bucket: ${BUCKET}\n`);

  // Upload weddings.json
  const weddingsJson = readFileSync(path.join(DATA_DIR, 'weddings.json'), 'utf-8');
  await upload('weddings.json', weddingsJson);

  // Upload each per-wedding file
  const weddingsDir = path.join(DATA_DIR, 'weddings');
  const files = readdirSync(weddingsDir).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const content = readFileSync(path.join(weddingsDir, file), 'utf-8');
    await upload(`weddings/${file}`, content);
  }

  console.log('\nDone! All files uploaded to R2.');
}

main().catch(err => { console.error(err); process.exit(1); });
