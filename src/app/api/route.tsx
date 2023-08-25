import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json(
    { error: '존재하지 않는 API입니다' },
    { status: 400 }
  );
}
