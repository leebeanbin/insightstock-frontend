import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for handling route redirects
 * - /chat -> /ai-lab (301 Permanent)
 * - /education -> /notes (301 Permanent)
 * - /folio -> /notes (301 Permanent)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 301 Permanent Redirect: /chat -> /ai-lab
  if (pathname.startsWith('/chat')) {
    const newPath = pathname.replace('/chat', '/ai-lab');
    const url = request.nextUrl.clone();
    url.pathname = newPath;
    return NextResponse.redirect(url, 301);
  }

  // 301 Permanent Redirect: /education -> /notes
  if (pathname.startsWith('/education')) {
    const url = request.nextUrl.clone();
    url.pathname = '/notes';
    return NextResponse.redirect(url, 301);
  }

  // 301 Permanent Redirect: /folio -> /notes
  if (pathname.startsWith('/folio')) {
    const url = request.nextUrl.clone();
    url.pathname = '/notes';
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/chat/:path*',
    '/education/:path*',
    '/folio/:path*',
  ],
};
