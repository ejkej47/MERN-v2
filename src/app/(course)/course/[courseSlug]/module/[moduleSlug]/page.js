import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ModuleClient from './ModuleClient'

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

  // 2. Dohvatanje lekcija za ovaj modul (dodat content_type)
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, slug, is_free, lesson_order, content_type')
    .eq('module_id', moduleData.id)
    .order('lesson_order', { ascending: true })

  const lessonIds = lessons?.map(l => l.id) || []
  const totalLessons = lessonIds.length

  // 3. Provera pristupa i napretka
  const { data: { user } } = await supabase.auth.getUser()
  let hasAccess = false
  let completedLessonsCount = 0

  if (user) {
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

  const progressPercentage = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0

  // 4. Prosleđivanje podataka Klijentskoj Komponenti
  return (
    <ModuleClient 
      course={courseData}
      module={moduleData}
      lessons={lessons || []}
      hasAccess={hasAccess}
      progressPercentage={progressPercentage}
      completedLessonsCount={completedLessonsCount}
    />
  )
}