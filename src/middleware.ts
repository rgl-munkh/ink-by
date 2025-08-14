import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { env } from './lib/env'
import { PROTECTED_ROUTES, AUTH_ROUTES, ROLE_ROUTES, ROUTES } from '@/config/routes'
import type { UserTypeValue } from '@/types'
import { USER_TYPES } from '@/types'

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
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
    const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route))

    // Redirect to login if accessing protected route without session
    if (isProtectedRoute && !user) {
      url.pathname = ROUTES.AUTH.LOGIN
      url.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(url)
    }

    // Redirect to dashboard if accessing auth routes while logged in
    if (isAuthRoute && user) {
      // Get user metadata to determine redirect
      const userType = user.user_metadata?.user_type || USER_TYPES.CUSTOMER
      url.pathname = userType === USER_TYPES.TATTOOIST ? ROUTES.DASHBOARD.TATTOOIST : ROUTES.DASHBOARD.CUSTOMER
      url.searchParams.delete('redirectTo')
      return NextResponse.redirect(url)
    }

    // Check role-based access
    if (user && isProtectedRoute) {
      const userType = user.user_metadata?.user_type as UserTypeValue
      
      if (userType && ROLE_ROUTES[userType]) {
        // Check if user is accessing a route they're not allowed to
        const otherRoleRoutes = Object.entries(ROLE_ROUTES)
          .filter(([role]) => role !== userType)
          .flatMap(([, routes]) => routes)
          .some(route => pathname.startsWith(route))
        
        if (otherRoleRoutes) {
          // Redirect to appropriate dashboard
          url.pathname = userType === USER_TYPES.TATTOOIST ? ROUTES.DASHBOARD.TATTOOIST : ROUTES.DASHBOARD.CUSTOMER
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
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
    
    if (isProtectedRoute) {
      url.pathname = ROUTES.AUTH.LOGIN
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
