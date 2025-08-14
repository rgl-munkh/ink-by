'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '@/lib/supabase'
import { authAPI } from '@/lib/auth-api'
import type { UserWithProfile } from '@/db/queries/users'
import type { User, Session } from '@supabase/supabase-js'
import type { AuthResult, UserTypeValues } from '@/types'

interface AuthContextType {
  user: User | null
  userProfile: UserWithProfile | null
  loading: boolean
  isAuthenticated: boolean
  signUp: (email: string, password: string, userType: UserTypeValues, fullName?: string) => Promise<AuthResult<{ user: User; session: Session }>>
  signIn: (email: string, password: string) => Promise<AuthResult<{ user: User; session: Session }>>
  signOut: () => Promise<AuthResult<void>>
  resetPassword: (email: string) => Promise<AuthResult<void>>
  updatePassword: (password: string) => Promise<AuthResult<{ user: User }>>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserWithProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user and profile on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { session } } = await auth.getSession()
        
        if (session?.user) {
          setUser(session.user)
          
          // Load user profile and update last login via centralized API
          const profileData = await authAPI.getUserProfile()
          if (profileData) {
            setUserProfile(profileData.userProfile)
          }
          
          // Update last login
          await authAPI.updateLastLogin()
        }
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()

    // Listen for auth state changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      setLoading(true)
      
      try {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          
          // Load profile and update last login via centralized API
          const profileData = await authAPI.getUserProfile()
          if (profileData) {
            setUserProfile(profileData.userProfile)
          }
          
          await authAPI.updateLastLogin()
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setUserProfile(null)
        } else if (event === 'USER_UPDATED' && session?.user) {
          setUser(session.user)
          
          // Refresh profile data via centralized API
          const profileData = await authAPI.getUserProfile()
          if (profileData) {
            setUserProfile(profileData.userProfile)
          }
        }
      } catch (error) {
        console.error('Error handling auth state change:', error)
      } finally {
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Auth actions
  const signUp = async (email: string, password: string, userType: UserTypeValues, fullName?: string): Promise<AuthResult<{ user: User; session: Session }>> => {
    try {
      const response = await auth.signUp(email, password, userType, { fullName })
      
      if (response.error) {
        return { 
          data: null, 
          error: { 
            message: response.error.message, 
            code: response.error.code || 'SIGNUP_ERROR' 
          } 
        }
      }
      
      // Profile creation will be handled by Supabase triggers or other server logic
      
      return { 
        data: response.data as { user: User; session: Session }, 
        error: null 
      }
    } catch (error) {
      return { 
        data: null, 
        error: { 
          message: error instanceof Error ? error.message : 'Unknown error', 
          code: 'SIGNUP_EXCEPTION' 
        } 
      }
    }
  }

  const signIn = async (email: string, password: string): Promise<AuthResult<{ user: User; session: Session }>> => {
    try {
      const response = await auth.signIn(email, password)
      
      if (response.error) {
        return { 
          data: null, 
          error: { 
            message: response.error.message, 
            code: response.error.code || 'SIGNIN_ERROR' 
          } 
        }
      }
      
      return { 
        data: response.data as { user: User; session: Session }, 
        error: null 
      }
    } catch (error) {
      return { 
        data: null, 
        error: { 
          message: error instanceof Error ? error.message : 'Unknown error', 
          code: 'SIGNIN_EXCEPTION' 
        } 
      }
    }
  }

  const signOut = async (): Promise<AuthResult<void>> => {
    try {
      const response = await auth.signOut()
      
      if (response.error) {
        return { 
          data: null, 
          error: { 
            message: response.error.message, 
            code: response.error.code || 'SIGNOUT_ERROR' 
          } 
        }
      }
      
      return { data: undefined as void, error: null }
    } catch (error) {
      return { 
        data: null, 
        error: { 
          message: error instanceof Error ? error.message : 'Unknown error', 
          code: 'SIGNOUT_EXCEPTION' 
        } 
      }
    }
  }

  const resetPassword = async (email: string): Promise<AuthResult<void>> => {
    try {
      const response = await auth.resetPassword(email)
      
      if (response.error) {
        return { 
          data: null, 
          error: { 
            message: response.error.message, 
            code: response.error.code || 'RESET_PASSWORD_ERROR' 
          } 
        }
      }
      
      return { data: undefined as void, error: null }
    } catch (error) {
      return { 
        data: null, 
        error: { 
          message: error instanceof Error ? error.message : 'Unknown error', 
          code: 'RESET_PASSWORD_EXCEPTION' 
        } 
      }
    }
  }

  const updatePassword = async (password: string): Promise<AuthResult<{ user: User }>> => {
    try {
      const response = await auth.updatePassword(password)
      
      if (response.error) {
        return { 
          data: null, 
          error: { 
            message: response.error.message, 
            code: response.error.code || 'UPDATE_PASSWORD_ERROR' 
          } 
        }
      }
      
      return { 
        data: { user: response.data?.user as User }, 
        error: null 
      }
    } catch (error) {
      return { 
        data: null, 
        error: { 
          message: error instanceof Error ? error.message : 'Unknown error', 
          code: 'UPDATE_PASSWORD_EXCEPTION' 
        } 
      }
    }
  }

  const refreshProfile = async () => {
    if (!user) return

    const profileData = await authAPI.getUserProfile()
    if (profileData) {
      setUserProfile(profileData.userProfile)
    }
  }

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
