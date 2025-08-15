import { createClient } from '@supabase/supabase-js'
import { env } from './env'
import type { UserTypeValues } from '@/types'

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a single supabase client for interacting with your database (CLIENT-SIDE ONLY)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Configure for email/password auth
    flowType: 'pkce'
  }
})

// Auth helper functions for client-side usage
export const auth = {
  // Sign up new user with email and password
  signUp: async (email: string, password: string, userType: UserTypeValues, metadata?: { fullName?: string }) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userType,
          full_name: metadata?.fullName
        }
      }
    })
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    })
  },

  // Sign out current user
  signOut: async () => {
    return await supabase.auth.signOut()
  },

  // Get current session
  getSession: async () => {
    return await supabase.auth.getSession()
  },

  // Get current user
  getUser: async () => {
    return await supabase.auth.getUser()
  },

  // Reset password
  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
    })
  },

  // Update password
  updatePassword: async (password: string) => {
    return await supabase.auth.updateUser({ password })
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}
