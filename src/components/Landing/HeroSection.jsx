// src/components/landing/HeroSection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { getStorageUrl } from "../../utils/helpers"; 

export default function HeroSection({ course, modules = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Logika za rotaciju modula na svake 4 sekunde
  useEffect(() => {
    if (modules && modules.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % modules.length);
      }, 4000); // 4000ms = 4 sekunde
      return () => clearInterval(timer);
    }
  }, [modules]);

  const activeModule = modules[currentIndex];

  return (
    <section>
      <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12 px-6 relative z-10">
        
        {/* LEVA STRANA: Umesto h1 teksta sada ide Kartica */}
        <div className="relative z-10 text-center lg:text-left w-full max-w-2xl text-white mt-10 lg:mt-14">
          {activeModule ? (
            <Link
              to={`/course/${course?.slug}/module/${activeModule.slug}`}
              className="group flex flex-col rounded-xl w-full lg:w-4/5 bg-background border border-black/20 shadow-sm overflow-hidden hover:opacity-80 transition-all duration-500"
            >
              {/* Slika */}
              <div className="w-full aspect-[16/10] bg-surface overflow-hidden">
                {activeModule.image_url ? (
                  <img
                    src={getStorageUrl(activeModule.image_url)}
                    alt={activeModule.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-muted text-xs">Bez slike</div>
                )}
              </div>

              {/* Naslov modula */}
              <div className="pt-4 px-4 pb-4 border-t border-borderSoft">
                <h3 className="text-xxl font-semibold text-text transition-colors line-clamp-2">
                  {activeModule.title}
                </h3>
              </div>
            </Link>
          ) : (
            <div className="h-48 flex items-center justify-center border border-dashed border-borderSoft rounded-2xl text-muted">
              Učitavanje modula...
            </div>
          )}
          <p className="mt-4 text-[clamp(14px,1.6vw,18px)] text-muted">

            Alati za bolje razumevanje i upravljanje emocijama u svakodnevnom životu. 

            Stručni, praktični i topli sadržaji koji pomažu kao „terapija online“.

          </p>
          {/* Dugmići ispod kartice (zadržani iz originala) */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              to={`/course/${course?.slug || "emocionalna-pismenost"}`}
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-primary text-white hover:bg-primary-hover transition font-medium shadow-[0_0_0_3px_rgba(146,55,176,0.25),0_0_40px_rgba(130,231,134,0.15)]"
            >
              Pogledaj sve kurseve
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-accent text-black hover:bg-accent-hover transition font-medium"
            >
              Registruj se
            </Link>
          </div>
        </div>

        {/* DESNA STRANA: Dijagonalna slika */}
        <div className="flex-1 flex justify-center lg:justify-end relative z-10 lg:-mt-8">
          <div className="w-full max-w-sm lg:max-w-xl">
            <div className="space-y-4 lg:hidden">
              <div className="flex items-center gap-4 rounded-[2rem] bg-surface p-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
                <div className="w-40 h-50 overflow-hidden rounded-[1.5rem] bg-surface">
                  <img
                    src="https://wslshkalwiruolpvsdgu.supabase.co/storage/v1/object/public/Course-assets/ivana-dragic_nova.png"
                    alt="Ivana Dragić"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-base text-white">Ivana Dragić, dr</p>
                  <p className="mt-1 text-xs text-gray-200">Univ.-Ass. Dr. scient. pth.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-[2rem] bg-surface p-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
                <div className="w-40 h-50 overflow-hidden rounded-[1.5rem] bg-surface">
                  <img
                    src="https://wslshkalwiruolpvsdgu.supabase.co/storage/v1/object/public/Course-assets/zorica-katic_nova.jpg"
                    alt="Zorica Katić"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-base text-white">Zorica Katić, mr</p>
                  <p className="mt-1 text-xs text-gray-200">Stručni saradnik</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:block relative w-full h-[520px]">
              <div className="absolute top-0 left-8 w-72 h-[420px] lg:w-80 lg:h-[480px] overflow-hidden rounded-[2rem] bg-surface shadow-[0_35px_100px_rgba(0,0,0,0.18)] rotate-[-4deg]">
                <div className="relative h-full">
                  <img
                    src="https://wslshkalwiruolpvsdgu.supabase.co/storage/v1/object/public/Course-assets/ivana-dragic_nova.png"
                    alt="Ivana Dragić"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute left-0 right-0 bottom-0 bg-black/55 px-3 py-2 text-white text-sm">
                    <p className="font-semibold text-base">Ivana Dragić, dr</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-48 right-0 w-72 h-[420px] lg:w-80 lg:h-[480px] overflow-hidden rounded-[2rem] bg-surface shadow-[0_35px_100px_rgba(0,0,0,0.18)] rotate-3">
                <div className="relative h-full">
                  <img
                    src="https://wslshkalwiruolpvsdgu.supabase.co/storage/v1/object/public/Course-assets/zorica-katic_nova.jpg"
                    alt="Zorica Katić"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute left-0 right-0 bottom-0 bg-black/55 px-3 py-2 text-white text-sm">
                    <p className="font-semibold text-base">Zorica Katić, mr</p>
                    <p className="text-xs text-gray-200">Stručni saradnik</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}