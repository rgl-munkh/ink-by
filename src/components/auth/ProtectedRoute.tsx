'use client'

import { useAuth, useRole } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'customer' | 'tattooist'
  requireAuth?: boolean
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  requireAuth = true,
  redirectTo 
}: ProtectedRouteProps) {
  const { loading, isAuthenticated } = useAuth()
  const { userType } = useRole()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
      const redirect = redirectTo || '/auth/login'
      router.push(redirect)
      return
    }

    // Check role requirement
    if (requiredRole && userType !== requiredRole) {
      // Redirect to appropriate dashboard based on user type
      const dashboard = userType === 'tattooist' ? '/dashboard/tattooist' : '/dashboard/customer'
      router.push(dashboard)
      return
    }
  }, [loading, isAuthenticated, userType, requiredRole, requireAuth, redirectTo, router])

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Don't render if not authenticated and auth is required
  if (requireAuth && !isAuthenticated) {
    return null
  }

  // Don't render if role doesn't match
  if (requiredRole && userType !== requiredRole) {
    return null
  }

  return <>{children}</>
}

// Higher-order component for protecting pages
export function withAuth<T extends object>(
  Component: React.ComponentType<T>,
  options?: {
    requiredRole?: 'customer' | 'tattooist'
    redirectTo?: string
  }
) {
  return function AuthenticatedComponent(props: T) {
    return (
      <ProtectedRoute 
        requiredRole={options?.requiredRole}
        redirectTo={options?.redirectTo}
      >
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

// Component for conditional rendering based on role
interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: ('customer' | 'tattooist')[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { userType } = useRole()

  if (!userType || !allowedRoles.includes(userType)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Component for conditional rendering based on authentication
interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ children, fallback = null, requireAuth = true }: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>
  }

  if (!requireAuth && isAuthenticated) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
