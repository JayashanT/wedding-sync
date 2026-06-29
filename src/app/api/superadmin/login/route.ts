import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const validUsername = process.env.SUPERADMIN_USERNAME;
    const validPassword = process.env.SUPERADMIN_PASSWORD;

    if (!validUsername || !validPassword) {
      return NextResponse.json({ error: 'Server misconfiguration.' }, { status: 500 });
    }

    if (username !== validUsername || password !== validPassword) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
