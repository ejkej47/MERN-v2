import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function MyCoursesPage() {
  const supabase = await createClient()

  // 1. Provera da li je korisnik ulogovan
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  // 2. Dohvatanje svih upisa (enrollments) za ovog korisnika
  const { data: enrollments, error: enrollError } = await supabase
    .from('enrollments')
    .select('course_id, module_id')
    .eq('user_id', user.id)

  if (enrollError) {
    return <div>Došlo je do greške pri učitavanju kurseva.</div>
  }

  // 3. Filtriranje ID-jeva
  const fullCourseIds = enrollments
    .filter(e => !e.module_id)
    .map(e => e.course_id)
  
  const moduleIds = enrollments
    .filter(e => e.module_id)
    .map(e => e.module_id)

  // 4. Dohvatanje detalja celih kurseva
  let courses = []
  if (fullCourseIds.length > 0) {
    const { data: coursesData } = await supabase
      .from('courses')
      .select('id, title, slug, description')
      .in('id', fullCourseIds)
    if (coursesData) courses = coursesData
  }

  // 5. Dohvatanje detalja pojedinačnih modula (uz povlačenje sluga od parent kursa za linkovanje)
  let modules = []
  if (moduleIds.length > 0) {
    const { data: modulesData } = await supabase
      .from('modules')
      .select('id, title, slug, description, courses(slug)')
      .in('id', moduleIds)
    if (modulesData) modules = modulesData
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Moji kursevi i moduli</h1>
      <p style={{ marginBottom: '30px', color: '#555' }}>Pregled svog sadržaja kom imate pristup.</p>

      {courses.length === 0 && modules.length === 0 && (
        <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
          <p>Trenutno nemate kupljenih kurseva ni modula.</p>
          <Link href="/courses" style={{ color: '#0070f3', fontWeight: 'bold' }}>
            Istražite našu ponudu
          </Link>
        </div>
      )}

      {/* Prikaz celih kurseva */}
      {courses.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h2>Moji Kursevi</h2>
          <hr style={{ margin: '10px 0 20px' }} />
          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {courses.map(course => (
              <div key={course.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                <h3>{course.title}</h3>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                  {course.description?.substring(0, 80)}...
                </p>
                <Link 
                  href={`/course/${course.slug}`}
                  style={{ display: 'inline-block', padding: '8px 16px', background: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '5px' }}
                >
                  Nastavi učenje
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prikaz pojedinačnih modula */}
      {modules.length > 0 && (
        <div>
          <h2>Moji Moduli</h2>
          <hr style={{ margin: '10px 0 20px' }} />
          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {modules.map(mod => (
              <div key={mod.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                <h3>{mod.title}</h3>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                  {mod.description?.substring(0, 80)}...
                </p>
                <Link 
                  href={`/course/${mod.courses?.slug}/module/${mod.slug}`}
                  style={{ display: 'inline-block', padding: '8px 16px', background: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}
                >
                  Pristupi modulu
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}