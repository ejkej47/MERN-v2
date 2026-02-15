import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import { Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function FeedbackForm({ onSuccess }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating < 1 || rating > 5) {
      toast.error("Molimo vas da izaberete ocenu (1–5).");
      return;
    }

    try {
      setSubmitting(true);

      // Slanje u Supabase tabelu 'site_feedback'
      const { error } = await supabase
        .from("site_feedback")
        .insert([
          { 
            rating, 
            comment,
            user_id: user.id // Supabase Auth ID korisnika
          }
        ]);

      if (error) throw error;

      toast.success("Hvala na oceni!");
      setRating(0);
      setComment("");
      onSuccess?.(); // Osvežava listu u SiteFeedbackSection
    } catch (err) {
      toast.error(err.message || "Greška pri slanju feedbacka.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium mb-2 text-text">Vaša ocena:</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`transition-transform hover:scale-110 ${star <= rating ? "text-yellow-500" : "text-muted opacity-30"}`}
            >
              <Star size={32} fill={star <= rating ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-medium mb-2 text-text">Komentar (opciono):</label>
        <textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full rounded-xl border border-borderSoft bg-background p-4 text-text placeholder:text-muted focus:border-accent outline-none transition"
          placeholder="Vaše iskustvo sa platformom..."
        />
      </div>

      {user ? (
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-primary px-8 py-3 font-bold text-white transition hover:bg-primary-hover disabled:opacity-50"
        >
          {submitting ? "Slanje..." : "Objavi utisak"}
        </button>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl bg-background/50 p-6 border border-dashed border-borderSoft">
          <p className="text-sm text-muted">Morate biti prijavljeni da biste ostavili ocenu.</p>
          <a
            href="/login"
            className="rounded-lg bg-accent px-6 py-2 font-bold text-black hover:bg-accent-hover transition"
          >
            Prijavi se
          </a>
        </div>
      )}
    </form>
  );
}