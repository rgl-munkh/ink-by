'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '@/lib/supabase'
import { userQueries, type UserWithProfile } from '@/db/queries/users'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  userProfile: UserWithProfile | null
  loading: boolean
  isAuthenticated: boolean
  signUp: (email: string, password: string, userType: 'customer' | 'tattooist', fullName?: string) => Promise<{ data: unknown; error: unknown }>
  signIn: (email: string, password: string) => Promise<{ data: unknown; error: unknown }>
  signOut: () => Promise<{ error: unknown }>
  resetPassword: (email: string) => Promise<{ data: unknown; error: unknown }>
  updatePassword: (password: string) => Promise<{ data: unknown; error: unknown }>
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
          
          // Load user profile from database
          const profile = await userQueries.getUserWithProfile(session.user.id)
          setUserProfile(profile)

          // Update last login
          await userQueries.updateLastLogin(session.user.id)
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
          
          const profile = await userQueries.getUserWithProfile(session.user.id)
          setUserProfile(profile)

          // Update last login
          await userQueries.updateLastLogin(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setUserProfile(null)
        } else if (event === 'USER_UPDATED' && session?.user) {
          setUser(session.user)
          
          // Refresh profile data
          const profile = await userQueries.getUserWithProfile(session.user.id)
          setUserProfile(profile)
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
  const signUp = async (email: string, password: string, userType: 'customer' | 'tattooist', fullName?: string) => {
    try {
      const response = await auth.signUp(email, password, userType, { fullName })
      
      if (response.error) throw response.error
      
      // If user was created, create profile in our database
      if (response.data?.user) {
        await userQueries.createUserWithProfile(response.data.user.id, {
          email,
          fullName,
          userType,
        })
      }
      
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await auth.signIn(email, password)
      return { data: response.data, error: response.error }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const response = await auth.signOut()
      return { error: response.error }
    } catch (error) {
      return { error }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const response = await auth.resetPassword(email)
      return { data: response.data, error: response.error }
    } catch (error) {
      return { data: null, error }
    }
  }

  const updatePassword = async (password: string) => {
    try {
      const response = await auth.updatePassword(password)
      return { data: response.data?.user || null, error: response.error }
    } catch (error) {
      return { data: null, error }
    }
  }

  const refreshProfile = async () => {
    if (!user) return

    try {
      const profile = await userQueries.getUserWithProfile(user.id)
      setUserProfile(profile)
    } catch (error) {
      console.error('Error refreshing profile:', error)
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
