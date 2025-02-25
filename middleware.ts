import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Create response object for better caching
  const response = NextResponse.next();

  // Add cache-control headers for auth pages
  if (pathname.startsWith('/auth/')) {
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  // Auth routes that don't need protection
  const publicAuthRoutes = [
    '/auth/otp-login',
    '/auth/verify-otp',
  ];

  // Protected routes that require authentication
  const protectedRoutes = [
    '/internal',
    '/external/landing-page',
    '/dashboard',
    '/auth/onboarding',
  ];

  // Check if route requires protection
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Get auth cookie
  const authCookie = req.cookies.get('auth');
  const isAuthenticated = !!authCookie;

  // If user is not authenticated and tries to access protected routes
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL('/auth/otp-login', req.url));
  }

  return response;
}

// Configure protected routes
export const config = {
  matcher: [
    '/internal/:path*',
    '/external/:path*',
    '/auth/:path*',
    '/dashboard/:path*',
  ]
};