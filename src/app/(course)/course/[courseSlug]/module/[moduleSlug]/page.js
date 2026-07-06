import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ModulePage({ params }) {
  const { courseSlug, moduleSlug } = await params
  const supabase = await createClient()

  // 1. Dohvatanje podataka o modulu i kursu
  const { data: moduleData, error: moduleError } = await supabase
    .from('modules')
    .select('*')
    .eq('slug', moduleSlug)
    .single()

  if (moduleError || !moduleData) notFound()

  const { data: courseData } = await supabase
    .from('courses')
    .select('id, title, slug')
    .eq('slug', courseSlug)
    .single()

  // 2. Dohvatanje lekcija za ovaj modul
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, slug, is_free, lesson_order')
    .eq('module_id', moduleData.id)
    .order('lesson_order', { ascending: true })

  const lessonIds = lessons?.map(l => l.id) || []
  const totalLessons = lessonIds.length

  // 3. Provera pristupa i napretka
  const { data: { user } } = await supabase.auth.getUser()
  let hasAccess = false
  let completedLessonsCount = 0

  if (user) {
    // Provera pristupa (kurs ili modul)
    const { data: courseEnrollment } = await supabase
      .from('enrollments')
      .select('id').eq('user_id', user.id).eq('course_id', courseData.id).maybeSingle()

    if (courseEnrollment) {
      hasAccess = true
    } else {
      const { data: moduleAccess } = await supabase
        .from('user_module_access')
        .select('user_id').eq('user_id', user.id).eq('module_id', moduleData.id).maybeSingle()
      if (moduleAccess) hasAccess = true
    }

    // Računanje napretka: koliko lekcija iz ovog modula je korisnik završio
    if (totalLessons > 0) {
      const { data: progressData } = await supabase
        .from('user_lesson_progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .in('lesson_id', lessonIds)
        .eq('is_completed', true)

      completedLessonsCount = progressData?.length || 0
    }
  }

  // Matematika za progress bar
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0

  return (
    <div style={{ padding: '20px' }}>
      <Link href={`/course/${courseSlug}`}>← Nazad na kurs: {courseData?.title}</Link>
      
      <h1 style={{ marginTop: '20px' }}>Modul: {moduleData.title}</h1>
      <p>{moduleData.description}</p>
      
      <div style={{ background: '#f5f5f5', padding: '15px', marginTop: '20px', borderRadius: '8px' }}>
        <p><strong>Cena modula:</strong> {moduleData.price === 0 ? 'Besplatno' : `${moduleData.price} RSD`}</p>
        
        {!hasAccess ? (
          <div style={{ marginTop: '15px' }}>
            <p style={{ color: '#d9534f', fontWeight: 'bold' }}>Nemate pristup ovom modulu.</p>
            <button style={{ padding: '8px 16px', marginRight: '10px' }} disabled>Kupi modul ({moduleData.price} RSD)</button>
            <button style={{ padding: '8px 16px' }} disabled>Kupi ceo kurs</button>
          </div>
        ) : (
          <p style={{ color: '#5cb85c', fontWeight: 'bold', marginTop: '10px' }}>✓ Imate pristup ovom modulu.</p>
        )}
      </div>

      {/* Traka za napredak */}
      {user && totalLessons > 0 && (
        <div style={{ marginTop: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Vaš napredak u modulu</h3>
          <p>{completedLessonsCount} od {totalLessons} lekcija završeno ({progressPercentage}%)</p>
          <div style={{ width: '100%', background: '#e0e0e0', height: '10px', borderRadius: '5px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercentage}%`, background: '#28a745', height: '100%', transition: 'width 0.3s ease' }}></div>
          </div>
        </div>
      )}

      <hr style={{ margin: '30px 0' }} />

      <h2>Lekcije u ovom modulu</h2>
      {totalLessons === 0 ? (
        <p>Nema unetih lekcija u ovom modulu.</p>
      ) : (
        <ul>
          {lessons.map((lesson) => (
            <li key={lesson.id} style={{ marginBottom: '10px' }}>
              <Link href={`/course/${courseSlug}/module/${moduleSlug}/lesson/${lesson.slug}`}>
                {lesson.title} {lesson.is_free && <span style={{ color: 'green' }}>(Besplatno)</span>}
                {!lesson.is_free && !hasAccess && <span style={{ color: 'red' }}> 🔒 (Zaključano)</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}