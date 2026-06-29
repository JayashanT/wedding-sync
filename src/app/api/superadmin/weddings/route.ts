import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const WEDDINGS_PATH = path.join(process.cwd(), 'src', 'data', 'weddings.json');

function weddingFilePath(id: string) {
  return path.join(process.cwd(), 'src', 'data', 'weddings', `${id}.json`);
}

export async function GET() {
  try {
    const raw = await fs.readFile(WEDDINGS_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(raw));
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
    // ensure unique
    let counter = 2;
    while (data.weddings.find((w: { id: string }) => w.id === id)) {
      id = `wedding-${slug}-${counter++}`;
    }

    const newWedding = { id, brideName, groomName, weddingDate, accessCode, coupleUsername, couplePassword };
    data.weddings.push(newWedding);

    await fs.writeFile(WEDDINGS_PATH, JSON.stringify(data, null, 2), 'utf-8');

    // create empty per-wedding file
    const perWedding = { weddingId: id, roles: [], schedule: [] };
    await fs.writeFile(weddingFilePath(id), JSON.stringify(perWedding, null, 2), 'utf-8');

    return NextResponse.json(newWedding, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create wedding.' }, { status: 500 });
  }
}
