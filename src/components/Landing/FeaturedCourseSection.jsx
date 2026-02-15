import React from 'react'; // Obavezno za Vite
import { Link } from "react-router-dom";

export default function FeaturedCourseSection({ course, modules = [] }) {
  return (
    <section className="container mx-auto max-w-7xl px-4 py-16">
      <div className="rounded-2xl bg-surface border border-borderSoft p-8">
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-accent font-bold">
          ISTAKNUTO
        </span>

        <h2 className="mt-3 text-3xl font-bold text-text">
          {course ? `Kurs: ${course.title}` : "Učitavanje kursa..."}
        </h2>

        {/* Moduli – tri u redu */}
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {modules && modules.length > 0 ? (
            modules.map((m) => (
              <div
                key={m.id}
                className="group flex flex-col rounded-xl border border-borderSoft bg-background overflow-hidden hover:border-accent transition shadow-lg"
              >
                {/* Slika modula */}
                <div className="aspect-[16/10] w-full bg-surface overflow-hidden">
                  {m.image_url ? (
                    <img
                      src={m.image_url} // Koristimo polje direktno iz tvoje tabele
                      alt={m.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-muted">Bez slike</div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="text-xs text-accent font-semibold">Modul {m.order}</div>
                  <h3 className="mt-1 text-lg font-semibold text-text">{m.title}</h3>
                  <p className="mt-2 text-mutedSoft line-clamp-3 text-sm">{m.description}</p>
                  
                  <div className="mt-auto pt-4">
                    <Link
                      to={`/course/${course?.slug}/module/${m.slug}`}
                      className="text-accent hover:underline text-sm font-medium"
                    >
                      Saznaj više →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted col-span-3 text-center py-10">Nema pronađenih modula za ovaj kurs.</p>
          )}
        </div>
      </div>
    </section>
  );
}