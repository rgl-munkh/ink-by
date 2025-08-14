import type { UserWithProfile } from '@/db/queries/users'

export const authAPI = {
  // Centralized API call for user profile
  async getUserProfile(): Promise<{ user: unknown; userProfile: UserWithProfile | null } | null> {
    try {
      const response = await fetch('/api/auth/user')
      if (response.ok) {
        const result = await response.json()
        return result.data || null
      }
      return null
    } catch (error) {
      console.error('Error loading user profile:', error)
      return null
    }
  },

  // Update last login
  async updateLastLogin(): Promise<void> {
    try {
      await fetch('/api/auth/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateLastLogin' })
      })
    } catch (error) {
      console.error('Error updating last login:', error)
    }
  },

  // Mark email as verified
  async markEmailVerified(): Promise<void> {
    try {
      await fetch('/api/auth/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markEmailVerified' })
      })
    } catch (error) {
      console.error('Error marking email verified:', error)
    }
  },

  // Check profile completion
  async checkProfileComplete(): Promise<boolean> {
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
}
