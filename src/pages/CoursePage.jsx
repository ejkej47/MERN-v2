// src/pages/CoursePage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";
import { getStorageUrl } from "../utils/helpers";

import CourseHero from "../components/Course/CourseHero";
import PurchaseCard from "../components/Course/PurchaseCard";
import ModuleCard from "../components/Course/ModuleCard";
import StickyMobileBar from "../components/Course/StickyMobileBar";
import StatsBar from "../components/Course/StatsBar";

export default function CourseDetail() {
  const { slug } = useParams();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [isPurchased, setIsPurchased] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFullCourseData() {
      try {
        setLoading(true);
        
        // 1. Dohvati korisnika
        const { data: { user } } = await supabase.auth.getUser();

        // 2. Dohvati kurs po slug-u direktno iz Supabase
        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select("*")
          .eq("slug", slug)
          .single();

        if (courseError || !courseData) throw new Error("Kurs nije pronađen");

        // 3. Dohvati module i njihove lekcije (join)
        const { data: modulesData, error: modulesError } = await supabase
          .from("modules")
          .select("*, lessons(*)")
          .eq("course_id", courseData.id)
          .order("order", { ascending: true });

        if (modulesError) throw modulesError;

        // 4. Proveri vlasništvo u novoj 'enrollments' tabeli
        if (user) {
          const { data: enrollment } = await supabase
            .from("enrollments")
            .select("*")
            .eq("user_id", user.id)
            .eq("course_id", courseData.id)
            .is("module_id", null) // Ako je null, znači da ima pristup celom kursu
            .single();
          
          if (enrollment) setIsPurchased(true);
        }

        // Formatiramo podatke za prikaz (slike)
        setCourse({
          ...courseData,
          image_url: getStorageUrl(courseData.image_url),
          introVideoUrl: courseData.intro_video_url ? getStorageUrl(courseData.intro_video_url) : null
        });
        
        setModules(modulesData || []);
      } catch (e) {
        console.error("❌ Greška:", e.message);
        toast.error("Podaci o kursu nisu dostupni.");
      } finally {
        setLoading(false);
      }
    }

    fetchFullCourseData();
  }, [slug]);

  // Funkcija za kupovinu celog kursa
  const handlePurchaseCourse = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return toast.error("Moraš biti ulogovan da kupiš kurs.");

    try {
      const { error } = await supabase
        .from("enrollments")
        .insert([{ 
          user_id: user.id, 
          course_id: course.id,
          module_id: null 
        }]);

      if (error) throw error;

      toast.success("Kupovina uspešna!");
      setIsPurchased(true);
    } catch (err) {
      toast.error("Greška pri kupovini.");
    }
  };

  // Funkcija za kupovinu specifičnog modula
  const handlePurchaseModule = async (modId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return toast.error("Moraš biti ulogovan.");

    try {
      const { error } = await supabase
        .from("enrollments")
        .insert([{ 
          user_id: user.id, 
          course_id: course.id,
          module_id: modId 
        }]);

      if (error) throw error;

      toast.success("Modul otključan!");
      // Ovde bi idealno bilo osvežiti isPurchased logiku za taj specifični modul
    } catch (err) {
      toast.error("Greška pri kupovini modula.");
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-6xl p-6 text-muted animate-pulse">Učitavanje podataka o kursu…</div>;
  }

  if (!course) return <div className="p-20 text-center text-text">Kurs nije pronađen.</div>;

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">
      <CourseHero
        course={course}
        isPurchased={isPurchased}
        onPurchase={handlePurchaseCourse}
      />

      {course.introVideoUrl && (
        <section className="rounded-2xl border border-borderSoft bg-surface p-6">
          <h3 className="mb-4 text-xl font-bold text-text">Uvod u kurs</h3>
          <video
            src={course.introVideoUrl}
            controls
            className="w-full rounded-lg border border-borderSoft aspect-video"
          />
        </section>
      )}

      <StatsBar
        lessonsCount={course.lesson_count}
        modulesCount={modules.length}
        duration={course.duration_hours}
      />

      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-text">Moduli u kursu</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((mod) => (
            <ModuleCard
              key={mod.id}
              module={mod}
              moduleBasePath={`/course/${slug}/module`}
              onPurchaseModule={() => handlePurchaseModule(mod.id)}
            />
          ))}
        </div>
      </section>

      <PurchaseCard
        course={course}
        isPurchased={isPurchased}
        onPurchase={handlePurchaseCourse}
      />

      <section className="rounded-2xl border border-borderSoft bg-surface p-6">
        <h3 className="mb-4 text-xl font-bold text-text">Česta pitanja</h3>
        <div className="grid gap-4 md:grid-cols-2 text-sm">
          <div>
            <p className="font-semibold text-text">Da li imam doživotan pristup?</p>
            <p className="text-muted">Da, kurs ostaje dostupan bez vremenskog ograničenja.</p>
          </div>
          <div>
            <p className="font-semibold text-text">Postoji li garancija povraćaja?</p>
            <p className="text-muted">Da, 7 dana bez pitanja — samo nam piši.</p>
          </div>
        </div>
      </section>

      <StickyMobileBar
        isPurchased={isPurchased}
        price={course.price}
        onPurchase={handlePurchaseCourse}
      />
    </div>
  );
}