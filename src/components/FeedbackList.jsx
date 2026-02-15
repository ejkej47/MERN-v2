import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function FeedbackList({ showOnlyStats = false }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({ average: 0, total: 0 });

  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        // Povlačimo sve komentare iz site_feedback tabele
        const { data, error } = await supabase
          .from("site_feedback")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          setFeedbacks(data);
          
          // Ručni obračun statistike
          const total = data.length;
          const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
          const average = total > 0 ? (sum / total).toFixed(1) : 0;
          
          setStats({ average, total });
        }
      } catch (err) {
        console.error("Greška pri učitavanju feedbacka:", err.message);
      }
    }

    fetchFeedbacks();
  }, []);

  // Ako treba samo prosečna ocena (npr. u headeru)
  if (showOnlyStats) {
    return (
      <div className="mt-4 flex items-center justify-center gap-2 text-accent">
        <Star size={20} fill="currentColor" stroke="none" />
        <span className="text-lg font-semibold">{stats.average}/5</span>
        <span className="text-text/70 text-sm">({stats.total} ocena)</span>
      </div>
    );
  }

  if (!feedbacks.length) return null;

  return (
    <div className="relative mt-10 flex items-center">
      {/* Strelica levo */}
      <div className="swiper-button-prev-static">‹</div>

      {/* Fade ivice za bolji vizuelni efekat */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-surface to-transparent hidden md:block"></div>
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-surface to-transparent hidden md:block"></div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={3}
        navigation={{
          prevEl: ".swiper-button-prev-static",
          nextEl: ".swiper-button-next-static",
        }}
        autoplay={{ delay: 4000 }}
        loop={feedbacks.length >= 3}
        breakpoints={{
          1024: { slidesPerView: 3 },
          640: { slidesPerView: 2 },
          0: { slidesPerView: 1 },
        }}
        className="pb-12 flex-1"
      >
        {feedbacks.map((fb) => (
          <SwiperSlide key={fb.id}>
            <div className="rounded-xl border border-borderSoft bg-surface p-6 shadow-sm transition hover:shadow-md h-full flex flex-col">
              {/* Ocena zvezdicama */}
              <div className="mb-4 flex items-center gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < fb.rating ? "currentColor" : "none"} 
                    className={i < fb.rating ? "text-accent" : "text-muted opacity-30"}
                  />
                ))}
              </div>

              {/* Komentar */}
              <p className="flex-1 text-sm italic text-text leading-relaxed">
                "{fb.comment || "Sjajna platforma!"}"
              </p>

              {/* Autor - email pošto ga imamo u bazi */}
              <div className="mt-6 flex items-center gap-3 border-t border-borderSoft pt-4">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-background border border-borderSoft">
                  <span className="text-xs text-muted">👤</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="truncate text-xs font-semibold text-text">Polaznik</span>
                  {/* Prikazujemo email (sakriveno delimično radi privatnosti ako želiš) */}
                  <span className="truncate text-[10px] text-muted">
                    {fb.user_email || "Anonimno"}
                  </span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Strelica desno */}
      <div className="swiper-button-next-static">›</div>

      <style>{`
        .swiper-button-prev-static,
        .swiper-button-next-static {
          color: var(--accent);
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          user-select: none;
          z-index: 20;
        }
        .swiper-button-prev-static:hover,
        .swiper-button-next-static:hover {
          transform: scale(1.3);
          color: var(--primary);
        }
        @media (max-width: 768px) {
          .swiper-button-prev-static, .swiper-button-next-static { display: none; }
        }
      `}</style>
    </div>
  );
}