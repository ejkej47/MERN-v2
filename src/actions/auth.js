'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

async function getOrigin() {
  const h = await headers()
  const host = h.get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  return process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`
}

// --- LOGIN (email + lozinka) ---
export async function login(prevState, formData) {
  const email = formData.get('email')
  const password = formData.get('password')

  if (!email || !password) {
    return { error: 'Unesite email i lozinku.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  redirect('/my-courses')
}

// --- REGISTRACIJA ---
export async function register(prevState, formData) {
  const email = formData.get('email')
  const password = formData.get('password')

  if (!email || !password) {
    return { error: 'Unesite email i lozinku.' }
  }

  const supabase = await createClient()
  const origin = await getOrigin()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Registracija uspešna! Proverite email za potvrdu naloga.' }
}

// --- LOGOUT ---
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

// --- GOOGLE OAUTH ---
export async function signInWithGoogle() {
  const supabase = await createClient()
  const origin = await getOrigin()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error || !data?.url) {
    redirect('/login?error=google')
  }

  redirect(data.url)
}

// --- ZABORAVLJENA LOZINKA ---
export async function forgotPassword(prevState, formData) {
  const email = formData.get('email')

  if (!email) {
    return { error: 'Unesite email adresu.' }
  }

  const supabase = await createClient()
  const origin = await getOrigin()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Link za resetovanje lozinke je poslat na vaš email.' }
}

// --- POSTAVLJANJE NOVE LOZINKE (posle klika na reset link) ---
export async function updatePassword(prevState, formData) {
  const password = formData.get('password')

  if (!password || password.length < 6) {
    return { error: 'Lozinka mora imati bar 6 karaktera.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: error.message }
  }

  redirect('/profile')
}
