import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  ) 

  const { data: { user } } = await supabase.auth.getUser()

  // Logika zaštite: ako nema korisnika, a pokušava na zaštićenu rutu
  if (!user && request.nextUrl.pathname.startsWith('/my-courses')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}