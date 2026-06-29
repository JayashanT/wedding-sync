import { NextResponse } from 'next/server';
import { r2GetJson, r2PutJson, R2_KEYS } from '@/lib/r2';
import type { WeddingData, WeddingsFile } from '@/types';

async function getWeddingDate(weddingId: string): Promise<string | null> {
  const data = await r2GetJson<WeddingsFile>(R2_KEYS.weddings());
  return data?.weddings.find(w => w.id === weddingId)?.weddingDate ?? null;
}

export async function GET(_req: Request, { params }: { params: Promise<{ weddingId: string }> }) {
  try {
    const { weddingId } = await params;
    const [data, weddingDate] = await Promise.all([
      r2GetJson<WeddingData>(R2_KEYS.wedding(weddingId)),
      getWeddingDate(weddingId),
    ]);
    if (!data) return NextResponse.json({ error: 'Wedding not found' }, { status: 404 });
    return NextResponse.json({ ...data, weddingDate: weddingDate ?? data.weddingDate ?? null });
  } catch {
    return NextResponse.json({ error: 'Wedding not found' }, { status: 404 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ weddingId: string }> }) {
  try {
    const { weddingId } = await params;
    const body = await req.json();

    const data = await r2GetJson<WeddingData>(R2_KEYS.wedding(weddingId));
    if (!data) return NextResponse.json({ error: 'Wedding not found' }, { status: 404 });

    if (body.roles !== undefined) {
      if (!Array.isArray(body.roles) || body.roles.length > 5) {
        return NextResponse.json({ error: 'Invalid roles' }, { status: 400 });
      }
      data.roles = body.roles;
    }

    await r2PutJson(R2_KEYS.wedding(weddingId), data);
    const weddingDate = await getWeddingDate(weddingId);
    return NextResponse.json({ ...data, weddingDate });
  } catch {
    return NextResponse.json({ error: 'Failed to update wedding' }, { status: 500 });
  }
}
