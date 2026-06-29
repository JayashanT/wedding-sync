import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import bcrypt from 'bcryptjs';

const WEDDINGS_PATH = path.join(process.cwd(), 'src', 'data', 'weddings.json');
const SALT_ROUNDS = 12;

function weddingFilePath(id: string) {
  return path.join(process.cwd(), 'src', 'data', 'weddings', `${id}.json`);
}

export async function GET() {
  try {
    const raw = await fs.readFile(WEDDINGS_PATH, 'utf-8');
    const data = JSON.parse(raw);
    // Strip hashed passwords from the response — never send hashes to the client
    const safe = data.weddings.map(({ couplePassword: _, ...rest }: { couplePassword: string; [key: string]: unknown }) => rest);
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

    const raw = await fs.readFile(WEDDINGS_PATH, 'utf-8');
    const data = JSON.parse(raw);

    const slug = `${brideName.toLowerCase().replace(/\s+/g, '')}-${groomName.toLowerCase().replace(/\s+/g, '')}`;
    let id = `wedding-${slug}`;
    let counter = 2;
    while (data.weddings.find((w: { id: string }) => w.id === id)) {
      id = `wedding-${slug}-${counter++}`;
    }

    const hashedPassword = await bcrypt.hash(couplePassword, SALT_ROUNDS);
    const newWedding = { id, brideName, groomName, weddingDate, accessCode, coupleUsername, couplePassword: hashedPassword };
    data.weddings.push(newWedding);

    await fs.writeFile(WEDDINGS_PATH, JSON.stringify(data, null, 2), 'utf-8');

    const perWedding = { weddingId: id, roles: [], schedule: [] };
    await fs.writeFile(weddingFilePath(id), JSON.stringify(perWedding, null, 2), 'utf-8');

    // Return without the hash
    const { couplePassword: _pw, ...safeWedding } = newWedding;
    return NextResponse.json(safeWedding, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create wedding.' }, { status: 500 });
  }
}
