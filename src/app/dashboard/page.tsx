'use client'

import { useAuth, useRole } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { USER_TYPES } from '@/types'
import { ROUTES } from '@/config/routes'

export default function DashboardRedirect() {
  const { isAuthenticated, loading } = useAuth()
  const { userType } = useRole()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!isAuthenticated) {
      router.push(ROUTES.AUTH.LOGIN)
      return
    }

    // Redirect based on user type
    if (userType === USER_TYPES.TATTOOIST) {
      router.push(ROUTES.DASHBOARD.TATTOOIST)
    } else {
      router.push(ROUTES.DASHBOARD.CUSTOMER)
    }
  }, [loading, isAuthenticated, userType, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return null
}
