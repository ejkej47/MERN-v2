import React from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function ModulePracticeList({
  moduleSlug,
  lessons = [],
  completedLessonIds = [],
  onPickLesson,
  title,
  icon,
}) {
  if (!lessons.length) return null;

  return (
    <section className="rounded-2xl border border-borderSoft bg-surface p-5">
      <h3 className="mb-4 text-lg font-semibold text-text">{icon} {title}</h3>
      <ul className="divide-y divide-borderSoft">
        {lessons.map((l, idx) => {
          const locked = !!l.isLocked;
          // Promenjena putanja na /lesson/id
          const to = locked ? "#" : `/lesson/${l.id}`;
          const isCompleted = completedLessonIds.includes(l.id);

          let lessonIcon = "🎬";
          if (l.type === "quiz") lessonIcon = "📝";
          else if (l.type === "exercise") lessonIcon = "🧩";

          return (
            <li key={l.id} className="flex items-center justify-between py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background text-xs text-text/80">{idx + 1}</span>
                <Link
                  to={to}
                  onClick={(e) => {
                    if (locked) {
                      e.preventDefault();
                      toast.error("Ova lekcija je zaključana.");
                    } else {
                      onPickLesson?.(l);
                      localStorage.setItem(`lastLesson-module-${moduleSlug}`, String(l.id));
                    }
                  }}
                  className={`min-w-0 truncate text-sm md:text-base transition ${locked ? "cursor-not-allowed text-muted" : "text-text hover:text-accent"}`}
                >
                  {l.title}
                </Link>
              </div>
              <div className="ml-3 flex shrink-0 items-center gap-2">
                <span className="text-lg">{lessonIcon}</span>
                {isCompleted && <span className="text-xs text-accent">✓ Završeno</span>}
                {locked && <span className="text-xs text-muted">🔒</span>}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}