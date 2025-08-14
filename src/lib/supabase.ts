import { createClient } from '@supabase/supabase-js'
import { createServerClient as createSSRClient } from '@supabase/ssr'
import { env } from './env'
import { cookies } from 'next/headers'

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Configure for email/password auth
    flowType: 'pkce'
  }
})

// Service client for server-side operations (with service role key)
export const createServiceClient = () => {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for server-side operations')
  }
  return createClient(supabaseUrl, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Server-side client for authenticated requests (using user's session)
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies()
  
  return createSSRClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Auth helper functions
export const auth = {
  // Sign up new user with email and password
  signUp: async (email: string, password: string, userType: 'customer' | 'tattooist', metadata?: { fullName?: string }) => {
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

// Database types (will be generated later when needed)
