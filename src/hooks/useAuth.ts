'use client'

import { useAuthContext } from '@/components/auth'
import { authAPI } from '@/lib/auth-api'
import { USER_TYPES } from '@/types'

export function useAuth() {
  return useAuthContext()
}

// Hook for checking if user has specific role
export function useRole() {
  const { user, userProfile } = useAuth()
  
  const userType = user?.user_metadata?.user_type || userProfile?.user?.userType
  
  return {
    userType,
    isCustomer: userType === USER_TYPES.CUSTOMER,
    isTattooist: userType === USER_TYPES.TATTOOIST,
  }
}

// Hook for checking if user profile is complete
export function useProfileCompletion() {
  const { userProfile, user } = useAuth()
  
  const checkCompletion = async () => {
    if (!user) return false
    return await authAPI.checkProfileComplete()
  }
  
  return {
    isProfileComplete: userProfile?.profile?.isProfileComplete || false,
    checkCompletion,
  }
}
