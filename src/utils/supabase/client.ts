import { createBrowserClient } from '@supabase/ssr'

// Define a function to create a Supabase client for browser-based contexts.
// This function utilizes environment variables specific to the client-side.
export function createClient() {
  return createBrowserClient(
    // Pass Supabase URL and anonymous key from client-side environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
} 