import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const WEDDINGS_PATH = path.join(process.cwd(), 'src', 'data', 'weddings.json');

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

    data.weddings[idx] = { ...data.weddings[idx], ...updates, id: weddingId };
    await fs.writeFile(WEDDINGS_PATH, JSON.stringify(data, null, 2), 'utf-8');

    return NextResponse.json(data.weddings[idx]);
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

    // delete per-wedding file if it exists
    try { await fs.unlink(weddingFilePath(weddingId)); } catch { /* file may not exist */ }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete wedding.' }, { status: 500 });
  }
}
