import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { r2GetJson, R2_KEYS } from '@/lib/r2';
import type { WeddingsFile } from '@/types';

export async function POST(req: Request, { params }: { params: Promise<{ weddingId: string }> }) {
  try {
    const { weddingId } = await params;
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const data = await r2GetJson<WeddingsFile>(R2_KEYS.weddings());
    if (!data) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const wedding = data.weddings.find(w => w.id === weddingId && w.coupleUsername === username);
    if (!wedding) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordMatch = wedding.couplePassword.startsWith('$2')
      ? await bcrypt.compare(password, wedding.couplePassword)
      : password === wedding.couplePassword;

    if (!passwordMatch) {
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
