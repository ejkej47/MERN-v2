import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient"; // Novi import
import { getStorageUrl } from "../utils/helpers"; // Helper za slike

import HeroSection from "../components/Landing/HeroSection";
//import FeaturedCourseSection from "../components/Landing/FeaturedCourseSection";
import BenefitsSection from "../components/Landing/BenefitsSection";
import AboutPreviewSection from "../components/Landing/AboutPreviewSection";
//import FeedbackSection from "../components/Landing/FeedbackSection";
import FaqSection from "../components/Landing/FaqSection";
import CtaSection from "../components/Landing/CtaSection";

export default function LandingPage() {
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLandingData() {
      setLoading(true);
      try {
        // 1. Dohvatamo glavni kurs po slug-u direktno iz baze
        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select("*")
          .eq("slug", "emocionalna-pismenost")
          .single();

        if (courseError) throw courseError;

        // 2. Dohvatamo module koji pripadaju tom kursu
        const { data: modulesData, error: modulesError } = await supabase
          .from("modules")
          .select("*")
          .eq("course_id", courseData.id)
          .order("order", { ascending: true });

        if (modulesError) throw modulesError;

        // Sređujemo URL-ove slika pre nego što ih prosledimo komponentama
        const formattedCourse = {
          ...courseData,
          imageUrl: getStorageUrl(courseData.image_url)
        };

        const formattedModules = modulesData.map(mod => ({
          ...mod,
          imageUrl: getStorageUrl(mod.image_url)
        }));

        setCourse(formattedCourse);
        setModules(formattedModules);
      } catch (err) {
        console.error("❌ Greška pri učitavanju podataka sa Supabase-a:", err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLandingData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-text">
        Učitavanje...
      </div>
    );
  }

  return (
    <div className="bg-background text-text min-h-screen">
      {/* Prosleđujemo sređene podatke tvojim postojećim komponentama */}
      <HeroSection course={course} />
      {/*<FeaturedCourseSection course={course} modules={modules} />*/}
      <BenefitsSection />
      <AboutPreviewSection />
      {/*<FeedbackSection />*/}
      <FaqSection />
      <CtaSection />
    </div>
  );
}