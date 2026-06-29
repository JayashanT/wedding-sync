import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { r2GetJson, r2PutJson, r2Delete, R2_KEYS } from '@/lib/r2';

const SALT_ROUNDS = 12;

export async function PUT(req: Request, { params }: { params: Promise<{ weddingId: string }> }) {
  try {
    const { weddingId } = await params;
    const updates = await req.json();

    const data = await r2GetJson<{ weddings: { id: string; couplePassword: string }[] }>(R2_KEYS.weddings());
    if (!data) return NextResponse.json({ error: 'Wedding not found.' }, { status: 404 });

    const idx = data.weddings.findIndex(w => w.id === weddingId);
    if (idx === -1) return NextResponse.json({ error: 'Wedding not found.' }, { status: 404 });

    // Hash new password only if provided
    if (updates.couplePassword && updates.couplePassword.trim()) {
      updates.couplePassword = await bcrypt.hash(updates.couplePassword, SALT_ROUNDS);
    } else {
      delete updates.couplePassword;
    }

    data.weddings[idx] = { ...data.weddings[idx], ...updates, id: weddingId };
    await r2PutJson(R2_KEYS.weddings(), data);

    const { couplePassword: _pw, ...safe } = data.weddings[idx];
    return NextResponse.json(safe);
  } catch {
    return NextResponse.json({ error: 'Failed to update wedding.' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ weddingId: string }> }) {
  try {
    const { weddingId } = await params;

    const data = await r2GetJson<{ weddings: { id: string }[] }>(R2_KEYS.weddings());
    if (!data) return NextResponse.json({ error: 'Wedding not found.' }, { status: 404 });

    const idx = data.weddings.findIndex(w => w.id === weddingId);
    if (idx === -1) return NextResponse.json({ error: 'Wedding not found.' }, { status: 404 });

    data.weddings.splice(idx, 1);
    await r2PutJson(R2_KEYS.weddings(), data);
    await r2Delete(R2_KEYS.wedding(weddingId));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete wedding.' }, { status: 500 });
  }
}
