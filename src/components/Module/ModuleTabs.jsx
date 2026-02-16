// src/components/Module/ModuleTabs.jsx
import React from "react";

export default function ModuleTabs({ tabs = [], active, onChange }) {
  return (
    <div className="border-b border-borderSoft mt-10 mb-8"> {/* Dodata gornja margina mt-10 */}
      <nav className="flex gap-10 overflow-x-auto no-scrollbar" role="tablist">
        {tabs.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              onClick={() => onChange?.(t.id)}
              className={`relative pb-4 px-2 text-base font-semibold transition-all duration-300 rounded-t-lg ${
                isActive 
                  ? "text-accent bg-accent/5" // Suptilna pozadina za otvoren tab
                  : "text-muted hover:text-text hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span>{t.label}</span>
                {typeof t.count === "number" && (
                  <span className={`rounded-md px-2 py-0.5 text-[11px] font-black ${
                    isActive ? "bg-accent text-black" : "bg-surface text-muted"
                  }`}>
                    {t.count}
                  </span>
                )}
              </div>
              
              {/* Moderni indikator sa jačim sjajem (glow) */}
              {isActive && (
                <>
                  <div className="absolute bottom-0 left-0 h-[2px] w-full bg-accent shadow-[0_0_12px_rgba(130,231,134,0.8)]" />
                  {/* Suptilna senka/sjaj unutar samog taba */}
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