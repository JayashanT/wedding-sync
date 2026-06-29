import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { r2GetJson, r2PutJson, R2_KEYS } from '@/lib/r2';

const SALT_ROUNDS = 12;

export async function GET() {
  try {
    const data = await r2GetJson<{ weddings: Record<string, unknown>[] }>(R2_KEYS.weddings());
    if (!data) return NextResponse.json({ weddings: [] });
    // Strip hashed passwords — never send to client
    const safe = data.weddings.map(({ couplePassword: _, ...rest }) => rest);
    return NextResponse.json({ weddings: safe });
  } catch {
    return NextResponse.json({ error: 'Failed to read weddings.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { brideName, groomName, weddingDate, accessCode, coupleUsername, couplePassword } = body;
    if (!brideName || !groomName || !weddingDate || !accessCode || !coupleUsername || !couplePassword) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const data = await r2GetJson<{ weddings: { id: string }[] }>(R2_KEYS.weddings()) ?? { weddings: [] };

    const slug = `${brideName.toLowerCase().replace(/\s+/g, '')}-${groomName.toLowerCase().replace(/\s+/g, '')}`;
    let id = `wedding-${slug}`;
    let counter = 2;
    while (data.weddings.find(w => w.id === id)) {
      id = `wedding-${slug}-${counter++}`;
    }

    const hashedPassword = await bcrypt.hash(couplePassword, SALT_ROUNDS);
    const newWedding = { id, brideName, groomName, weddingDate, accessCode, coupleUsername, couplePassword: hashedPassword };
    data.weddings.push(newWedding);

    await r2PutJson(R2_KEYS.weddings(), data);

    // Create empty per-wedding file in R2
    await r2PutJson(R2_KEYS.wedding(id), { weddingId: id, roles: [], schedule: [] });

    const { couplePassword: _pw, ...safeWedding } = newWedding;
    return NextResponse.json(safeWedding, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create wedding.' }, { status: 500 });
  }
}
