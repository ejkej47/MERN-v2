import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import MockCheckoutButton from '@/components/course/MockCheckoutButton' // Importuj dugme

export default async function CourseDetailsPage({ params }) {
  const { courseSlug } = await params
  const supabase = await createClient()

  // Dohvatanje trenutno ulogovanog korisnika (neophodno za kupovinu)
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Dohvatanje detalja o konkretnom kursu
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('id, title, description, price, slug')
    .eq('slug', courseSlug)
    .single()

  if (courseError || !course) {
    notFound() 
  }

  // 2. Dohvatanje modula
  const { data: modules, error: modulesError } = await supabase
    .from('modules')
    .select('id, title, description, slug, order, price') // Dodali smo i price za modul
    .eq('course_id', course.id)
    .order('order', { ascending: true })

  // 3. Dohvatanje lekcija
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id, module_id, title, slug, is_free, lesson_order')
    .eq('course_id', course.id)
    .order('lesson_order', { ascending: true })

  const lessonsByModule = {}
  if (lessons) {
    lessons.forEach((lesson) => {
      if (!lessonsByModule[lesson.module_id]) {
        lessonsByModule[lesson.module_id] = []
      }
      lessonsByModule[lesson.module_id].push(lesson)
    })
  }

  return (
    <div style={{ padding: '20px' }}>
      <Link href="/courses">← Nazad na sve kurseve</Link>
      
      <h1 style={{ marginTop: '20px' }}>{course.title}</h1>
      <p>{course.description}</p>
      <p>
        <strong>Cena celog kursa:</strong> {course.price === 0 ? 'Besplatno' : `${course.price} RSD`}
      </p>
      
      {/* Dugme za kupovinu CELOG kursa */}
      <MockCheckoutButton 
        userId={user?.id} 
        courseId={course.id} 
        buttonText={`Kupi ceo kurs za ${course.price} RSD`} 
      />
      
      <hr style={{ margin: '30px 0' }} />
      
      <h2>Program kursa</h2>
      {modulesError || !modules || modules.length === 0 ? (
        <p>Trenutno nema unetih modula za ovaj kurs.</p>
      ) : (
        <ul>
          {modules.map((mod) => {
            const moduleLessons = lessonsByModule[mod.id] || []
            
            return (
              <li key={mod.id} style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc' }}>
                <h3>{mod.title}</h3>
                <p>{mod.description}</p>
                <p><strong>Cena modula:</strong> {mod.price || 0} RSD</p>
                
                {/* Dugme za kupovinu POJEDINAČNOG modula */}
                <MockCheckoutButton 
                  userId={user?.id} 
                  courseId={course.id} 
                  moduleId={mod.id}
                  buttonText={`Kupi samo ovaj modul`} 
                />
                
                <h4 style={{ marginTop: '15px' }}>Lekcije unutar modula:</h4>
                {moduleLessons.length === 0 ? (
                  <p style={{ color: 'gray' }}>Nema dodatih lekcija u ovom modulu.</p>
                ) : (
                  <ul>
                    {moduleLessons.map((lesson) => (
                      <li key={lesson.id} style={{ marginBottom: '5px' }}>
                        <Link href={`/course/${course.slug}/module/${mod.slug}/lesson/${lesson.slug}`}>
                          {lesson.title} {lesson.is_free && <span style={{ color: 'green' }}>(Besplatno)</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}