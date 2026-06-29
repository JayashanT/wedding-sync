import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import type { WeddingData, ScheduleItem } from '@/types';
import { sortScheduleByTime } from '@/lib/schedule';

function getWeddingPath(weddingId: string) {
  return path.join(process.cwd(), 'src', 'data', 'weddings', `${weddingId}.json`);
}

export async function GET(_req: Request, { params }: { params: Promise<{ weddingId: string }> }) {
  try {
    const { weddingId } = await params;
    const raw = await fs.readFile(getWeddingPath(weddingId), 'utf-8');
    const data: WeddingData = JSON.parse(raw);
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

    const filePath = getWeddingPath(weddingId);
    const raw = await fs.readFile(filePath, 'utf-8');
    const data: WeddingData = JSON.parse(raw);

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
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');

    return NextResponse.json({ data: newItem }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
