import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const filePath = path.join(process.cwd(), 'src', 'data', 'superadmin.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    const creds = JSON.parse(raw);

    if (username !== creds.username || password !== creds.password) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
