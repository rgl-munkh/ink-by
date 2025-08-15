// Re-export client-side utilities for backward compatibility
export { supabase, auth } from './supabase-client'

// Note: Server-side utilities (createServiceClient, createServerSupabaseClient) 
// are now in './supabase-server' and should be imported directly from there 
// to avoid bundling next/headers in client components
