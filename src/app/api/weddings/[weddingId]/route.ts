import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import type { WeddingData, WeddingsFile } from '@/types';

function getWeddingPath(weddingId: string) {
  return path.join(process.cwd(), 'src', 'data', 'weddings', `${weddingId}.json`);
}

function getWeddingsPath() {
  return path.join(process.cwd(), 'src', 'data', 'weddings.json');
}

async function getWeddingDate(weddingId: string): Promise<string | null> {
  try {
    const raw = await fs.readFile(getWeddingsPath(), 'utf-8');
    const data: WeddingsFile = JSON.parse(raw);
    return data.weddings.find(w => w.id === weddingId)?.weddingDate ?? null;
  } catch {
    return null;
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ weddingId: string }> }) {
  try {
    const { weddingId } = await params;
    const [raw, weddingDate] = await Promise.all([
      fs.readFile(getWeddingPath(weddingId), 'utf-8'),
      getWeddingDate(weddingId),
    ]);
    const data: WeddingData = JSON.parse(raw);
    return NextResponse.json({ ...data, weddingDate: weddingDate ?? data.weddingDate ?? null });
  } catch {
    return NextResponse.json({ error: 'Wedding not found' }, { status: 404 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ weddingId: string }> }) {
  try {
    const { weddingId } = await params;
    const body = await req.json();
    const filePath = getWeddingPath(weddingId);
    const raw = await fs.readFile(filePath, 'utf-8');
    const data: WeddingData = JSON.parse(raw);

    if (body.roles !== undefined) {
      if (!Array.isArray(body.roles) || body.roles.length > 5) {
        return NextResponse.json({ error: 'Invalid roles' }, { status: 400 });
      }
      data.roles = body.roles;
    }

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    const weddingDate = await getWeddingDate(weddingId);
    return NextResponse.json({ ...data, weddingDate });
  } catch {
    return NextResponse.json({ error: 'Failed to update wedding' }, { status: 500 });
  }
}
