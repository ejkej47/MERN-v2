"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaCheck, FaLock, FaPlay, FaPen, FaPuzzlePiece, FaArrowLeft, FaArrowRight, FaListUl, FaTimes } from "react-icons/fa";

export default function LessonClient({
  courseSlug,
  moduleSlug,
  lesson,
  moduleTitle,
  allModuleLessons,
  currentLessonIndex,
  prevLesson,
  nextLesson,
  hasAccess,
  isCompleted,
  completedLessonIds,
  toggleAction,
  isUserLoggedIn
}) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const progressPercentage = allModuleLessons.length > 0 
    ? ((currentLessonIndex + 1) / allModuleLessons.length) * 100 
    : 0;

  const handleLessonSelect = (e, targetLesson) => {
    const canAccess = hasAccess || targetLesson.is_free;
    if (!canAccess) {
      e.preventDefault();
      toast.error("Ova lekcija je zaključana.");
    } else {
      setIsMobileMenuOpen(false);
    }
  };

  const LessonListContent = () => (
    <ul className="divide-y divide-[var(--accent-soft)]">
      {allModuleLessons.map((l, idx) => {
        const isActive = l.id === lesson.id;
        const isFinished = completedLessonIds.includes(l.id);
        const canAccess = hasAccess || l.is_free;
        const Icon = l.content_type === "quiz" ? FaPen : (l.content_type === "exercise" ? FaPuzzlePiece : FaPlay);

        return (
          <li key={l.id} className={`group transition-colors ${isActive ? 'bg-[var(--accent-soft)]' : 'hover:bg-[var(--bg-soft)]'}`}>
            <Link 
              href={`/course/${courseSlug}/module/${moduleSlug}/lesson/${l.slug}`}
              onClick={(e) => handleLessonSelect(e, l)}
              className={`flex items-center justify-between p-4 md:p-5 ${!canAccess ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${isActive ? 'bg-[var(--primary)] text-white' : (isFinished ? 'bg-[var(--bg-accent-green)] text-[var(--success)]' : 'bg-white border border-[var(--accent-soft)]')}`}>
                  {isFinished ? <FaCheck size={12} /> : idx + 1}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className={`font-bold text-sm md:text-base truncate transition-colors ${isActive ? 'text-[var(--primary)]' : 'group-hover:text-[var(--primary)]'}`}>
                    {l.title}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Icon size={10} className="opacity-40" />
                    {l.is_free && !hasAccess && (
                      <span className="text-[9px] uppercase tracking-widest text-[var(--success)] font-extrabold bg-[var(--bg-accent-green)] px-1.5 py-0.5 rounded-sm">Slobodno</span>
                    )}
                  </div>
                </div>
              </div>
              {!canAccess && <FaLock className="opacity-40 ml-3 shrink-0 text-sm" />}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-soft)] text-[var(--text-main)] font-medium">
      <div className="mx-auto max-w-[1600px] px-3 md:px-8 py-4 md:py-8">
        
        {/* Breadcrumb - Truncated na mobilnom, manji margin */}
        <div className="mb-4 md:mb-8">
          <Link 
            href={`/course/${courseSlug}/module/${moduleSlug}`}
            className="text-[var(--primary)] hover:text-[var(--primary-hover)] text-xs md:text-base font-bold flex items-center gap-2 transition-colors uppercase tracking-widest w-full"
          >
            <FaArrowLeft className="shrink-0" /> 
            <span className="truncate">Nazad: {moduleTitle}</span>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-8 items-start">
          
          {/* SIDEBAR - DESKTOP ONLY */}
          <div className="hidden lg:block lg:w-96 shrink-0 sticky top-24">
            <div className="rounded-3xl border border-[var(--accent-soft)] bg-white overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[var(--accent-soft)] bg-[var(--bg-soft)]/50">
                <h3 className="text-xl font-extrabold tracking-tight">Sadržaj modula</h3>
              </div>
              <div className="max-h-[70vh] overflow-y-auto no-scrollbar">
                <LessonListContent />
              </div>
            </div>
          </div>

          {/* GLAVNI SADRŽAJ - Manji vertikalni razmaci na mobilnom (space-y-3) */}
          <div className="flex-1 space-y-3 md:space-y-8 w-full min-w-0">

            {/* DUGME ZA POP-UP - Kompaktnije na mobilnom */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-full bg-white border border-[var(--accent-soft)] rounded-xl p-3 flex items-center justify-between font-extrabold shadow-sm active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[var(--bg-soft)] rounded-full flex items-center justify-center text-[var(--primary)] shrink-0">
                  <FaListUl size={12} />
                </div>
                <span className="block text-sm uppercase tracking-widest truncate">Sadržaj</span>
              </div>
              <div className="text-xs opacity-50 bg-[var(--bg-soft)] px-3 py-1 rounded-full whitespace-nowrap ml-2">
                {currentLessonIndex + 1} / {allModuleLessons.length}
              </div>
            </button>

            {/* POP-UP (MODAL) ZA MOBILNE UREĐAJE */}
            {isMobileMenuOpen && (
              <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
                <div className="absolute inset-0 bg-[var(--text-main)]/40 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
                <div className="relative bg-white w-full max-h-[85vh] rounded-t-[2.5rem] flex flex-col shadow-2xl animate-in slide-in-from-bottom-full duration-300">
                  <div className="p-6 border-b border-[var(--accent-soft)] flex items-center justify-between bg-[var(--bg-soft)]/50 rounded-t-[2.5rem]">
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold tracking-tight">Sadržaj modula</h3>
                      <p className="text-sm opacity-60 mt-1 truncate">{moduleTitle}</p>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-[var(--accent-soft)] text-xl opacity-70 hover:opacity-100 shrink-0 ml-4">
                      <FaTimes />
                    </button>
                  </div>
                  <div className="overflow-y-auto no-scrollbar pb-8">
                    <LessonListContent />
                  </div>
                </div>
              </div>
            )}

            {/* NAVIGACIJA (Prethodna/Sledeća + Progres) - Smanjen padding i fontovi na mobilnom */}
            <div className="relative overflow-hidden bg-white rounded-2xl md:rounded-3xl border border-[var(--accent-soft)] shadow-sm">
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[var(--bg-soft)]">
                <div className="h-full bg-[var(--success)] transition-all duration-700 ease-out" style={{ width: `${progressPercentage}%` }} />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between p-4 pb-6 md:p-6 md:pb-8 gap-3 md:gap-6">
                <div className="hidden md:block w-32">
                  {prevLesson && (
                    <button onClick={() => router.push(`/course/${courseSlug}/module/${moduleSlug}/lesson/${prevLesson.slug}`)} className="px-5 py-2.5 rounded-xl bg-[var(--bg-soft)] hover:bg-[var(--accent-soft)] transition-colors font-bold text-sm flex items-center gap-2">
                      <FaArrowLeft size={12} /> Prethodna
                    </button>
                  )}
                </div>
                
                <div className="text-center min-w-0 flex-1 px-2">
                  <h1 className="text-lg md:text-3xl font-extrabold leading-tight tracking-tight break-words mb-1 md:mb-2">
                    {lesson.title}
                  </h1>
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-50">
                    Lekcija {currentLessonIndex + 1} / {allModuleLessons.length}
                  </span>
                </div>

                <div className="hidden md:block w-32 text-right">
                  {nextLesson && (
                    <button onClick={() => router.push(`/course/${courseSlug}/module/${moduleSlug}/lesson/${nextLesson.slug}`)} className="px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors font-bold text-sm inline-flex items-center gap-2">
                      Sledeća <FaArrowRight size={12} />
                    </button>
                  )}
                </div>

                {/* Mobilna dugmad - Kompaktnija */}
                <div className="flex md:hidden w-full gap-2 mt-1">
                  <button onClick={() => prevLesson && router.push(`/course/${courseSlug}/module/${moduleSlug}/lesson/${prevLesson.slug}`)} disabled={!prevLesson} className="flex-1 px-3 py-2.5 rounded-xl bg-[var(--bg-soft)] font-bold text-xs disabled:opacity-30 flex justify-center items-center gap-1.5 border border-[var(--accent-soft)]">
                    <FaArrowLeft size={10} /> Preth
                  </button>
                  <button onClick={() => nextLesson && router.push(`/course/${courseSlug}/module/${moduleSlug}/lesson/${nextLesson.slug}`)} disabled={!nextLesson} className="flex-1 px-3 py-2.5 rounded-xl bg-[var(--primary)] text-white font-bold text-xs disabled:opacity-30 flex justify-center items-center gap-1.5">
                    Sled <FaArrowRight size={10} />
                  </button>
                </div>
              </div>
            </div>

            {/* VIDEO PLAYER ILI ZAKLJUČAN EKRAN - Tanji okviri na telefonu */}
            <div className="relative group p-1.5 md:p-3 rounded-2xl md:rounded-[2.5rem] bg-[var(--accent-soft)]">
              <div className="aspect-video w-full overflow-hidden rounded-[1rem] md:rounded-[2rem] bg-black relative z-10">
                {hasAccess ? (
                  lesson.content_type === "video" || !lesson.content_type ? (
                    lesson.path ? (
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${lesson.path}?rel=0&modestbranding=1&iv_load_policy=3`}
                        title={lesson.title}
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="flex h-full items-center justify-center text-white/50 italic p-4 text-center text-xs md:text-sm">
                        Video ID nije unet u bazu.
                      </div>
                    )
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center bg-[var(--bg-soft)] gap-4 md:gap-6">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-[var(--primary)] text-white rounded-full flex items-center justify-center text-2xl md:text-3xl">
                        {lesson.content_type === "quiz" ? <FaPen /> : <FaPuzzlePiece />}
                      </div>
                      <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
                        {lesson.content_type === "quiz" ? "Upitnik" : "Praktična vežba"}
                      </h2>
                    </div>
                  )
                ) : (
                  <div className="flex h-full flex-col items-center justify-center bg-[var(--bg-soft)] gap-4 md:gap-6 p-4 md:p-8 text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-[var(--accent-soft)] text-[var(--primary)] rounded-full flex items-center justify-center text-2xl md:text-3xl">
                      <FaLock />
                    </div>
                    <div>
                      <h2 className="text-lg md:text-2xl font-extrabold tracking-tight mb-1 md:mb-2">Sadržaj je zaključan</h2>
                      <p className="opacity-70 text-xs md:text-base max-w-md mx-auto">Da biste pristupili ovoj lekciji, potrebno je da obezbedite pristup modulu.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* KONTROLE (Završi lekciju) & OPIS */}
            <div className="bg-white p-5 md:p-10 rounded-2xl md:rounded-3xl border border-[var(--accent-soft)] shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-[var(--accent-soft)]">
                <div>
                  <h3 className="text-xl md:text-2xl font-extrabold tracking-tight mb-1 md:mb-2">O lekciji</h3>
                  <p className="opacity-60 text-xs md:text-sm font-medium">Dodatni materijali i beleške</p>
                </div>

                {isUserLoggedIn && hasAccess && (
                  <form action={toggleAction} className="shrink-0">
                    <button 
                      type="submit" 
                      className={`w-full md:w-auto px-6 py-3 md:px-8 md:py-3.5 rounded-full font-bold transition-all flex items-center justify-center gap-2 md:gap-3 text-sm md:text-base ${
                        isCompleted 
                          ? 'bg-[var(--bg-accent-green)] text-[var(--success)] hover:bg-[#7bc56f]' 
                          : 'bg-[var(--accent-soft)] hover:bg-[var(--primary)] hover:text-white'
                      }`}
                    >
                      {isCompleted ? (
                        <><FaCheck size={14} /> Završeno (Poništi)</>
                      ) : (
                        <><span className="w-4 h-4 rounded-full border-2 border-current opacity-50 block" /> Označi kao završeno</>
                      )}
                    </button>
                  </form>
                )}
              </div>

              <div className="prose prose-sm md:prose-lg max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-[var(--primary)] opacity-90 leading-relaxed whitespace-pre-wrap">
                {lesson.content || <span className="italic opacity-50 text-sm md:text-base">Nema dodatnog teksta za ovu lekciju.</span>}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}