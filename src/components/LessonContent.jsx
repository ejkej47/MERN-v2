// src/components/Module/LessonContent.jsx
import { useEffect, useState } from "react";

// Ova linija skenira tvoj folder sa lekcijama
const lessonModules = import.meta.glob("/src/components/lessons/**/*.jsx");

function LessonContent({ selectedLesson }) {
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    // Ako lekcija nije izabrana ili je zaključana (purchased check)
    if (!selectedLesson || selectedLesson.isLocked) {
      setComponent(null);
      return;
    }

    setComponent(null);

    // Putanja u bazi treba da bude npr. "Modul1/Lekcija1.jsx"
    const modulePath = `/src/components/lessons/${selectedLesson.path}`;
    const loadLesson = lessonModules[modulePath];

    if (loadLesson) {
      loadLesson()
        .then((mod) => setComponent(() => mod.default))
        .catch((err) => {
          console.error("❌ Greška pri učitavanju JSX lekcije:", err);
          setComponent(() => () => (
            <p className="text-red-500 p-4">Greška pri učitavanju sadržaja lekcije.</p>
          ));
        });
    } else {
      console.error("❌ Fajl lekcije nije pronađen na putanji:", modulePath);
      setComponent(() => () => (
        <p className="text-mutedSoft p-4 italic">Sadržaj za ovu lekciju još uvek nije dodat.</p>
      ));
    }
  }, [selectedLesson]);

  if (!selectedLesson || selectedLesson.isLocked) {
    return (
      <div className="rounded-xl border border-dashed border-borderSoft p-12 text-center">
        <p className="text-mutedSoft italic text-sm">
          Odaberite lekciju iz menija sa strane da biste započeli učenje.
        </p>
      </div>
    );
  }

  return (
    <div className="prose prose-invert max-w-none animate-in fade-in duration-500">
      {Component ? <Component /> : <p className="text-muted p-4">Učitavanje lekcije...</p>}
    </div>
  );
}

export default LessonContent;