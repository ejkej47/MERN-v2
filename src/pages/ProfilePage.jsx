import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user } = useAuth();
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
        // Pretpostavka: tabela 'enrollments' povezuje user_id i course_id
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
        
        // Čistimo podatke da dobijemo niz objekata kurseva
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
    if (loading) return <p className="p-4 text-muted">Učitavanje...</p>;

    switch (activeSection) {
      case "courses":
        return (
          <div className="space-y-4">
            {courses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-borderSoft p-10 text-center">
                <p className="text-muted mb-4">Nemate upisanih kurseva.</p>
                <Link to="/courses" className="text-accent font-semibold hover:underline">
                  Pretraži ponudu →
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => navigate(`/course/${course.slug}`)}
                    className="group cursor-pointer overflow-hidden rounded-xl border border-borderSoft bg-background transition hover:border-accent hover:shadow-md"
                  >
                    <div className="aspect-video w-full bg-surface">
                      <img
                        src={course.image_url}
                        alt={course.title}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-text">{course.title}</h4>
                      <p className="mt-1 text-xs text-mutedSoft line-clamp-1">
                        Nastavi tamo gde si stao
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "settings":
        return (
          <div className="rounded-xl border border-borderSoft bg-background p-6">
            <h3 className="mb-4 text-lg font-bold text-text">Podešavanja naloga</h3>
            <p className="text-sm text-muted mb-4">Ulogovani ste kao: <strong>{user?.email}</strong></p>
            <button 
              onClick={() => toast.error("Funkcija promene lozinke se podešava u Supabase dashboardu.")}
              className="rounded-lg bg-surface px-4 py-2 text-sm font-medium text-text border border-borderSoft hover:bg-background transition"
            >
              Resetuj lozinku putem mejla
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto flex min-h-screen flex-col gap-8 px-4 py-10 lg:flex-row">
      {/* Leva kolona - Sidebar */}
      <div className="w-full lg:w-1/3">
        <div className="overflow-hidden rounded-2xl border border-borderSoft bg-surface shadow-sm">
          <div className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-3xl font-bold text-accent">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-text truncate">{user?.email}</h2>
            <p className="text-sm text-muted">Polaznik platforme</p>
          </div>

          <nav className="border-t border-borderSoft">
            <button
              className={`w-full px-6 py-4 text-left text-sm transition ${
                activeSection === "courses"
                  ? "bg-accent/10 font-bold text-accent"
                  : "text-text hover:bg-background"
              }`}
              onClick={() => setActiveSection("courses")}
            >
              Moji Kursevi
            </button>
            <button
              className={`w-full border-t border-borderSoft px-6 py-4 text-left text-sm transition ${
                activeSection === "settings"
                  ? "bg-accent/10 font-bold text-accent"
                  : "text-text hover:bg-background"
              }`}
              onClick={() => setActiveSection("settings")}
            >
              Podešavanja
            </button>
          </nav>
        </div>
      </div>

      {/* Desna kolona - Sadržaj */}
      <div className="w-full lg:w-2/3">
        <h2 className="mb-6 text-2xl font-bold text-text">
          {activeSection === "courses" ? "Moji Kursevi" : "Podešavanja"}
        </h2>
        {renderRightSection()}
      </div>
    </div>
  );
}