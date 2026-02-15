// src/pages/LandingPage.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { getStorageUrl } from "../utils/helpers"; // OBAVEZNO uvezi helper

import HeroSection from "../components/Landing/HeroSection";
import FeaturedCourseSection from "../components/Landing/FeaturedCourseSection";
import BenefitsSection from "../components/Landing/BenefitsSection";
import AboutPreviewSection from "../components/Landing/AboutPreviewSection";
import SiteFeedbackSection from "../components/SiteFeedbackSection"; 
import FaqSection from "../components/Landing/FaqSection";
import CtaSection from "../components/Landing/CtaSection";

export default function LandingPage() {
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLandingData() {
      try {
        setLoading(true);
        
        // 1. Dohvati kurs
        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select("*")
          .eq("slug", "emocionalna-pismenost")
          .single();

        if (courseError) throw courseError;

        // 2. Dohvati module
        const { data: modulesData, error: modulesError } = await supabase
          .from("modules")
          .select("*")
          .eq("course_id", courseData.id)
          .order("order", { ascending: true });

        if (modulesError) throw modulesError;

        // --- KLJUČNI DEO ZA SLIKE ---
        // Pretvaramo ime fajla iz baze u pun URL koristeći helper
        const courseWithFullUrl = {
          ...courseData,
          image_url: getStorageUrl(courseData.image_url)
        };

        const modulesWithFullUrl = (modulesData || []).map(mod => ({
          ...mod,
          image_url: getStorageUrl(mod.image_url)
        }));
        // ----------------------------

        setCourse(courseWithFullUrl);
        setModules(modulesWithFullUrl);

      } catch (err) {
        console.error("❌ Greška pri učitavanju Landing podataka:", err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLandingData();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-text">Učitavanje...</div>;
  }

  return (
    <div className="bg-background text-text min-h-screen">
      <HeroSection course={course} />
      <FeaturedCourseSection course={course} modules={modules} />
      <BenefitsSection />
      <AboutPreviewSection />
      <SiteFeedbackSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
}