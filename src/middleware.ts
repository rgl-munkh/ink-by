import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { env } from './lib/env'

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/bookings',
  '/portfolio',
  '/availability',
  '/settings'
]

// Routes that are only for authenticated users (redirect to dashboard if already logged in)
const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password'
]

// Routes that require specific user types
const roleBasedRoutes = {
  tattooist: [
    '/portfolio',
    '/availability',
    '/dashboard/tattooist'
  ],
  customer: [
    '/dashboard/customer'
  ]
}

export async function middleware(request: NextRequest) {
  try {
    // Create a response object
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    // Create Supabase client
    const supabase = createServerClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Get session and user
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user

    const url = request.nextUrl.clone()
    const pathname = url.pathname

    // Check if route is protected
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

    // Redirect to login if accessing protected route without session
    if (isProtectedRoute && !user) {
      url.pathname = '/auth/login'
      url.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(url)
    }

    // Redirect to dashboard if accessing auth routes while logged in
    if (isAuthRoute && user) {
      // Get user metadata to determine redirect
      const userType = user.user_metadata?.user_type || 'customer'
      url.pathname = userType === 'tattooist' ? '/dashboard/tattooist' : '/dashboard/customer'
      url.searchParams.delete('redirectTo')
      return NextResponse.redirect(url)
    }

    // Check role-based access
    if (user && isProtectedRoute) {
      const userType = user.user_metadata?.user_type as 'customer' | 'tattooist'
      
      // Check if this route requires a specific role
      for (const [role, routes] of Object.entries(roleBasedRoutes)) {
        const requiresThisRole = routes.some(route => pathname.startsWith(route))
        
        if (requiresThisRole && userType !== role) {
          // Redirect to appropriate dashboard
          url.pathname = userType === 'tattooist' ? '/dashboard/tattooist' : '/dashboard/customer'
          return NextResponse.redirect(url)
        }
      }
    }

    // Return response with updated cookies
    return response

  } catch (error) {
    // If there's an error, redirect to login for protected routes
    console.error('Middleware error:', error)
    
    const url = request.nextUrl.clone()
    const pathname = url.pathname
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
    
    if (isProtectedRoute) {
      url.pathname = '/auth/login'
      url.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(url)
    }
    
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}
