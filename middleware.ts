import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  if (auth.startsWith('Basic ')) {
    const [user, pass] = Buffer.from(auth.slice(6), 'base64').toString().split(':');
    if (user === 'admin' && pass === process.env.ADMIN_PASSWORD) return NextResponse.next();
  }
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="SecComply Admin"' },
  });
}

export const config = { matcher: ['/admin/:path*'] };
