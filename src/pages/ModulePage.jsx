import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// Zadrži svoje postojeće komponente
import ModuleHero from "../components/Module/ModuleHero";
import ModuleTabs from "../components/Module/ModuleTabs";
import ModuleOverview from "../components/Module/ModuleOverview";
import ModuleLessons from "../components/Module/ModuleLessons";
import ModulePractice from "../components/Module/ModulePractice";
import ModuleReviews from "../components/Module/ModuleReviews";

export default function ModulePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [module, setModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [purchased, setPurchased] = useState(false);

  const fetchModule = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Dohvati modul po slug-u
      const { data: modData, error: modError } = await supabase
        .from("modules")
        .select("*, courses(slug)") // Join sa kursom da dobijemo course_slug
        .eq("slug", slug)
        .single();

      if (modError) throw modError;
      setModule(modData);

      // 2. Dohvati lekcije za taj modul
      const { data: lessonsData } = await supabase
        .from("lessons")
        .select("*")
        .eq("module_id", modData.id)
        .order("order", { ascending: true });

      setLessons(lessonsData || []);

      // 3. Proveri da li je korisnik kupio ovaj modul (tabela user_module_access)
      if (user) {
        const { data: access } = await supabase
          .from("user_module_access")
          .select("*")
          .eq("user_id", user.id)
          .eq("module_id", modData.id)
          .single();
        
        setPurchased(!!access);
      }
    } catch (err) {
      console.error("Greška:", err.message);
      toast.error("Modul nije pronađen.");
    } finally {
      setLoading(false);
    }
  }, [slug, user]);

  useEffect(() => {
    fetchModule();
  }, [fetchModule]);

  // Logika za nastavak učenja ostaje slična
  const handleContinue = () => {
    const lastId = localStorage.getItem(`lastLesson-module-${slug}`);
    const to = lastId ? `/lesson/${lastId}` : lessons[0] ? `/lesson/${lessons[0].id}` : null;
    if (to) navigate(to);
  };

  if (loading) return <div className="p-10 text-center">Učitavanje...</div>;

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      {module?.courses?.slug && (
        <Link to={`/course/${module.courses.slug}`} className="text-accent hover:underline text-sm">
          ← Nazad na kurs
        </Link>
      )}

      <ModuleHero
        module={{ ...module, isPurchased: purchased, lessonsCount: lessons.length }}
        onPurchase={() => navigate("/checkout", { state: { moduleId: module.id } })}
        onContinue={handleContinue}
      />

      <ModuleTabs active={activeTab} onChange={setActiveTab} />

      <section className="mt-6">
        {activeTab === "overview" && <ModuleOverview module={module} />}
        {activeTab === "lessons" && (
          <ModuleLessons 
            moduleSlug={slug} 
            lessons={lessons} 
            purchased={purchased} 
            onPickLesson={(l) => navigate(`/lesson/${l.id}`)}
          />
        )}
      </section>
    </div>
  );
}