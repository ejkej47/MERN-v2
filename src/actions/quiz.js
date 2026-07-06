'use server';

import { createClient } from '@/lib/supabase/server';

export async function submitQuizResults(quizKey, quizType, answers) {
  // DODATO: await ispred createClient()
  const supabase = await createClient();

  // 1. Dobijamo trenutno ulogovanog korisnika
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { success: false, error: 'Korisnik nije autentifikovan.' };
  }

  // 2. Ovde bi išla logika za kalkulaciju bodova ako je potrebna za specifičan quizType
  // Za sada stavljamo 0, a kasnije možemo dodati switch(quizType) logiku.
  const scores = {
    flight: 0,
    attack: 0,
    manipulation: 0,
    harmonious: 0
  };

  // 3. Upis u bazu
  const { error } = await supabase
    .from('user_quiz_results')
    .insert({
      user_id: user.id,
      quiz_key: quizKey,
      quiz_type: quizType,
      results_data: answers, // Ovo Supabase automatski snima kao jsonb
      flight: scores.flight,
      attack: scores.attack,
      manipulation: scores.manipulation,
      harmonious: scores.harmonious
    });

  if (error) {
    console.error('Greška pri upisu kviza:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}