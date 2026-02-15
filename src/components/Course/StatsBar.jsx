// src/components/Course/StatsBar.jsx
import React from "react";
export default function StatsBar({ lessonsCount, modulesCount, duration }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Broj Lekcija */}
      <div className="rounded-xl bg-surface border border-borderSoft p-4 text-center shadow-sm">
        <div className="text-2xl font-bold text-text">{lessonsCount || 0}</div>
        <div className="text-sm text-muted">Lekcija</div>
      </div>
      
      {/* Broj Modula */}
      <div className="rounded-xl bg-surface border border-borderSoft p-4 text-center shadow-sm">
        <div className="text-2xl font-bold text-text">{modulesCount || 0}</div>
        <div className="text-sm text-muted">Modula</div>
      </div>
      
      {/* Trajanje */}
      <div className="rounded-xl bg-surface border border-borderSoft p-4 text-center shadow-sm">
        <div className="text-2xl font-bold text-text">{duration || 0}h</div>
        <div className="text-sm text-muted">Trajanje</div>
      </div>
    </section>
  );
}