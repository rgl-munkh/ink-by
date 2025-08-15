import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env:{
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    DATABASE_URL: process.env.DATABASE_URL || '',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '',
  }
};

export default nextConfig;
