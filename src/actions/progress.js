'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleLessonComplete(lessonId, isCurrentlyCompleted, pathToRevalidate) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Korisnik nije ulogovan' }

  if (isCurrentlyCompleted) {
    // Ako je već završeno, korisnik želi da poništi (obriši iz baze)
    await supabase
      .from('user_lesson_progress')
      .delete()
      .match({ user_id: user.id, lesson_id: lessonId })
  } else {
    // Ako nije završeno, upisujemo kao završeno
    await supabase
      .from('user_lesson_progress')
      .upsert({ 
        user_id: user.id, 
        lesson_id: lessonId, 
        is_completed: true, 
        completed_at: new Date().toISOString() 
      })
  }

  // Next.js magija: osvežava trenutnu putanju da bi se dugme i UI odmah ažurirali
  revalidatePath(pathToRevalidate)
}