import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import type { WeddingsFile, WeddingMeta } from '@/types';

async function readWeddingsFile(): Promise<WeddingsFile> {
  const filePath = path.join(process.cwd(), 'src', 'data', 'weddings.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

export async function GET() {
  try {
    const data = await readWeddingsFile();
    const safe = data.weddings.map(({ id, brideName, groomName, weddingDate }: WeddingMeta) => ({
      id, brideName, groomName, weddingDate,
    }));
    return NextResponse.json({ weddings: safe });
  } catch {
    return NextResponse.json({ error: 'Failed to read weddings' }, { status: 500 });
  }
}
