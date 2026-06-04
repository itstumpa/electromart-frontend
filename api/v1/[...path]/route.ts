// app/api/v1/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL || '';

async function handler(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const url = `${BACKEND}/api/v1/${path}${req.nextUrl.search}`;

  const backendRes = await fetch(url, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      // forward cookies from browser to backend
      cookie: req.headers.get('cookie') ?? '',
    },
    body: req.method !== 'GET' && req.method !== 'HEAD'
      ? await req.text()
      : undefined,
  });

  const data = await backendRes.text();
  const res = new NextResponse(data, { status: backendRes.status });

  // forward Set-Cookie from backend to browser
  const setCookie = backendRes.headers.get('set-cookie');
  if (setCookie) {
    res.headers.set('set-cookie', setCookie);
  }

  return res;
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;