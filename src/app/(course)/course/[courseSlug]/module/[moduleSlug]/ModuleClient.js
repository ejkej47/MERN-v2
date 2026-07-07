"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { 
  FaLock, FaPlay, FaPen, FaPuzzlePiece, FaClock, 
  FaStar, FaQuoteLeft, FaUserTie, FaChevronDown, FaChevronUp, FaArrowLeft
} from "react-icons/fa";

export default function ModuleClient({ 
  course, 
  module, 
  lessons, 
  hasAccess, 
  progressPercentage, 
  completedLessonsCount 
}) {
  const router = useRouter();
  
  const [showAllLessons, setShowAllLessons] = useState(false);

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wslshkalwiruolpvsdgu.supabase.co';
  const fullImageUrl = module.image_url 
    ? `${SUPABASE_URL}/storage/v1/object/public/Course-assets/${module.image_url}`
    : null;

  const videoLessons = useMemo(() => lessons.filter(l => l.content_type === "video" || !l.content_type), [lessons]);
  const practiceLessons = useMemo(() => lessons.filter(l => l.content_type === "quiz" || l.content_type === "exercise"), [lessons]);

  const estimatedDurationMins = videoLessons.length * 15;
  const estimatedHours = Math.floor(estimatedDurationMins / 60);
  const estimatedMins = estimatedDurationMins % 60;
  const durationText = estimatedHours > 0 
    ? `${estimatedHours}h ${estimatedMins}m` 
    : `${estimatedMins}m`;

  const handleLessonClick = (e, lesson) => {
    const canAccess = hasAccess || lesson.is_free;
    if (!canAccess) {
      e.preventDefault();
      toast.error("Ova lekcija je zaključana. Potrebna je kupovina.");
    }
  };

  const visibleLessons = showAllLessons ? lessons : lessons.slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 space-y-16">
      
      {/* Grupišemo Back Link i Hero sekciju kako bismo primenili manji razmak (space-y-6 umesto space-y-16) */}
      <div className="space-y-6">
        
        {/* --- BACK LINK --- */}
        <div>
          <Link 
            href={`/course/${course.slug}`} 
            className="text-[var(--primary)] hover:text-[var(--primary-hover)] text-xs md:text-base font-bold flex items-center gap-2 transition-colors uppercase tracking-widest w-full"
          >
            <FaArrowLeft className="shrink-0" /> 
            <span className="truncate">Nazad na kurs: {course.title}</span>
          </Link>
        </div>

        {/* --- 1. HERO SEKCIJA --- */}
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[var(--accent-soft)] flex flex-col md:flex-row gap-8 lg:gap-12 items-center">
          {/* Slika je sada limitirana sa w-full md:w-2/5 i max-w-md kako ne bi divljala na velikim ekranima */}
          <div className="w-full md:w-2/5 max-w-md aspect-[4/3] bg-[var(--accent-soft)] rounded-2xl overflow-hidden flex-shrink-0 relative shadow-inner">
            {fullImageUrl ? (
              <img src={fullImageUrl} alt={module.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-medium opacity-50">Bez slike</div>
            )}
          </div>
          
          <div className="flex-1 w-full flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className={`px-4 py-1.5 text-xs font-bold rounded-full ${hasAccess ? 'bg-[var(--bg-accent-green)] text-[var(--success)]' : 'bg-[var(--accent-soft)] opacity-80'}`}>
                {hasAccess ? "Otključan pristup" : "Zaključano"}
              </span>
              <div className="flex items-center gap-1.5 text-sm font-medium opacity-70">
                <FaPlay size={12} /> {lessons.length} lekcija
              </div>
              {videoLessons.length > 0 && (
                <div className="flex items-center gap-1.5 text-sm font-medium opacity-70">
                  <FaClock size={12} /> ~{durationText}
                </div>
              )}
            </div>
            
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight mb-8 text-[var(--text-main)]">
              {module.title}
            </h1>

            <div className="bg-[var(--bg-soft)] p-6 md:p-8 rounded-3xl border border-[var(--accent-soft)]">
              {hasAccess && lessons.length > 0 ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex-1 w-full">
                    <div className="flex justify-between text-sm font-bold mb-3">
                      <span className="text-[var(--text-main)]">Vaš napredak</span>
                      <span className="text-[var(--success)]">{progressPercentage}%</span>
                    </div>
                    <div className="h-3.5 w-full bg-white rounded-full overflow-hidden border border-[var(--accent-soft)]">
                      <div className="h-full bg-[var(--success)] rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
                    </div>
                  </div>
                  <button onClick={() => router.push(`/course/${course.slug}/module/${module.slug}/lesson/${lessons[0]?.slug}`)} className="bg-[var(--primary)] text-white px-8 py-4 rounded-full font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-md w-full sm:w-auto text-center whitespace-nowrap">
                    Nastavi učenje
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                   <div>
                    <p className="text-sm font-medium opacity-60 mb-1">Cena modula</p>
                    <div className="text-3xl font-black text-[var(--text-main)]">
                      {module.price === 0 ? 'Besplatno' : `${module.price} RSD`}
                    </div>
                  </div>
                  <button className="bg-[var(--primary)] text-white px-10 py-4 rounded-full font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-md w-full sm:w-auto text-lg">
                    {module.price === 0 ? 'Započni besplatno' : 'Kupi modul'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* --- 2. O MODULU (Sa jasno uokvirenim videom) --- */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
        {/* ... (Ostatak sekcija ostaje apsolutno isti) ... */}
        <div className="lg:col-span-3">
          <h2 className="text-3xl font-bold mb-6">O ovom modulu</h2>
          <div className="prose prose-lg opacity-80 leading-relaxed text-[var(--text-main)]">
            {module.description ? (
              <p>{module.description}</p>
            ) : (
              <p className="italic opacity-60">Nema dostupnog opisa za ovaj modul.</p>
            )}
          </div>
        </div>
        
        {/* Placeholder Video sa okvirom */}
        <div className="lg:col-span-2 relative aspect-video bg-[#2c2c2c] rounded-3xl overflow-hidden shadow-lg border-4 border-[var(--accent-soft)] group cursor-pointer flex items-center justify-center transition-transform hover:scale-[1.02]">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center z-20 shadow-xl group-hover:scale-110 transition-transform">
            <FaPlay className="text-[var(--primary)] ml-1" size={24} />
          </div>
          <div className="absolute top-4 left-4 z-20">
            <span className="bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20">
              Uvodni video
            </span>
          </div>
        </div>
      </section>

      {/* --- 3. SADRŽAJ MODULA (Cela površina klikabilna) --- */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Sadržaj modula</h2>
        <div className="bg-white rounded-3xl p-3 md:p-5 border border-[var(--accent-soft)] shadow-sm">
          <ul className="divide-y divide-[var(--accent-soft)]">
            {visibleLessons.map((lesson, idx) => {
              const canAccess = hasAccess || lesson.is_free;
              const isVideo = lesson.content_type === "video" || !lesson.content_type;
              const Icon = isVideo ? FaPlay : (lesson.content_type === "quiz" ? FaPen : FaPuzzlePiece);

              return (
                // Uklonili smo 'rounded-2xl', 'hover:bg...' i 'transition-all' sa <li>
                <li key={lesson.id}>
                  {/* Prebacili smo ih ovde na <Link>, a dodali smo i 'group' ovde kako bi hover animacije radile */}
                  <Link 
                    href={`/course/${course.slug}/module/${module.slug}/lesson/${lesson.slug}`}
                    onClick={(e) => handleLessonClick(e, lesson)}
                    className={`group flex items-center justify-between w-full py-4 px-4 rounded-2xl transition-all hover:bg-[var(--bg-soft)] ${!canAccess ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="flex items-center gap-5 min-w-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-sm shadow-sm transition-colors ${canAccess ? 'bg-white text-[var(--primary)] border border-[var(--accent-soft)] group-hover:bg-[var(--primary)] group-hover:text-white' : 'bg-[var(--bg-soft)] text-[var(--text-main)] opacity-50'}`}>
                        <Icon size={14} />
                      </div>
                      
                      <div className="flex flex-col min-w-0 text-left">
                        <span className={`font-bold text-[16px] md:text-lg truncate transition-colors ${canAccess ? "group-hover:text-[var(--primary)] text-[var(--text-main)]" : "text-[var(--text-main)]"}`}>
                          {idx + 1}. {lesson.title}
                        </span>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs font-semibold opacity-60 flex items-center gap-1">
                            {isVideo ? "Video lekcija" : "Vežba / Kviz"}
                          </span>
                          {lesson.is_free && !hasAccess && (
                            <span className="text-[10px] uppercase tracking-widest text-[var(--success)] font-extrabold bg-[var(--bg-accent-green)] px-2.5 py-0.5 rounded-sm">Besplatno</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                      {!canAccess ? (
                         <FaLock className="opacity-30" />
                      ) : (
                        <span className="text-sm font-bold text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity hidden md:block bg-[var(--bg-soft)] px-4 py-2 rounded-full">
                          Otvori
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
            
            {lessons.length === 0 && (
              <div className="text-center py-12 opacity-50 font-medium">
                Sadržaj se još uvek priprema.
              </div>
            )}
          </ul>

          {lessons.length > 4 && (
            <div className="mt-4 pt-4 border-t border-[var(--accent-soft)] flex justify-center">
              <button 
                onClick={() => setShowAllLessons(!showAllLessons)}
                className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)] opacity-70 hover:opacity-100 hover:text-[var(--primary)] transition-colors px-6 py-2 rounded-full hover:bg-[var(--bg-soft)]"
              >
                {showAllLessons ? (
                  <>Prikaži manje <FaChevronUp size={12} /></>
                ) : (
                  <>Prikaži još {lessons.length - 4} lekcija <FaChevronDown size={12} /></>
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* --- 4. O PREDAVAČU (MOCK) --- */}
      <section className="bg-[var(--bg-soft)] rounded-3xl p-8 border border-[var(--accent-soft)]">
        <h2 className="text-2xl font-bold mb-6">Upoznajte predavača</h2>
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-[var(--accent-soft)] flex-shrink-0 overflow-hidden">
            <FaUserTie size={40} className="mt-4" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-1">Ime Predavača</h3>
            <p className="text-sm text-[var(--primary)] font-bold mb-4">Senior Developer & Instruktor</p>
            <p className="opacity-80 leading-relaxed max-w-2xl">
              Ovo je kratak opis predavača. Ovde možete napisati nekoliko rečenica o iskustvu onoga ko drži ovaj kurs, kako bi polaznici izgradili poverenje pre same kupovine modula.
            </p>
          </div>
        </div>
      </section>

      {/* --- 5. OCENE I UTISCI (MOCK) --- */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Utisci polaznika</h2>
          <div className="flex items-center gap-2">
            <FaStar className="text-yellow-400" size={24} />
            <span className="text-xl font-bold">4.8</span>
            <span className="opacity-60 text-sm">(24 ocene)</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[var(--accent-soft)] shadow-sm relative">
            <FaQuoteLeft className="absolute top-6 right-6 text-[var(--bg-soft)] opacity-50" size={30} />
            <div className="flex gap-1 text-yellow-400 mb-4">
              <FaStar size={14}/><FaStar size={14}/><FaStar size={14}/><FaStar size={14}/><FaStar size={14}/>
            </div>
            <p className="opacity-80 italic mb-6">
              "Modul je fantastičan! Sve je objašnjeno korak po korak, a vežbe su mi zaista pomogle da primenim znanje u praksi. Sve preporuke."
            </p>
            <div className="font-bold text-sm">Marko M.</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[var(--accent-soft)] shadow-sm relative">
            <FaQuoteLeft className="absolute top-6 right-6 text-[var(--bg-soft)] opacity-50" size={30} />
            <div className="flex gap-1 text-yellow-400 mb-4">
              <FaStar size={14}/><FaStar size={14}/><FaStar size={14}/><FaStar size={14}/><FaStar size={14}/>
            </div>
            <p className="opacity-80 italic mb-6">
              "Konačno platforma na kojoj učim bez odugovlačenja. Pravo u metu. Radujem se sledećem modulu."
            </p>
            <div className="font-bold text-sm">Jovana T.</div>
          </div>
        </div>
      </section>

    </div>
  );
}