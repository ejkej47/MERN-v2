import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function ModuleLessons({
  moduleSlug,
  lessons = [],
  purchased = false,
  completedLessonIds = [],
  onPickLesson,
}) {
  const sorted = useMemo(() => {
    return [...lessons].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [lessons]);

  const total = sorted.length || 0;
  const completed = Array.isArray(completedLessonIds) ? completedLessonIds.length : 0;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  const lastKey = `lastLesson-module-${moduleSlug}`;
  const lastLessonId = useMemo(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(lastKey);
    return raw ? raw : null;
  }, [moduleSlug]);

  return (
    <section className="rounded-2xl border border-borderSoft bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text">Lekcije</h3>
        {total > 0 && <div className="text-sm text-text/80">{completed}/{total} ({percent}%)</div>}
      </div>

      <div className="mb-6">
        <div className="h-2 w-full overflow-hidden rounded-full bg-background">
          <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${percent}%` }} />
        </div>
        {lastLessonId && (
          <div className="mt-3">
            <Link
              to={`/lesson/${lastLessonId}`}
              className="inline-flex items-center gap-2 rounded-lg border border-borderSoft bg-background px-3 py-2 text-sm text-text hover:bg-surface"
            >
              ➤ Nastavi od poslednje lekcije
            </Link>
          </div>
        )}
      </div>

      {!total ? (
        <p className="text-muted">Nema lekcija u ovom modulu.</p>
      ) : (
        <ul className="divide-y divide-borderSoft">
          {sorted.map((l, idx) => {
            const locked = !!l.isLocked && !purchased;
            // Promenjena putanja na /lesson/id
            const to = locked ? "#" : `/lesson/${l.id}`;
            const isLast = lastLessonId === String(l.id);

            let icon = "▶️";
            if (l.type === "quiz") icon = "📝";
            else if (l.type === "exercise") icon = "🧩";

            return (
              <li key={l.id} className="flex items-center justify-between py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background text-xs text-text/80">{idx + 1}</span>
                  <Link
                    to={to}
                    onClick={(e) => {
                      if (locked) {
                        e.preventDefault();
                        toast.error("Lekcija je zaključana.");
                      } else {
                        localStorage.setItem(lastKey, String(l.id));
                        onPickLesson?.(l);
                      }
                    }}
                    className={`min-w-0 truncate text-sm md:text-base transition ${locked ? "cursor-not-allowed text-muted" : "text-text hover:text-accent"}`}
                  >
                    {l.title}
                    {isLast && !locked && <span className="ml-2 text-xs text-accent">(poslednja)</span>}
                  </Link>
                </div>
                <div className="ml-3 flex shrink-0 items-center gap-2">
                  <span className="text-lg">{icon}</span>
                  {locked ? <span className="text-xs">🔒</span> : <span className="text-accent">✓</span>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}