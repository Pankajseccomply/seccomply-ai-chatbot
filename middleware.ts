import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Guard 1: matcher config (below) limits this to /admin routes only
  // Guard 2: explicit pathname check — safety net for Netlify edge runtime
  // Guard 3: never block API routes, static files, or Next internals
  if (
    !pathname.startsWith('/admin') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get('authorization') || '';

  if (authHeader.startsWith('Basic ')) {
    try {
      const decoded  = atob(authHeader.slice(6));          // atob works on Edge, no Buffer needed
      const colon    = decoded.indexOf(':');
      const username = decoded.slice(0, colon);
      const password = decoded.slice(colon + 1);

      const expectedPass = process.env.ADMIN_PASSWORD || 'admin123';

      if (username === 'admin' && password === expectedPass) {
        return NextResponse.next();
      }
    } catch {
      // malformed header — fall through to 401
    }
  }

  // Prompt browser for credentials
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="SecComply Admin", charset="UTF-8"',
      'Content-Type': 'text/plain',
    },
  });
}

// Matcher: only run this middleware on /admin paths
// Explicitly exclude everything else so Netlify doesn't apply it globally
export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
  ],
};
