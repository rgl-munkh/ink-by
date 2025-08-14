'use client'

import { useAuthContext } from '@/components/auth'
import { userQueries } from '@/db/queries/users'

export function useAuth() {
  return useAuthContext()
}

// Hook for checking if user has specific role
export function useRole() {
  const { user, userProfile } = useAuth()
  
  const userType = user?.user_metadata?.user_type || userProfile?.user?.userType
  
  return {
    userType,
    isCustomer: userType === 'customer',
    isTattooist: userType === 'tattooist',
  }
}

// Hook for checking if user profile is complete
export function useProfileCompletion() {
  const { userProfile, user } = useAuth()
  
  const checkCompletion = async () => {
    if (!user) return false
    return await userQueries.checkProfileComplete(user.id)
  }
  
  return {
    isProfileComplete: userProfile?.profile?.isProfileComplete || false,
    checkCompletion,
  }
}
