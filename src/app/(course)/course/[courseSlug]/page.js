import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CourseClient from './CourseClient'

export default async function CourseDetailsPage({ params }) {
  const { courseSlug } = await params
  const supabase = await createClient()

  // Dohvatanje trenutno ulogovanog korisnika
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Dohvatanje detalja o konkretnom kursu
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('id, title, description, price, slug, image_url')
    .eq('slug', courseSlug)
    .single()

  if (courseError || !course) {
    notFound() 
  }

  // 2. Dohvatanje modula
  const { data: modules } = await supabase
    .from('modules')
    .select('id, title, description, slug, order, price, image_url')
    .eq('course_id', course.id)
    .order('order', { ascending: true })

  // 3. Dohvatanje lekcija
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, module_id, title, slug, is_free, lesson_order')
    .eq('course_id', course.id)
    .order('lesson_order', { ascending: true })

  // Grupisanje lekcija po modulu
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
    <CourseClient 
      course={course} 
      modules={modules || []} 
      lessonsByModule={lessonsByModule} 
      userId={user?.id}
    />
  )
}