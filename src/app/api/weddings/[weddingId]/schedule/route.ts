import { NextResponse } from 'next/server';
import { r2GetJson, r2PutJson, R2_KEYS } from '@/lib/r2';
import type { WeddingData, ScheduleItem } from '@/types';
import { sortScheduleByTime } from '@/lib/schedule';

export async function GET(_req: Request, { params }: { params: Promise<{ weddingId: string }> }) {
  try {
    const { weddingId } = await params;
    const data = await r2GetJson<WeddingData>(R2_KEYS.wedding(weddingId));
    if (!data) return NextResponse.json({ error: 'Wedding not found' }, { status: 404 });
    return NextResponse.json(sortScheduleByTime(data.schedule));
  } catch {
    return NextResponse.json({ error: 'Wedding not found' }, { status: 404 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ weddingId: string }> }) {
  try {
    const { weddingId } = await params;
    const body = await req.json();

    const { date, time, title, description, location, responsiblePersons } = body;
    if (!date || !time || !title || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (Array.isArray(responsiblePersons) && responsiblePersons.length > 5) {
      return NextResponse.json({ error: 'Max 5 responsible persons' }, { status: 400 });
    }

    const data = await r2GetJson<WeddingData>(R2_KEYS.wedding(weddingId));
    if (!data) return NextResponse.json({ error: 'Wedding not found' }, { status: 404 });

    const newItem: ScheduleItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date,
      time,
      title,
      description: description ?? '',
      location,
      responsiblePersons: responsiblePersons ?? [],
    };

    data.schedule = sortScheduleByTime([...data.schedule, newItem]);
    await r2PutJson(R2_KEYS.wedding(weddingId), data);

    return NextResponse.json({ data: newItem }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
