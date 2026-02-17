// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { User as UserIcon, BookOpen, Settings } from "lucide-react";

export default function ProfilePage() {
  // Izvlačimo 'profile' koji sadrži avatar_url i full_name
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("courses");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    async function fetchMyCourses() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("enrollments")
          .select(`
            id,
            courses (
              id,
              title,
              slug,
              image_url,
              description
            )
          `)
          .eq("user_id", user.id);

        if (error) throw error;
        
        const userCourses = data.map((item) => item.courses).filter(Boolean);
        setCourses(userCourses);
      } catch (err) {
        console.error("Greška pri dohvatu kurseva:", err.message);
        toast.error("Nije moguće učitati vaše kurseve.");
      } finally {
        setLoading(false);
      }
    }

    fetchMyCourses();
  }, [user, navigate]);

  const renderRightSection = () => {
    if (loading) return <div className="p-10 text-center animate-pulse text-muted">Učitavanje podataka...</div>;

    switch (activeSection) {
      case "courses":
        return (
          <div className="space-y-4">
            {courses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-borderSoft p-10 text-center bg-surface/30">
                <p className="text-muted mb-4">Još uvek niste upisali nijedan kurs.</p>
                <Link to="/courses" className="text-accent font-semibold hover:underline">
                  Pretraži katalog kurseva →
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => navigate(`/course/${course.slug}`)}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-borderSoft bg-surface/50 transition hover:border-accent hover:shadow-xl"
                  >
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={course.image_url}
                        alt={course.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-text group-hover:text-accent transition">{course.title}</h4>
                      <p className="mt-1 text-xs text-mutedSoft">Nastavi sa učenjem</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "settings":
        return (
          <div className="rounded-2xl border border-borderSoft bg-surface/50 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-text mb-1">Informacije o nalogu</h3>
              <p className="text-sm text-mutedSoft">Vaši podaci su sinhronizovani sa Google-om.</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">Email adresa</span>
                <span className="text-text font-medium">{user?.email}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">Ime i prezime</span>
                <span className="text-text font-medium">{profile?.full_name || "Nije podešeno"}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-borderSoft">
              <button 
                onClick={() => toast.success("Link za promenu lozinke je poslat na vaš email!")}
                className="rounded-xl bg-background px-5 py-2.5 text-sm font-semibold text-text border border-borderSoft hover:border-accent transition-all"
              >
                Promeni lozinku
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* LEVA KOLONA: Profilna karta */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="overflow-hidden rounded-3xl border border-borderSoft bg-surface shadow-2xl">
            <div className="p-8 text-center bg-gradient-to-b from-accent/5 to-transparent">
              <div className="relative mx-auto mb-6 h-24 w-24">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url}
                    alt="Avatar"
                    referrerPolicy="no-referrer"
                    className="h-full w-full rounded-full object-cover ring-4 ring-background shadow-2xl"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-accent/10 text-3xl font-bold text-accent">
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-green-500 border-4 border-surface" title="Online" />
              </div>
              
              <h2 className="text-xl font-bold text-text mb-1 truncate">
                {profile?.full_name || user?.email?.split('@')[0]}
              </h2>
              <p className="text-sm font-medium text-accent italic">Premium Član</p>
            </div>

            <nav className="p-4 pt-0 space-y-1">
              <button
                className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeSection === "courses"
                    ? "bg-accent text-black shadow-lg shadow-accent/20"
                    : "text-mutedSoft hover:bg-background hover:text-text"
                }`}
                onClick={() => setActiveSection("courses")}
              >
                <BookOpen size={18} />
                Moji Kursevi
              </button>
              <button
                className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeSection === "settings"
                    ? "bg-accent text-black shadow-lg shadow-accent/20"
                    : "text-mutedSoft hover:bg-background hover:text-text"
                }`}
                onClick={() => setActiveSection("settings")}
              >
                <Settings size={18} />
                Podešavanja
              </button>
            </nav>
          </div>
        </div>

        {/* DESNA KOLONA: Glavni sadržaj */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-text tracking-tight uppercase">
              {activeSection === "courses" ? "Pregled Kurseva" : "Moj Nalog"}
            </h1>
            <div className="h-1.5 w-20 bg-accent mt-2 rounded-full" />
          </div>
          
          {renderRightSection()}
        </div>

      </div>
    </div>
  );
}