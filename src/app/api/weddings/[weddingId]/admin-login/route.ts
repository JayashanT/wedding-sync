import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import type { WeddingsFile } from '@/types';

export async function POST(req: Request, { params }: { params: Promise<{ weddingId: string }> }) {
  try {
    const { weddingId } = await params;
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'src', 'data', 'weddings.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    const data: WeddingsFile = JSON.parse(raw);

    const wedding = data.weddings.find(
      w => w.id === weddingId && w.coupleUsername === username && w.couplePassword === password
    );

    if (!wedding) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({
      weddingId: wedding.id,
      brideName: wedding.brideName,
      groomName: wedding.groomName,
      weddingDate: wedding.weddingDate,
      coupleUsername: wedding.coupleUsername,
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
