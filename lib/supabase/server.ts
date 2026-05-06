// import { createServerClient, type CookieOptions } from '@supabase/ssr'
// import { cookies } from 'next/headers'

// export async function createClient() {
//   // Await the cookies() call for Next.js 15+
//   const cookieStore = await cookies()

//   return createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name: string) {
//           return cookieStore.get(name)?.value
//         },
//         set(name: string, value: string, options: CookieOptions) {
//           try {
//             cookieStore.set({ name, value, ...options })
//           } catch (error) {
//             // This can be ignored if the client is called in a Server Component
//           }
//         },
//         remove(name: string, options: CookieOptions) {
//           try {
//             cookieStore.set({ name, value: '', ...options })
//           } catch (error) {
//             // This can be ignored if the client is called in a Server Component
//           }
//         },
//       },
//     }
//   )
// }

// lib/supabase/server.ts
// import { createServerClient } from "@supabase/ssr";
// import { cookies } from "next/headers";

// export async function createClient() {
//   const cookieStore = await cookies();

//   return createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return cookieStore.getAll();
//         },
//         // IMPORTANT: The server cannot set cookies when fetching data.
//         // It must pass the responsibility back to Next.js middleware.
//         setAll(cookiesToSet) {
//           // This is generally handled by middleware
//         },
//       },
//     }
//   );
// }

// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies() // Await cookies in Next.js 15

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        // IMPORTANT: The server itself should NOT try to set cookies. 
        // We handle that in middleware. This empty function prevents errors.
        setAll(cookiesToSet) {
          // Generally handled by middleware for server components.
        },
      },
    }
  );
}