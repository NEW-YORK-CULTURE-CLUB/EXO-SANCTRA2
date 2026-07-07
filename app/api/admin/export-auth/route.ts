import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const configuredKey = process.env.DATA_EXPORT_ACCESS_KEY?.trim();

  if (!configuredKey) {
    return NextResponse.json({ authorized: true, optional: true });
  }

  try {
    const { key } = await request.json();
    if (key !== configuredKey) {
      return NextResponse.json(
        { authorized: false, error: 'Invalid access key' },
        { status: 401 }
      );
    }
    return NextResponse.json({ authorized: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
