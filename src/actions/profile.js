'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData) {
  const supabase = await createClient()
  
  // Provera da li je korisnik ulogovan
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Niste autorizovani.' }
  }

  const fullName = formData.get('fullName')

  // Upisivanje novog imena u tabelu profiles
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  // Osvežavanje keša za stranicu profila
  revalidatePath('/profile')
  return { success: true }
}