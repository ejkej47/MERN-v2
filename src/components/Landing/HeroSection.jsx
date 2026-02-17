// src/components/landing/HeroSection.jsx
import React from 'react';
import { Link } from "react-router-dom";

export default function HeroSection({ course }) {
  return (
    <section>
      {/* Overlay za bolju čitljivost teksta */}

      <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12 px-6 relative z-10">
        {/* Text */}
        <div className="relative z-10 text-center lg:text-left max-w-2xl text-white">
          <h1 className="text-[clamp(28px,5vw,64px)] leading-[1.1] font-extrabold tracking-tight">
            Emocionalna pismenost —{" "}
            <span className="font-extrabold text-accent">premium</span> online kursevi
          </h1>
          <p className="mt-4 text-[clamp(14px,1.6vw,18px)] text-muted">
            Alati za bolje razumevanje i upravljanje emocijama u svakodnevnom životu. 
            Stručni, praktični i topli sadržaji koji pomažu kao „terapija online“.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              to={`/course/${course?.slug || "emocionalna-pismenost"}`}
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-primary text-white hover:bg-primary-hover transition font-medium shadow-[0_0_0_3px_rgba(146,55,176,0.25),0_0_40px_rgba(130,231,134,0.15)]"
            >
              Pogledaj istaknuti kurs
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-accent text-black hover:bg-accent-hover transition font-medium"
            >
              Registruj se
            </Link>
          </div>
        </div>

        {/* Logo kao mockup */}
        <div className="flex-1 flex justify-center lg:justify-end relative z-10">
          <img
            src="https://wslshkalwiruolpvsdgu.supabase.co/storage/v1/object/public/Course-assets/logo_tekst_transparent.png"
            alt="Logo"
            //className="h-full w-full max-h-[420px] object-contain drop-shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}
