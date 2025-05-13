// src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '../../types/supabase'; // Adjusted path assuming types is at src/types

// Define an async function to be able to use await for cookies()
export async function createSupabaseServerClient() {
  const cookieStore = await cookies(); // Await the Promise
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              if (typeof cookieStore.set === 'function') { // Direct check on cookieStore
                cookieStore.set(name, value, options);
              }
            });
          } catch (error) {
            // console.error("Error setting cookies in Supabase server client:", error);
          }
        },
      },
    }
  );
} 