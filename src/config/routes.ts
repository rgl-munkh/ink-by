import type { UserTypeValue } from '@/types'

export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password'
  },
  DASHBOARD: {
    CUSTOMER: '/dashboard/customer',
    TATTOOIST: '/dashboard/tattooist'
  },
  PROTECTED: {
    PROFILE: '/profile',
    BOOKINGS: '/bookings',
    PORTFOLIO: '/portfolio',
    AVAILABILITY: '/availability',
    SETTINGS: '/settings'
  }
} as const

export const PROTECTED_ROUTES: readonly string[] = [
  ROUTES.DASHBOARD.CUSTOMER,
  ROUTES.DASHBOARD.TATTOOIST,
  ROUTES.PROTECTED.PROFILE,
  ROUTES.PROTECTED.BOOKINGS,
  ROUTES.PROTECTED.PORTFOLIO,
  ROUTES.PROTECTED.AVAILABILITY,
  ROUTES.PROTECTED.SETTINGS
] as const

export const AUTH_ROUTES: readonly string[] = [
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.REGISTER,
  ROUTES.AUTH.FORGOT_PASSWORD
] as const

export const ROLE_ROUTES: Record<UserTypeValue, readonly string[]> = {
  tattooist: [
    ROUTES.PROTECTED.PORTFOLIO,
    ROUTES.PROTECTED.AVAILABILITY,
    ROUTES.DASHBOARD.TATTOOIST
  ],
  customer: [
    ROUTES.DASHBOARD.CUSTOMER
  ]
} as const

export type RouteKey = keyof typeof ROUTES
export type AuthRouteKey = keyof typeof ROUTES.AUTH
export type DashboardRouteKey = keyof typeof ROUTES.DASHBOARD
export type ProtectedRouteKey = keyof typeof ROUTES.PROTECTED
