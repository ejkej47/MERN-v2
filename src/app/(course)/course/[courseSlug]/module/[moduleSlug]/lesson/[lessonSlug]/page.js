import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { toggleLessonComplete } from '@/actions/progress'

export default async function LessonPage({ params }) {
  const { courseSlug, moduleSlug, lessonSlug } = await params
  const supabase = await createClient()

  // 1. Dohvatanje trenutne lekcije
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('*')
    .eq('slug', lessonSlug)
    .single()

  if (lessonError || !lesson) notFound()

  // 2. Dohvatanje SVIH lekcija iz ovog modula radi navigacije (Prethodna/Sledeća)
  const { data: allModuleLessons } = await supabase
    .from('lessons')
    .select('id, title, slug, lesson_order')
    .eq('module_id', lesson.module_id)
    .order('lesson_order', { ascending: true })

  // Računanje indeksa za navigaciju
  const currentLessonIndex = allModuleLessons?.findIndex(l => l.id === lesson.id) ?? 0
  const prevLesson = currentLessonIndex > 0 ? allModuleLessons[currentLessonIndex - 1] : null
  const nextLesson = currentLessonIndex < (allModuleLessons?.length - 1) ? allModuleLessons[currentLessonIndex + 1] : null

  // 3. Provera prava pristupa i napretka (ako je korisnik ulogovan)
  let hasAccess = lesson.is_free
  let isCompleted = false
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Provera napretka (da li je lekcija već završena)
    const { data: progress } = await supabase
      .from('user_lesson_progress')
      .select('is_completed')
      .eq('user_id', user.id)
      .eq('lesson_id', lesson.id)
      .maybeSingle()
      
    if (progress?.is_completed) isCompleted = true

    // Provera prava pristupa (ako nije besplatna)
    if (!lesson.is_free) {
      const { data: courseEnrollment } = await supabase
        .from('enrollments')
        .select('id').eq('user_id', user.id).eq('course_id', lesson.course_id).maybeSingle()
      
      if (courseEnrollment) {
        hasAccess = true
      } else {
        const { data: moduleAccess } = await supabase
          .from('user_module_access')
          .select('user_id').eq('user_id', user.id).eq('module_id', lesson.module_id).maybeSingle()
        if (moduleAccess) hasAccess = true
      }
    }
  }

  // Helper za rutu kako bi Server Action znao šta da osveži
  const currentPath = `/course/${courseSlug}/module/${moduleSlug}/lesson/${lessonSlug}`
  
  // Binding funkcije za formu
  const toggleAction = toggleLessonComplete.bind(null, lesson.id, isCompleted, currentPath)

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link href={`/course/${courseSlug}/module/${moduleSlug}`}>
          ← Nazad na modul
        </Link>
      </div>

      <h1>{lesson.title}</h1>
      {isCompleted && (
        <span style={{ display: 'inline-block', background: '#d4edda', color: '#155724', padding: '5px 10px', borderRadius: '5px', marginBottom: '20px', fontWeight: 'bold' }}>
          ✓ Lekcija završena
        </span>
      )}

      <hr style={{ margin: '20px 0' }} />

      {hasAccess ? (
        <div>
          {/* Sadržaj lekcije */}
          {lesson.content_type === 'video' && lesson.path && (
            <div style={{ background: '#000', color: '#fff', padding: '50px', textAlign: 'center', marginBottom: '20px' }}>
              <p>Video Player: {lesson.path}</p>
            </div>
          )}
          <div dangerouslySetInnerHTML={{ __html: lesson.content }} style={{ lineHeight: '1.6' }} />

          {/* Forma za čekiranje napretka - radi bez JS na klijentu! */}
          {user && (
            <form action={toggleAction} style={{ marginTop: '40px', padding: '20px', background: '#f9f9f9', borderRadius: '8px', textAlign: 'center' }}>
              <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', background: isCompleted ? '#dc3545' : '#28a745', color: '#fff', border: 'none', borderRadius: '5px' }}>
                {isCompleted ? 'Poništi završetak ❌' : 'Označi kao završeno ✓'}
              </button>
            </form>
          )}

        </div>
      ) : (
        <div style={{ background: '#f8d7da', color: '#721c24', padding: '30px', borderRadius: '8px', textAlign: 'center' }}>
          <h2>Ova lekcija je zaključana 🔒</h2>
          <p style={{ marginBottom: '20px' }}>Da biste pristupili ovom sadržaju, potrebno je da kupite odgovarajući modul ili ceo kurs.</p>
          
          <Link 
            href={`/course/${courseSlug}`}
            style={{ 
              display: 'inline-block', 
              padding: '10px 20px', 
              background: '#dc3545', 
              color: '#fff', 
              textDecoration: 'none', 
              borderRadius: '5px',
              fontWeight: 'bold'
            }}
          >
            Idi na stranicu za kupovinu
          </Link>
        </div>
      )}

      {/* Navigacija Prethodna / Sledeća */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
        <div>
          {prevLesson && (
            <Link href={`/course/${courseSlug}/module/${moduleSlug}/lesson/${prevLesson.slug}`}>
              ← Prethodna: {prevLesson.title}
            </Link>
          )}
        </div>
        <div>
          {nextLesson && (
            <Link href={`/course/${courseSlug}/module/${moduleSlug}/lesson/${nextLesson.slug}`}>
              Sledeća: {nextLesson.title} →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}