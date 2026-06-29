import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import type { WeddingData } from '@/types';
import { sortScheduleByTime } from '@/lib/schedule';

function getWeddingPath(weddingId: string) {
  return path.join(process.cwd(), 'src', 'data', 'weddings', `${weddingId}.json`);
}

type Params = { params: Promise<{ weddingId: string; itemId: string }> };

export async function PUT(req: Request, { params }: Params) {
  try {
    const { weddingId, itemId } = await params;
    const body = await req.json();

    const filePath = getWeddingPath(weddingId);
    const raw = await fs.readFile(filePath, 'utf-8');
    const data: WeddingData = JSON.parse(raw);

    const idx = data.schedule.findIndex(item => item.id === itemId);
    if (idx === -1) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    if (Array.isArray(body.responsiblePersons) && body.responsiblePersons.length > 5) {
      return NextResponse.json({ error: 'Max 5 responsible persons' }, { status: 400 });
    }

    data.schedule[idx] = { ...data.schedule[idx], ...body, id: itemId };
    data.schedule = sortScheduleByTime(data.schedule);

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ data: data.schedule.find(i => i.id === itemId) });
  } catch {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { weddingId, itemId } = await params;

    const filePath = getWeddingPath(weddingId);
    const raw = await fs.readFile(filePath, 'utf-8');
    const data: WeddingData = JSON.parse(raw);

    const originalLen = data.schedule.length;
    data.schedule = data.schedule.filter(item => item.id !== itemId);

    if (data.schedule.length === originalLen) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
