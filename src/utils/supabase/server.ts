import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../../../types_db'

// Supabase's `createServerClient` returns a `SupabaseClient` whose generic
// parameters are slightly misaligned in the current typings, which can lead to
// table schemas collapsing to `never`. By asserting the generics explicitly we
// keep full Database typing across the app.
export type TypedSupabaseClient = SupabaseClient<
  Database,
  'public',
  'public',
  Database['public']
>

export async function createClient(): Promise<TypedSupabaseClient> {
  const cookieStore = await cookies()

  const client = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
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

  // Cast through unknown to align the generic parameter order with the
  // SupabaseClient declaration used throughout the app.
  return client as unknown as TypedSupabaseClient
}
