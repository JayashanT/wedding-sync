import { NextResponse } from 'next/server';
import { r2GetJson, r2PutJson, R2_KEYS } from '@/lib/r2';
import type { WeddingData } from '@/types';
import { sortScheduleByTime } from '@/lib/schedule';

type Params = { params: Promise<{ weddingId: string; itemId: string }> };

export async function PUT(req: Request, { params }: Params) {
  try {
    const { weddingId, itemId } = await params;
    const body = await req.json();

    const data = await r2GetJson<WeddingData>(R2_KEYS.wedding(weddingId));
    if (!data) return NextResponse.json({ error: 'Wedding not found' }, { status: 404 });

    const idx = data.schedule.findIndex(item => item.id === itemId);
    if (idx === -1) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    if (Array.isArray(body.responsiblePersons) && body.responsiblePersons.length > 5) {
      return NextResponse.json({ error: 'Max 5 responsible persons' }, { status: 400 });
    }

    data.schedule[idx] = { ...data.schedule[idx], ...body, id: itemId };
    data.schedule = sortScheduleByTime(data.schedule);

    await r2PutJson(R2_KEYS.wedding(weddingId), data);
    return NextResponse.json({ data: data.schedule.find(i => i.id === itemId) });
  } catch {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { weddingId, itemId } = await params;

    const data = await r2GetJson<WeddingData>(R2_KEYS.wedding(weddingId));
    if (!data) return NextResponse.json({ error: 'Wedding not found' }, { status: 404 });

    const originalLen = data.schedule.length;
    data.schedule = data.schedule.filter(item => item.id !== itemId);

    if (data.schedule.length === originalLen) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    await r2PutJson(R2_KEYS.wedding(weddingId), data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
