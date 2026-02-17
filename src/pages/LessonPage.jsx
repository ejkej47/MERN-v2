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

        const { data: allLessons } = await supabase
          .from("lessons")
          .select("*")
          .eq("module_id", lessonData.module_id)
          .order("lesson_order", { ascending: true });

        setLessons(allLessons || []);

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
      <div className="mx-auto max-w-[1600px] px-4 py-8">
        
        {/* VEĆI I JASNIJI BREADCRUMB */}
        <div className="mb-8">
          <Link 
            to={`/course/${courseSlug}/module/${moduleSlug}`}
            className="text-accent hover:text-accent-hover text-lg font-bold flex items-center gap-2 transition-colors"
          >
            <span className="text-2xl">←</span> Nazad na modul: {module?.title}
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* OBJEDINJENI SIDEBAR */}
          <div className="w-full lg:w-80 shrink-0 sticky top-24 order-2 lg:order-1">
            <div className="rounded-2xl border border-borderSoft bg-surface overflow-hidden shadow-sm">
              <div className="p-5 border-b border-borderSoft bg-background/50">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span>📚</span> Sadržaj modula
                </h3>
              </div>
              <ModuleLessons 
                courseSlug={courseSlug}
                moduleSlug={moduleSlug}
                lessons={lessons}
                purchased={isPurchased}
                onPickLesson={(l) => navigate(`/course/${courseSlug}/module/${moduleSlug}/lesson/${l.slug}`)}
              />
            </div>
          </div>

          {/* GLAVNI SADRŽAJ */}
          <div className="flex-1 space-y-6 order-1 lg:order-2 w-full">

          {/* NAVIGACIJA SA FIKSNIM REDOSLEDOM NA DESKTOPU I BOLJIM NASLOVOM NA MOBILNOM */}
          <div className="relative overflow-hidden bg-surface rounded-2xl border border-borderSoft shadow-sm">
            
            {/* PROGRES BAR - uvek na dnu kontejnera */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-background">
              <div 
                className="h-full bg-accent transition-all duration-700 ease-out shadow-[0_0_8px_rgba(var(--color-accent-rgb),0.5)]" 
                style={{ width: `${((currentIndex + 1) / sortedLessons.length) * 100}%` }}
              />
            </div>

            {/* Grid layout: 1 kolona na mobilnom, 3 kolone na desktopu */}
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_200px] items-center p-5 pb-7 md:p-6 md:pb-7 gap-4">
              
              {/* 1. DUGME PRETHODNA - Na mobilnom ide u red sa Sledeća (vidi dole) */}
              <div className="hidden md:block">
                <button 
                  onClick={goPrev} 
                  disabled={currentIndex <= 0}
                  className="w-full px-6 py-2.5 rounded-xl bg-background hover:bg-borderSoft disabled:opacity-30 transition font-bold border border-borderSoft text-sm"
                >
                  ← Prethodna
                </button>
              </div>
              
              {/* 2. NASLOV I BROJAČ - Centralna pozicija na oba uređaja */}
              <div className="text-center min-w-0">
                <h1 className="text-xl md:text-2xl font-black leading-tight text-text tracking-tight break-words">
                  {lesson.title}
                </h1>
                <div className="mt-1.5 flex items-center justify-center gap-2 opacity-60">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted">
                    Lekcija {currentIndex + 1} <span className="mx-1 text-muted/30">/</span> {sortedLessons.length}
                  </span>
                </div>
              </div>

              {/* 3. DUGME SLEDEĆA - Vidljivo samo na desktopu u gridu */}
              <div className="hidden md:block">
                <button 
                  onClick={goNext} 
                  disabled={currentIndex >= sortedLessons.length - 1}
                  className="w-full px-6 py-2.5 rounded-xl bg-accent text-black font-black hover:opacity-90 disabled:opacity-30 transition shadow-lg shadow-accent/20 text-sm"
                >
                  Sledeća →
                </button>
              </div>

              {/* 4. MOBILNA DUGMAD - Prikazuju se jedno pored drugog samo na malim ekranima */}
              <div className="flex md:hidden w-full gap-4 mt-2">
                <button 
                  onClick={goPrev} 
                  disabled={currentIndex <= 0}
                  className="flex-1 px-4 py-3 rounded-xl bg-background font-bold border border-borderSoft text-sm"
                >
                  ← Prethodna
                </button>
                <button 
                  onClick={goNext} 
                  disabled={currentIndex >= sortedLessons.length - 1}
                  className="flex-1 px-4 py-3 rounded-xl bg-accent text-black font-bold shadow-lg shadow-accent/20 text-sm"
                >
                  Sledeća →
                </button>
              </div>

            </div>
          </div>
  {/* GRADIIJENTNI OKVIR SA MEDJUBOJOM (MAGENTA/PINK) */}
  <div className="relative group p-[10px] rounded-[2rem]
  bg-gradient-to-br
  from-primary
  via-[#3B82F6]/15 
  to-accent 
  shadow-2xl shadow-primary/20">
    
  {/* Unutrašnji kontejner koji drži video */}
  <div className="aspect-video w-full overflow-hidden rounded-[1.85rem] bg-black relative z-10">
    {lesson.content_type === "video" ? (
      lesson.path ? (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${lesson.path}?rel=0&modestbranding=1&iv_load_policy=3`}
          title={lesson.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <div className="flex h-full items-center justify-center text-muted italic p-8 text-center">
          Video ID nije unet u bazu (kolona 'path').
        </div>
      )
    ) : (
      <div className="flex h-full flex-col items-center justify-center bg-background/90 text-accent gap-4">
        <div className="text-6xl animate-bounce">
          {lesson.content_type === "quiz" ? "📝" : "🧩"}
        </div>
        <h2 className="text-2xl font-black uppercase tracking-widest text-text">
          {lesson.content_type === "quiz" ? "Kviz" : "Vežba"}
        </h2>
      </div>
    )}
  </div>

  {/* SJAJ (GLOW) KOJI PRATI GRADIJENT */}
  <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary via-[#ff00ff] to-accent blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
</div>

            {/* OPIS LEKCIJE */}
            <div className="bg-surface p-8 rounded-3xl border border-borderSoft shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-1.5 bg-accent rounded-full" />
                <h3 className="text-2xl font-black tracking-tight">O OVOJ LEKCIJI</h3>
              </div>
              <div className="prose prose-invert max-w-none text-mutedSoft whitespace-pre-wrap leading-relaxed text-lg">
                {lesson.content || "Nema dodatnog opisa za ovu lekciju."}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}