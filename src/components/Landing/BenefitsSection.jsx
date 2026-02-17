// src/components/landing/BenefitsSection.jsx
import React from 'react';
import { BookOpen, CheckCircle, Users, Clock } from "lucide-react";

const benefits = [
  { icon: BookOpen, title: "Stručni sadržaj", desc: "Kreiran od strane iskusnih psihologa i edukatora." },
  { icon: CheckCircle, title: "Praktične vežbe", desc: "Vežbe koje možeš odmah primeniti u svakodnevnom životu." },
  { icon: Clock, title: "Fleksibilno učenje", desc: "Pristupi materijalima kad god ti odgovara." },
  { icon: Users, title: "Podrška zajednice", desc: "Poveži se i uči zajedno sa drugima." },
];

export default function BenefitsSection() {
  return (
    // "w-full" osigurava da sekcija zauzima 100% širine ekrana
    <section className="w-full bg-surface py-20 border-t border-borderSoft">
      
      {/* Izbacili smo "container" i "max-w-7xl" da bi sadržaj išao od ivice do ivice */}
      <div className="w-full px-4 md:px-10 text-center">
        
        <h2 className="text-3xl md:text-4xl font-black text-text tracking-tight">
          Zašto odabrati <span className="text-accent">nas?</span>
        </h2>

        {/* Grid se sada širi koliko god je širok prozor browsera */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="p-10 rounded-3xl bg-background border border-borderSoft hover:border-accent/50 transition-all duration-300 group flex flex-col items-center justify-center min-h-[280px]"
            >
              {/* Ikona sa blagim glow efektom na hover */}
              <div className="p-4 rounded-2xl bg-accent/5 text-accent group-hover:scale-110 transition-transform duration-500">
                <b.icon className="h-10 w-10" />
              </div>
              
              <h3 className="mt-6 text-xl font-bold text-text">{b.title}</h3>
              <p className="mt-3 text-sm text-mutedSoft leading-relaxed max-w-[250px]">
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}