import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Redirect authenticated users away from auth pages
    if (token && (pathname === '/auth/signin' || pathname === '/auth/signup' || pathname === '/')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Role-based access control
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if (pathname.startsWith('/teacher') && !['ADMIN', 'TEACHER'].includes(token?.role as string)) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Public routes
        if (pathname.startsWith('/auth') || pathname === '/') {
          return true
        }

        // Protected routes require authentication
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/',
    '/auth/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
    '/teacher/:path*',
    '/student/:path*',
    '/alerts/:path*',
    '/settings/:path*',
    '/profile/:path*',
    '/reports/:path*',
    '/analytics/:path*'
  ],
}
