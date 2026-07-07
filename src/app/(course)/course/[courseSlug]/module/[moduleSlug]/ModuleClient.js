"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaCheckCircle, FaLock, FaPlay, FaPen, FaPuzzlePiece } from "react-icons/fa";

export default function ModuleClient({ 
  course, 
  module, 
  lessons, 
  hasAccess, 
  progressPercentage, 
  completedLessonsCount 
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Konstruisanje pune putanje za sliku (sa fallback-om)
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wslshkalwiruolpvsdgu.supabase.co';
  const fullImageUrl = module.image_url 
    ? `${SUPABASE_URL}/storage/v1/object/public/Course-assets/${module.image_url}`
    : null;

  // Filtriranje lekcija
  const videoLessons = useMemo(() => lessons.filter(l => l.content_type === "video" || !l.content_type), [lessons]);
  const practiceLessons = useMemo(() => lessons.filter(l => l.content_type === "quiz" || l.content_type === "exercise"), [lessons]);

  const handleLessonClick = (e, lesson) => {
    const canAccess = hasAccess || lesson.is_free;
    if (!canAccess) {
      e.preventDefault();
      toast.error("Ova lekcija je zaključana. Potrebna je kupovina.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Link href={`/course/${course.slug}`} className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium text-sm mb-8 inline-block transition-colors">
        &larr; Nazad na kurs: {course.title}
      </Link>

      {/* 1. Hero Sekcija */}
      <section className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-[var(--accent-soft)] flex flex-col md:flex-row gap-8 items-start mb-12">
        <div className="w-full md:w-1/3 aspect-[4/3] bg-[var(--accent-soft)] rounded-2xl overflow-hidden flex-shrink-0 relative">
          {fullImageUrl ? (
            <img src={fullImageUrl} alt={module.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-medium opacity-50">Bez slike</div>
          )}
        </div>
        
        <div className="flex-1 w-full flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${hasAccess ? 'bg-[var(--bg-accent-green)] text-[var(--success)]' : 'bg-[var(--accent-soft)] opacity-80'}`}>
                {hasAccess ? "Otključan pristup" : "Zaključano"}
              </span>
              <span className="text-sm font-medium opacity-60">{lessons.length} lekcija</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-[var(--text-main)]">{module.title}</h1>
            <p className="opacity-80 text-lg mb-8 leading-relaxed line-clamp-2">{module.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 w-full">
            <div className="flex-1 w-full">
              {hasAccess && lessons.length > 0 && (
                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-[var(--success)]">Vaš napredak</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-[var(--accent-soft)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--success)] rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
                  </div>
                </div>
              )}
            </div>

            {hasAccess ? (
              <button onClick={() => router.push(`/course/${course.slug}/module/${module.slug}/lesson/${lessons[0]?.slug}`)} className="bg-[var(--primary)] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-sm w-full sm:w-auto text-center">
                Nastavi učenje
              </button>
            ) : (
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="text-right hidden sm:block">
                  <div className="text-xl font-bold">{module.price === 0 ? 'Besplatno' : `${module.price} RSD`}</div>
                </div>
                <button className="bg-[var(--primary)] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-sm w-full sm:w-auto">
                  {module.price === 0 ? 'Započni' : 'Kupi modul'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Navigacija Tabova */}
      <div className="flex gap-8 border-b border-[var(--accent-soft)] mb-8 overflow-x-auto no-scrollbar">
        {[
          { id: "overview", label: "Pregled" },
          { id: "lessons", label: "Lekcije", count: videoLessons.length },
          { id: "practice", label: "Vežbe & Kvizovi", count: practiceLessons.length }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`pb-4 text-base font-bold transition-all relative whitespace-nowrap flex items-center gap-2 ${activeTab === t.id ? "text-[var(--primary)]" : "opacity-60 hover:opacity-100"}`}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={`px-2 py-0.5 rounded-md text-xs ${activeTab === t.id ? "bg-[var(--primary)] text-white" : "bg-[var(--accent-soft)]"}`}>
                {t.count}
              </span>
            )}
            {activeTab === t.id && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--primary)]" />}
          </button>
        ))}
      </div>

      {/* 3. Sadržaj Tabova */}
      <div className="min-h-[400px]">
        {/* PREGLED */}
        {activeTab === "overview" && (
          <div className="bg-white rounded-3xl p-8 border border-[var(--accent-soft)] text-lg leading-relaxed opacity-90">
            {module.description ? module.description : "Nema dostupnog opisa za ovaj modul."}
          </div>
        )}

        {/* LEKCIJE & VEŽBE */}
        {(activeTab === "lessons" || activeTab === "practice") && (
          <div className="bg-white rounded-3xl p-4 md:p-6 border border-[var(--accent-soft)]">
            <ul className="divide-y divide-[var(--accent-soft)]">
              {(activeTab === "lessons" ? videoLessons : practiceLessons).map((lesson, idx) => {
                const canAccess = hasAccess || lesson.is_free;
                const isVideo = lesson.content_type === "video" || !lesson.content_type;
                const Icon = isVideo ? FaPlay : (lesson.content_type === "quiz" ? FaPen : FaPuzzlePiece);

                return (
                  <li key={lesson.id} className={`group flex items-center justify-between py-4 md:py-5 px-2 md:px-4 transition-all hover:bg-[var(--bg-soft)] rounded-xl ${!canAccess ? "opacity-60" : ""}`}>
                    <div className="flex items-center gap-4 md:gap-6 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${canAccess ? 'bg-[var(--bg-soft)] text-[var(--primary)]' : 'bg-[var(--accent-soft)]'}`}>
                        <Icon size={14} />
                      </div>
                      
                      <div className="flex flex-col min-w-0">
                        <Link 
                          href={`/course/${course.slug}/module/${module.slug}/lesson/${lesson.slug}`}
                          onClick={(e) => handleLessonClick(e, lesson)}
                          className={`font-bold text-[15px] md:text-lg truncate transition-colors ${canAccess ? "group-hover:text-[var(--primary)]" : "cursor-not-allowed"}`}
                        >
                          {idx + 1}. {lesson.title}
                        </Link>
                        <div className="flex items-center gap-3 mt-1">
                          {lesson.is_free && !hasAccess && (
                            <span className="text-[10px] uppercase tracking-widest text-[var(--success)] font-extrabold bg-[var(--bg-accent-green)] px-2 py-0.5 rounded-sm">Besplatno</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-4">
                      {!canAccess && <FaLock className="opacity-40" />}
                    </div>
                  </li>
                );
              })}
              
              {(activeTab === "lessons" ? videoLessons : practiceLessons).length === 0 && (
                <div className="text-center py-12 opacity-50 font-medium">
                  Nema sadržaja u ovoj sekciji.
                </div>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}