// src/components/Module/ModuleTabs.jsx
import React from "react";

export default function ModuleTabs({ tabs = [], active, onChange }) {
  return (
    <div className="border-b border-borderSoft mt-10 mb-8">
      <nav className="flex gap-10 overflow-x-auto no-scrollbar" role="tablist">
        {tabs.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              onClick={() => onChange?.(t.id)}
              className={`relative pb-4 px-2 text-base font-semibold transition-all duration-300 rounded-t-lg ${
                isActive 
                  ? "text-accent bg-accent/5" 
                  : "text-muted hover:text-text hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span>{t.label}</span>
                {typeof t.count === "number" && (
                  /* PROMENJENE BOJE BEDŽA: Sada koristi accent boju platforme */
                  <span className={`rounded-md px-2 py-0.5 text-[11px] font-black transition-colors duration-300 ${
                    isActive 
                      ? "bg-accent text-black shadow-[0_0_8px_rgba(var(--color-accent),0.4)]" 
                      : "bg-accent/10 text-accent border border-accent/20"
                  }`}>
                    {t.count}
                  </span>
                )}
              </div>
              
              {/* Moderni indikator sa glow efektom usklađenim sa tvojom bojom */}
              {isActive && (
                <>
                  <div className="absolute bottom-0 left-0 h-[2px] w-full bg-accent shadow-[0_0_12px_rgba(var(--color-accent-rgb),0.8)]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent pointer-events-none rounded-t-lg" />
                </>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}