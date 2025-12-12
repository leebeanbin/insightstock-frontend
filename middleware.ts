import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for handling route redirects
 * - /education -> /folio (301 Permanent)
 * - /chat -> /ai-lab (301 Permanent)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 301 Permanent Redirect: /education -> /folio
  if (pathname.startsWith('/education')) {
    const newPath = pathname.replace('/education', '/folio');
    const url = request.nextUrl.clone();
    url.pathname = newPath;
    return NextResponse.redirect(url, 301);
  }

  // 301 Permanent Redirect: /chat -> /ai-lab
  if (pathname.startsWith('/chat')) {
    const newPath = pathname.replace('/chat', '/ai-lab');
    const url = request.nextUrl.clone();
    url.pathname = newPath;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/education/:path*',
    '/chat/:path*',
  ],
};
