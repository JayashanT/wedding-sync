import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import bcrypt from 'bcryptjs';
import type { WeddingsFile } from '@/types';

export async function POST(request: Request) {
  try {
    const { weddingId, accessCode } = await request.json();

    if (!weddingId || !accessCode) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'src', 'data', 'weddings.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    const data: WeddingsFile = JSON.parse(raw);

    const wedding = data.weddings.find(w => w.id === weddingId);
    if (!wedding) {
      return NextResponse.json({ error: 'Invalid wedding ID or access code' }, { status: 401 });
    }

    // Support both plaintext (legacy) and bcrypt-hashed access codes
    const codeMatch = wedding.accessCode.startsWith('$2')
      ? await bcrypt.compare(accessCode, wedding.accessCode)
      : accessCode === wedding.accessCode;

    if (!codeMatch) {
      return NextResponse.json({ error: 'Invalid wedding ID or access code' }, { status: 401 });
    }

    return NextResponse.json({
      weddingId: wedding.id,
      brideName: wedding.brideName,
      groomName: wedding.groomName,
      weddingDate: wedding.weddingDate,
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
