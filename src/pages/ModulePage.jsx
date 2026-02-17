// src/pages/ModulePage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// Komponente
import ModuleHero from "../components/Module/ModuleHero";
import ModuleTabs from "../components/Module/ModuleTabs";
import ModuleOverview from "../components/Module/ModuleOverview";
import ModuleLessons from "../components/Module/ModuleLessons";

export default function ModulePage() {
  const { courseSlug, moduleSlug } = useParams(); 
  const navigate = useNavigate();
  const { user } = useAuth();

  const [module, setModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    async function fetchModuleData() {
      if (!moduleSlug) return;
      try {
        setLoading(true);
        const { data: modData, error: modError } = await supabase
          .from("modules")
          .select("*, courses!inner(id, slug, title)")
          .eq("slug", moduleSlug)
          .maybeSingle();

        if (modError) throw modError;
        if (!modData) {
          toast.error("Modul nije pronađen.");
          return;
        }
        setModule(modData);

        const { data: lessonsData, error: lessonsError } = await supabase
          .from("lessons")
          .select("*")
          .eq("module_id", modData.id)
          .order("lesson_order", { ascending: true });

        if (lessonsError) throw lessonsError;
        setLessons(lessonsData || []);

        if (user) {
          const { data: enrollment } = await supabase
            .from("enrollments")
            .select("id")
            .eq("user_id", user.id)
            .eq("course_id", modData.courses.id)
            .or(`module_id.is.null,module_id.eq.${modData.id}`)
            .maybeSingle();
          if (enrollment) setIsPurchased(true);
        }
      } catch (err) {
        console.error("Greška:", err.message);
        toast.error("Greška pri učitavanju podataka.");
      } finally {
        setLoading(false);
      }
    }
    fetchModuleData();
  }, [moduleSlug, user]);

  // Filtriranje lekcija za različite tabove
  const videoLessons = useMemo(() => lessons.filter(l => l.content_type === "video" || !l.type), [lessons]);
  const quizLessons = useMemo(() => lessons.filter(l => l.content_type === "quiz"), [lessons]);
  const exerciseLessons = useMemo(() => lessons.filter(l => l.content_type === "exercise"), [lessons]);

  if (loading) return <div className="p-20 text-center text-accent animate-pulse">Učitavanje...</div>;
  if (!module) return <div className="p-20 text-center text-text">Modul nije pronađen.</div>;

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <Link to={`/course/${courseSlug}`} className="text-accent hover:underline text-sm mb-6 inline-block">
        ← Nazad na kurs
      </Link>

      <ModuleHero
        module={{ ...module, isPurchased, lessonsCount: lessons.length }}
        onContinue={() => {
          if (lessons.length > 0) {
            navigate(`/course/${courseSlug}/module/${moduleSlug}/lesson/${lessons[0].id}`);
          }
        }}
      />

      <ModuleTabs 
        active={activeTab} 
        onChange={setActiveTab} 
        tabs={[
          { id: "overview", label: "Pregled" },
          { id: "lessons", label: "Lekcije", count: videoLessons.length },
          { id: "practice", label: "Vežbe & Kvizovi", count: quizLessons.length + exerciseLessons.length }
        ]}
      />

      <section className="mt-6">
        {activeTab === "overview" && <ModuleOverview module={module} />}
        
        {activeTab === "lessons" && (
          <ModuleLessons 
            courseSlug={courseSlug}
            moduleSlug={moduleSlug} 
            lessons={videoLessons} 
            purchased={isPurchased} 
            onPickLesson={(l) => navigate(`/course/${courseSlug}/module/${moduleSlug}/lesson/${l.slug}`)}
          />
        )}

        {activeTab === "practice" && (
          <div className="space-y-12">
            {/* KVIZOVI SEKCIJA */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">📝</span>
                <h3 className="text-xl font-bold text-text">Kvizovi</h3>
              </div>
              {quizLessons.length > 0 ? (
                <ModuleLessons 
                  courseSlug={courseSlug}
                  moduleSlug={moduleSlug} 
                  lessons={quizLessons} 
                  purchased={isPurchased} 
                  onPickLesson={(l) => navigate(`/course/${courseSlug}/module/${moduleSlug}/lesson/${l.id}`)}
                />
              ) : (
                <p className="text-muted italic">Nema dostupnih kvizova za ovaj modul.</p>
              )}
            </div>

            {/* VEŽBE SEKCIJA */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🧩</span>
                <h3 className="text-xl font-bold text-text">Praktične Vežbe</h3>
              </div>
              {exerciseLessons.length > 0 ? (
                <ModuleLessons 
                  courseSlug={courseSlug}
                  moduleSlug={moduleSlug} 
                  lessons={exerciseLessons} 
                  purchased={isPurchased} 
                  onPickLesson={(l) => navigate(`/course/${courseSlug}/module/${moduleSlug}/lesson/${l.id}`)}
                />
              ) : (
                <p className="text-muted italic">Nema dostupnih vežbi za ovaj modul.</p>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}