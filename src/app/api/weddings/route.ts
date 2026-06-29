import { NextResponse } from 'next/server';
import { r2GetJson, R2_KEYS } from '@/lib/r2';
import type { WeddingsFile, WeddingMeta } from '@/types';

export async function GET() {
  try {
    const data = await r2GetJson<WeddingsFile>(R2_KEYS.weddings());
    if (!data) return NextResponse.json({ weddings: [] });
    const safe = data.weddings.map(({ id, brideName, groomName, weddingDate }: WeddingMeta) => ({
      id, brideName, groomName, weddingDate,
    }));
    return NextResponse.json({ weddings: safe });
  } catch {
    return NextResponse.json({ error: 'Failed to read weddings' }, { status: 500 });
  }
}
