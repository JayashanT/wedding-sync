import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import bcrypt from 'bcryptjs';

const WEDDINGS_PATH = path.join(process.cwd(), 'src', 'data', 'weddings.json');
const SALT_ROUNDS = 12;

function weddingFilePath(id: string) {
  return path.join(process.cwd(), 'src', 'data', 'weddings', `${id}.json`);
}

export async function PUT(req: Request, { params }: { params: Promise<{ weddingId: string }> }) {
  try {
    const { weddingId } = await params;
    const updates = await req.json();

    const raw = await fs.readFile(WEDDINGS_PATH, 'utf-8');
    const data = JSON.parse(raw);

    const idx = data.weddings.findIndex((w: { id: string }) => w.id === weddingId);
    if (idx === -1) return NextResponse.json({ error: 'Wedding not found.' }, { status: 404 });

    // Only hash password if a new one was provided (non-empty string)
    if (updates.couplePassword && updates.couplePassword.trim()) {
      updates.couplePassword = await bcrypt.hash(updates.couplePassword, SALT_ROUNDS);
    } else {
      // Keep existing hash
      delete updates.couplePassword;
    }

    data.weddings[idx] = { ...data.weddings[idx], ...updates, id: weddingId };
    await fs.writeFile(WEDDINGS_PATH, JSON.stringify(data, null, 2), 'utf-8');

    // Return without the hash
    const { couplePassword: _pw, ...safe } = data.weddings[idx];
    return NextResponse.json(safe);
  } catch {
    return NextResponse.json({ error: 'Failed to update wedding.' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ weddingId: string }> }) {
  try {
    const { weddingId } = await params;

    const raw = await fs.readFile(WEDDINGS_PATH, 'utf-8');
    const data = JSON.parse(raw);

    const idx = data.weddings.findIndex((w: { id: string }) => w.id === weddingId);
    if (idx === -1) return NextResponse.json({ error: 'Wedding not found.' }, { status: 404 });

    data.weddings.splice(idx, 1);
    await fs.writeFile(WEDDINGS_PATH, JSON.stringify(data, null, 2), 'utf-8');

    try { await fs.unlink(weddingFilePath(weddingId)); } catch { /* file may not exist */ }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete wedding.' }, { status: 500 });
  }
}
