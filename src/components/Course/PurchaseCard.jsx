// src/components/Course/PurchaseCard.jsx
import React from "react";

export default function PurchaseCard({ course, isPurchased, onPurchase }) {
  return (
    <aside className="sticky top-6 rounded-2xl border border-borderSoft bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text">Pristup kursu</h3>
        {/* Promenjeno na RSD i koristi cenu iz baze */}
        {!isPurchased && typeof course?.price === "number" && (
          <div className="text-xl font-bold text-text">{course.price} RSD</div>
        )}
      </div>

      {/* Prikaz statusa kupljenog kursa */}
      {isPurchased ? (
        <p className="mt-2 font-medium text-accent">✔ Kurs je otključan</p>
      ) : (
        <button
          onClick={onPurchase}
          className="mt-4 w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary-hover shadow-lg"
        >
          Kupi sada
        </button>
      )}

      <ul className="mt-4 space-y-2 text-sm text-muted">
        <li>✅ Doživotan pristup</li>
        <li>✅ Ažuriranja uključena</li>
        <li>✅ 7 dana garancije povraćaja</li>
      </ul>

      {!isPurchased && (
        <div className="mt-4 rounded-lg border border-borderSoft bg-background p-3 text-xs text-text/85 leading-relaxed">
          👉 Pojedinačne module možeš kupiti u nastavku, ali{" "}
          <strong className="text-text font-bold">kompletan kurs je povoljniji</strong>.
        </div>
      )}
    </aside>
  );
}