import React,{ useState } from "react";
import FeedbackForm from "./Forms/FeedbackForm"; // Proveri da li je putanja tačna
import FeedbackList from "./FeedbackList";
import { useAuth } from "../context/AuthContext";
import { X } from "lucide-react";

export default function SiteFeedbackSection() {
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const { user } = useAuth();

  // Funkcija koja se poziva nakon uspešnog slanja feedbacka u Supabase
  const handleFeedbackSuccess = () => {
    setRefreshList((r) => !r); // Osvežava FeedbackList
    setShowForm(false);        // Zatvara formu
  };

  return (
    <section className="bg-surface border-t border-borderSoft px-4 py-16">
      <div className="container mx-auto max-w-6xl">
        {/* Naslov + statistika */}
        <header className="mb-10 text-center">
          <h2 className="text-text text-3xl sm:text-4xl font-extrabold tracking-tight">
            Utisci naših polaznika
          </h2>
          <p className="mt-3 text-mutedSoft text-base max-w-2xl mx-auto">
            Vaše povratne informacije nam pomažu da unapredimo platformu i kurseve.
          </p>

          {/* Statistika povučena direktno iz Supabase tabele site_feedback */}
          <div className="mt-6">
            <FeedbackList key={`stats-${refreshList}`} showOnlyStats />
          </div>
        </header>

        {/* Dugme za otvaranje forme - dostupno samo ulogovanim korisnicima ili po tvom izboru */}
        {!showForm && (
          <div className="mb-10 flex justify-center">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="rounded-xl bg-primary px-8 py-3 font-bold text-white transition hover:bg-primary-hover shadow-lg"
            >
              Ostavi svoj utisak
            </button>
          </div>
        )}

        {/* Forma za unos novog feedbacka (povezana sa Supabase) */}
        {showForm && (
          <div className="relative mb-12 rounded-2xl border border-borderSoft bg-background p-8 shadow-xl max-w-2xl mx-auto">
            <button
              onClick={() => setShowForm(false)}
              className="absolute right-6 top-6 text-muted hover:text-text transition"
              aria-label="Zatvori"
            >
              <X size={24} />
            </button>

            <h3 className="mb-6 text-xl font-bold text-text text-center">
              Podeli svoje iskustvo
            </h3>
            <FeedbackForm onSuccess={handleFeedbackSuccess} />
          </div>
        )}

        {/* Lista svih komentara iz baze */}
        <div className="mt-12">
          <FeedbackList key={`list-${refreshList}`} />
        </div>
      </div>
    </section>
  );
}