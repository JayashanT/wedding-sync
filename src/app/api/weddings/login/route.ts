import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { r2GetJson, R2_KEYS } from '@/lib/r2';
import type { WeddingsFile } from '@/types';

export async function POST(request: Request) {
  try {
    const { weddingId, accessCode } = await request.json();

    if (!weddingId || !accessCode) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const data = await r2GetJson<WeddingsFile>(R2_KEYS.weddings());
    if (!data) return NextResponse.json({ error: 'Invalid wedding ID or access code' }, { status: 401 });

    const wedding = data.weddings.find(w => w.id === weddingId);
    if (!wedding) {
      return NextResponse.json({ error: 'Invalid wedding ID or access code' }, { status: 401 });
    }

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
