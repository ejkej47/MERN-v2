// src/components/Module/ModuleLessons.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function ModuleLessons({ 
  courseSlug, 
  moduleSlug, 
  lessons = [], 
  purchased = false, 
  onPickLesson 
}) {
  // Sortiranje prema lesson_order koloni iz baze
  const sorted = useMemo(() => {
    if (!lessons) return [];
    return [...lessons].sort((a, b) => (a.lesson_order ?? 0) - (b.lesson_order ?? 0));
  }, [lessons]);

  // Vizuelni debug u slučaju da nema lekcija (prazan niz)
  if (!lessons || lessons.length === 0) {
    return (
      <div className="p-10 border-2 border-dashed border-borderSoft rounded-xl text-center">
        <p className="text-muted">Nema lekcija u ovom modulu.</p>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-borderSoft bg-surface p-5">
      <ul className="divide-y divide-borderSoft">
        {sorted.map((l, idx) => {
          /**
           * Logika pristupa:
           * Dozvoljeno ako je modul kupljen ILI ako je lekcija besplatna (is_free: true)
           */
          const canAccess = purchased || l.is_free === true; 
          
          /**
           * Generisanje putanje prema ruti iz App.jsx: 
           * /course/:courseSlug/module/:moduleSlug/lesson/:lessonId
           */
          const lessonUrl = `/course/${courseSlug}/module/${moduleSlug}/lesson/${l.slug}`;

          // Određivanje ikonice na osnovu content_type iz baze
          let icon = "▶️";
          if (l.content_type === "quiz") icon = "📝";
          if (l.content_type === "exercise") icon = "🧩";

          return (
            <li key={l.id} className={`flex items-center justify-between py-4 transition-opacity ${!canAccess ? "opacity-40" : ""}`}>
              <div className="flex items-center gap-4 min-w-0">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                  canAccess ? "bg-background text-accent border-borderSoft" : "bg-surface text-muted border-borderSoft"
                }`}>
                  {idx + 1}
                </span>
                
                <div className="flex flex-col min-w-0">
                  <Link
                    to={canAccess ? lessonUrl : "#"}
                    onClick={(e) => {
                      if (!canAccess) {
                        e.preventDefault();
                        toast.error("Ova lekcija je zaključana. Potrebna je kupovina.");
                      } else {
                        onPickLesson?.(l);
                      }
                    }}
                    className={`truncate font-medium transition-colors ${
                      !canAccess ? "text-muted cursor-not-allowed" : "text-text hover:text-accent"
                    }`}
                  >
                    {l.title}
                  </Link>
                  {l.is_free && !purchased && (
                    <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Besplatno</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 ml-4">
                <span className="text-lg opacity-80">{icon}</span>
                {!canAccess ? (
                  <span className="text-muted text-sm">🔒</span>
                ) : (
                  <span className="text-accent text-sm font-bold">Gledaj →</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}