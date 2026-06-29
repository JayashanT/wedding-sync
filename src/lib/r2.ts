import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

const client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET!;

/** Read a JSON file from R2. Returns null if the key does not exist. */
export async function r2Get(key: string): Promise<string | null> {
  try {
    const res = await client.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
    if (!res.Body) return null;
    // transformToString() is provided by the AWS SDK stream mixin
    return await (res.Body as { transformToString(): Promise<string> }).transformToString();
  } catch (err: unknown) {
    const code = (err as { Code?: string; name?: string }).Code ?? (err as { name?: string }).name;
    if (code === 'NoSuchKey' || code === 'NotFound') return null;
    throw err;
  }
}

/** Write a JSON string to R2. */
export async function r2Put(key: string, data: string): Promise<void> {
  await client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: data,
    ContentType: 'application/json',
  }));
}

/** Delete a key from R2. Silently ignores missing keys. */
export async function r2Delete(key: string): Promise<void> {
  try {
    await client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  } catch (err: unknown) {
    const code = (err as { Code?: string; name?: string }).Code ?? (err as { name?: string }).name;
    if (code === 'NoSuchKey' || code === 'NotFound') return;
    throw err;
  }
}

/** Convenience: parse JSON from R2, returns null if key missing. */
export async function r2GetJson<T>(key: string): Promise<T | null> {
  const raw = await r2Get(key);
  if (raw === null) return null;
  return JSON.parse(raw) as T;
}

/** Convenience: stringify and write JSON to R2. */
export async function r2PutJson(key: string, data: unknown): Promise<void> {
  await r2Put(key, JSON.stringify(data, null, 2));
}

// Key helpers — single source of truth for R2 object paths
export const R2_KEYS = {
  weddings: () => 'weddings.json',
  wedding: (id: string) => `weddings/${id}.json`,
};
