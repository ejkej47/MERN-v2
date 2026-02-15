import React from "react";
import ModulePracticeList from "./ModulePracticeList";

/**
 * Komponenta za prikaz upitnika i vežbi unutar modula.
 * Filtrira lekcije po tipu koji dolazi iz baze.
 */
export default function ModulePractice({
  moduleSlug,
  lessons = [],
  completedLessonIds = [],
  onPickLesson,
}) {
  // Filtriramo lekcije na osnovu 'type' kolone iz tvoje tabele lessons
  const quizzes = lessons.filter((l) => l.type === "quiz");
  const exercises = lessons.filter((l) => l.type === "exercise");

  return (
    <div className="space-y-6">
      {/* Prikazujemo listu samo ako postoje upitnici */}
      {quizzes.length > 0 && (
        <ModulePracticeList
          moduleSlug={moduleSlug}
          lessons={quizzes}
          completedLessonIds={completedLessonIds}
          onPickLesson={onPickLesson}
          title="Upitnici"
          icon="📝"
        />
      )}

      {/* Prikazujemo listu samo ako postoje vežbe */}
      {exercises.length > 0 && (
        <ModulePracticeList
          moduleSlug={moduleSlug}
          lessons={exercises}
          completedLessonIds={completedLessonIds}
          onPickLesson={onPickLesson}
          title="Vežbe"
          icon="🧩"
        />
      )}

      {/* Fallback ako nema ni upitnika ni vežbi u bazi za ovaj modul */}
      {quizzes.length === 0 && exercises.length === 0 && (
        <p className="text-muted italic py-4">Nema dodatnih upitnika ili vežbi za ovaj modul.</p>
      )}
    </div>
  );
}