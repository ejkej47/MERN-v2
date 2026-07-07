import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { toggleLessonComplete } from '@/actions/progress'
import LessonClient from './LessonClient'

export default async function LessonPage({ params }) {
  const { courseSlug, moduleSlug, lessonSlug } = await params
  const supabase = await createClient()

  // 1. Dohvatanje trenutne lekcije i modula
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('*')
    .eq('slug', lessonSlug)
    .single()

  if (lessonError || !lesson) notFound()

  const { data: moduleData } = await supabase
    .from('modules')
    .select('id, title, slug, course_id')
    .eq('slug', moduleSlug)
    .single()

  // 2. Dohvatanje SVIH lekcija iz ovog modula radi navigacije i sidebara
  const { data: allModuleLessons } = await supabase
    .from('lessons')
    .select('id, title, slug, lesson_order, content_type, is_free')
    .eq('module_id', lesson.module_id)
    .order('lesson_order', { ascending: true })

  const currentLessonIndex = allModuleLessons?.findIndex(l => l.id === lesson.id) ?? 0
  const prevLesson = currentLessonIndex > 0 ? allModuleLessons[currentLessonIndex - 1] : null
  const nextLesson = currentLessonIndex < (allModuleLessons?.length - 1) ? allModuleLessons[currentLessonIndex + 1] : null

  // 3. Provera prava pristupa i napretka
  let hasAccess = lesson.is_free
  let isCompleted = false
  let completedLessonIds = [] // Niz za sidebar (koje su lekcije završene)
  
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: progressData } = await supabase
      .from('user_lesson_progress')
      .select('lesson_id, is_completed')
      .eq('user_id', user.id)
      .eq('is_completed', true)

    if (progressData) {
      completedLessonIds = progressData.map(p => p.lesson_id)
      if (completedLessonIds.includes(lesson.id)) isCompleted = true
    }

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

  // Helper za rutu
  const currentPath = `/course/${courseSlug}/module/${moduleSlug}/lesson/${lessonSlug}`
  const toggleAction = toggleLessonComplete.bind(null, lesson.id, isCompleted, currentPath)

  return (
    <LessonClient 
      courseSlug={courseSlug}
      moduleSlug={moduleSlug}
      lesson={lesson}
      moduleTitle={moduleData?.title}
      allModuleLessons={allModuleLessons || []}
      currentLessonIndex={currentLessonIndex}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
      hasAccess={hasAccess}
      isCompleted={isCompleted}
      completedLessonIds={completedLessonIds}
      toggleAction={toggleAction}
      isUserLoggedIn={!!user}
    />
  )
}