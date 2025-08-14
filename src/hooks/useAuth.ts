'use client'

import { useAuthContext } from '@/components/auth'

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
    
    try {
      const response = await fetch('/api/auth/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checkProfileComplete' })
      })
      const result = await response.json()
      return result.isComplete || false
    } catch (error) {
      console.error('Error checking profile completion:', error)
      return false
    }
  }
  
  return {
    isProfileComplete: userProfile?.profile?.isProfileComplete || false,
    checkCompletion,
  }
}
