// src/pages/LessonPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// Komponente
import ModuleLessons from "../components/Module/ModuleLessons";
import LoadingSpinner from "../components/QoL/LoadingSpinner";

export default function LessonPage() {
  const { courseSlug, moduleSlug, lessonSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    async function fetchLessonData() {
      try {
        setLoading(true);

        // 1. Dohvatanje trenutne lekcije preko slug-a
        const { data: lessonData, error: lessonErr } = await supabase
          .from("lessons")
          .select("*, modules!inner(id, title, courses!inner(id))")
          .eq("slug", lessonSlug)
          .maybeSingle();

        if (lessonErr) throw lessonErr;
        if (!lessonData) {
          toast.error("Lekcija nije pronađena.");
          return navigate(`/course/${courseSlug}/module/${moduleSlug}`);
        }

        setLesson(lessonData);
        setModule(lessonData.modules);

        // 2. Dohvatanje svih lekcija iz tog modula za sidebar
        const { data: allLessons } = await supabase
          .from("lessons")
          .select("*")
          .eq("module_id", lessonData.module_id)
          .order("lesson_order", { ascending: true });

        setLessons(allLessons || []);

        // 3. Provera pristupa (isto kao u ModulePage da izbegnemo 406 grešku)
        if (user) {
          const { data: fullAccess } = await supabase
            .from("enrollments")
            .select("id")
            .eq("user_id", user.id)
            .eq("course_id", lessonData.modules.courses.id)
            .is("module_id", null)
            .maybeSingle();

          if (fullAccess) {
            setIsPurchased(true);
          } else {
            const { data: moduleAccess } = await supabase
              .from("enrollments")
              .select("id")
              .eq("user_id", user.id)
              .eq("module_id", lessonData.module_id)
              .maybeSingle();

            if (moduleAccess) setIsPurchased(true);
          }
        }
      } catch (err) {
        console.error("Greška:", err.message);
        toast.error("Greška pri učitavanju lekcije.");
      } finally {
        setLoading(false);
      }
    }

    if (lessonSlug) fetchLessonData();
  }, [lessonSlug, user, courseSlug, moduleSlug, navigate]);

  // Logika za navigaciju (Prethodna / Sledeća)
  const sortedLessons = useMemo(() => {
    return [...lessons].sort((a, b) => (a.lesson_order ?? 0) - (b.lesson_order ?? 0));
  }, [lessons]);

  const currentIndex = sortedLessons.findIndex((l) => l.id === lesson?.id);
  
  const goNext = () => {
    const next = sortedLessons[currentIndex + 1];
    if (next) navigate(`/course/${courseSlug}/module/${moduleSlug}/lesson/${next.slug}`);
  };

  const goPrev = () => {
    const prev = sortedLessons[currentIndex - 1];
    if (prev) navigate(`/course/${courseSlug}/module/${moduleSlug}/lesson/${prev.slug}`);
  };

  if (loading) return <LoadingSpinner className="h-screen" />;
  if (!lesson) return null;

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="mx-auto max-w-[1600px] px-4 py-6">
        
        {/* Breadcrumbs / Back button */}
        <div className="mb-6">
          <Link 
            to={`/course/${courseSlug}/module/${moduleSlug}`}
            className="text-accent hover:underline text-sm font-medium"
          >
            ← Nazad na modul: {module?.title}
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEVA STRANA: Video i Sadržaj */}
          <div className="flex-1 space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold">{lesson.title}</h1>
            
            {/* Video Player Placeholder */}
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-borderSoft bg-surface shadow-2xl">
              {lesson.content_type === "video" ? (
                <div className="flex h-full items-center justify-center bg-black/20 text-muted italic">
                  {/* Ovde će ići tvoj iframe ili video player na osnovu lesson.path */}
                  Video plejer za: {lesson.title}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-accent">
                  {lesson.content_type === "quiz" ? "📝 Kviz" : "🧩 Vežba"}
                </div>
              )}
            </div>

            {/* Navigacija lekcija */}
            <div className="flex justify-between items-center bg-surface p-4 rounded-xl border border-borderSoft">
              <button 
                onClick={goPrev} 
                disabled={currentIndex <= 0}
                className="px-4 py-2 rounded-lg bg-background hover:bg-borderSoft disabled:opacity-30 transition font-medium"
              >
                ← Prethodna
              </button>
              <span className="text-sm text-muted">
                Lekcija {currentIndex + 1} od {sortedLessons.length}
              </span>
              <button 
                onClick={goNext} 
                disabled={currentIndex >= sortedLessons.length - 1}
                className="px-4 py-2 rounded-lg bg-accent text-black font-bold hover:opacity-90 disabled:opacity-30 transition"
              >
                Sledeća →
              </button>
            </div>

            {/* Tekstualni sadržaj */}
            <div className="bg-surface p-6 rounded-2xl border border-borderSoft">
              <h3 className="text-xl font-bold mb-4">O ovoj lekciji</h3>
              <div className="prose prose-invert max-w-none text-mutedSoft whitespace-pre-wrap">
                {lesson.content || "Nema dodatnog opisa za ovu lekciju."}
              </div>
            </div>
          </div>

          {/* DESNA STRANA: Sidebar sa lekcijama */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="sticky top-24">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>📚</span> Sadržaj modula
              </h3>
              <ModuleLessons 
                courseSlug={courseSlug}
                moduleSlug={moduleSlug}
                lessons={lessons}
                purchased={isPurchased}
                onPickLesson={(l) => navigate(`/course/${courseSlug}/module/${moduleSlug}/lesson/${l.slug}`)}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}