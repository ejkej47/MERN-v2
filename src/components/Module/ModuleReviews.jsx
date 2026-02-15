import React from "react";
import SiteFeedbackSection from "../SiteFeedbackSection";

export default function ModuleReviews({ moduleId, enableForm = true }) {
  return (
    <section className="rounded-2xl border border-borderSoft bg-surface p-5">
      <h3 className="mb-3 text-lg font-semibold text-text">Utisci polaznika</h3>

      {/* Ovde koristimo tvoju glavnu sekciju za feedback koja je već na Supabase-u */}
      <SiteFeedbackSection showForm={enableForm} />
      
      {!moduleId && (
        <p className="mt-4 text-xs text-muted italic">
          Komentari i ocene su trenutno prikazani za čitavu platformu.
        </p>
      )}
    </section>
  );
}