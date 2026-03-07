import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Only protect /admin routes
  const authHeader = req.headers.get('authorization');

  if (authHeader) {
    const base64 = authHeader.replace('Basic ', '');
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');
    const [username, password] = decoded.split(':');

    const validUser = username === 'admin';
    const validPass = password === (process.env.ADMIN_PASSWORD || 'admin123');

    if (validUser && validPass) {
      return NextResponse.next();
    }
  }

  // Prompt browser for username/password
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="SecComply Admin"',
    },
  });
}

// ✅ ONLY run this middleware on /admin and /admin/* routes
// All other pages (homepage, contact, chatbot API etc.) are completely unprotected
export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
