import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { updateProfile } from '@/actions/profile'

export default async function ProfilePage({ searchParams }) {
  const supabase = await createClient()

  // 1. Provera autentifikacije
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  // 2. Dohvatanje trenutnih podataka o profilu iz baze
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 3. Povezivanje sa kursevima: Dohvatamo upise da bismo izvukli statistiku
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_id, module_id')
    .eq('user_id', user.id)

  // Razdvajamo cele kurseve od pojedinačnih modula
  const courseCount = enrollments?.filter(e => !e.module_id).length || 0
  const moduleCount = enrollments?.filter(e => e.module_id).length || 0

  // Hvatanje query parametara iz URL-a za povratne informacije o uspehu/grešci
  const resolvedSearchParams = await searchParams
  const success = resolvedSearchParams?.success === 'true'
  const error = resolvedSearchParams?.error

  // Handler koji spaja formu sa Server Akcijom i vrši preusmeravanje sa statusom
  async function handleFormSubmit(formData) {
    'use server'
    const result = await updateProfile(formData)
    if (result.success) {
      redirect('/profile?success=true')
    } else {
      redirect(`/profile?error=${encodeURIComponent(result.error)}`)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/my-courses">← Nazad na moje kurseve</Link>
      </div>

      <h1>Moj Profil</h1>
      <p style={{ color: '#555' }}>Pregledajte status svog naloga i ažurirajte lične podatke.</p>

      {success && (
        <div style={{ padding: '10px', background: '#d4edda', color: '#155724', borderRadius: '5px', marginBottom: '20px' }}>
          ✓ Profil je uspešno ažuriran!
        </div>
      )}
      {error && (
        <div style={{ padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '5px', marginBottom: '20px' }}>
          ❌ Greška pri čuvanju: {error}
        </div>
      )}

      <div style={{ display: 'grid', gap: '30px', gridTemplateColumns: '1fr 1fr', marginTop: '30px' }}>
        
        {/* LEVA STRANA: Forma za izmenu podataka */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', background: '#f9f9f9' }}>
          <h3>Lični podaci</h3>
          <form action={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email adresa (Nema izmene)</label>
              <input 
                type="email" 
                value={user.email} 
                disabled 
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: '#e9ecef', cursor: 'not-allowed' }}
              />
            </div>

            <div>
              <label htmlFor="fullName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ime i prezime</label>
              <input 
                type="text" 
                id="fullName"
                name="fullName" 
                defaultValue={profile?.full_name || ''} 
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <button 
              type="submit" 
              style={{ padding: '10px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Sačuvaj izmene
            </button>
          </form>
        </div>

        {/* DESNA STRANA: Povezana statistika i brzi linkovi */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', background: '#f9f9f9' }}>
          <h3>Vaša aktivnost</h3>
          <div style={{ marginTop: '20px', lineHeight: '1.8' }}>
            <p><strong>Otključani celi kursevi:</strong> {courseCount}</p>
            <p><strong>Kupljeni pojedinačni moduli:</strong> {moduleCount}</p>
          </div>
          
          <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }} />
          
          <h4>Brza navigacija</h4>
          <ul style={{ paddingLeft: '20px', marginTop: '10px', lineHeight: '1.8' }}>
            <li style={{ marginBottom: '8px' }}>
              <Link href="/my-courses" style={{ color: '#0070f3' }}>Idi na listu svojih kurseva</Link>
            </li>
            <li>
              <Link href="/courses" style={{ color: '#0070f3' }}>Pregledaj celokupan katalog</Link>
            </li>
          </ul>
        </div>

      </div>
    </div>
  )
}