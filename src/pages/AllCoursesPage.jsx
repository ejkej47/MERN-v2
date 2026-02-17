import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient"; // Tvoj supabase klijent
import { getStorageUrl } from "../utils/helpers";


export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error("Greška:", error);
      else setCourses(data);
      setLoading(false);
    };

    fetchCourses();
  }, []);

  if (loading) return <div className="p-10 text-center">Učitavanje kurseva...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-12 text-4xl font-extrabold text-text text-center">Naša ponuda</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Link key={course.id} to={`/course/${course.slug}`} className="group block overflow-hidden rounded-2xl border border-borderSoft bg-surface hover:border-accent transition">
            <div className="aspect-video bg-background">
              <img src={getStorageUrl(course.image_url)} alt={course.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-300" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-text">{course.title}</h3>
              <p className="mt-2 text-sm text-mutedSoft line-clamp-2">{course.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}