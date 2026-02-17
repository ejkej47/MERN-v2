// src/components/landing/AboutPreviewSection.jsx
import React from 'react';
import { Link } from "react-router-dom";

export default function AboutPreviewSection() {
  return (
    <section className="bg-background py-16 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Tekstualni deo */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-black text-text tracking-tight">Ko smo mi?</h2>
          <p className="mt-4 text-mutedSoft leading-relaxed">
            Emocionalna pismenost okuplja tim stručnjaka iz psihologije,
            edukacije i digitalnog obrazovanja sa misijom da približimo
            alate za bolje razumevanje emocija svima.
          </p>
          <Link
            to="/about"
            className="mt-8 inline-block rounded-xl bg-primary text-white px-8 py-3 font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
          >
            Saznaj više o nama
          </Link>
        </div>

        {/* Slike članova tima - Uvek jedna pored druge, savršeno kružne */}
        <div className="relative w-full max-w-md mx-auto">
          {/* Suptilni glow iza slika */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl -z-10"></div>
          
          <div className="flex flex-row items-center justify-center gap-4 sm:gap-8 w-full">
            {/* Ivana */}
            <div className="flex-1">
              <img
                src="/images/ivana-dragic.png"
                alt="Ivana Dragić"
                className="aspect-square w-full object-cover rounded-full shadow-2xl border-4 border-borderSoft"
              />
            </div>

            {/* Zorica */}
            <div className="flex-1">
              <img
                src="/images/zorica-katic.jpg"
                alt="Zorica Katić"
                className="aspect-square w-full object-cover rounded-full shadow-2xl border-4 border-borderSoft"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}