// src/components/Course/MyCourses.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient"; // 👈 Koristimo direktno Supabase
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import LoadingSpinner from "../QoL/LoadingSpinner";
import { getStorageUrl } from "../../utils/helpers"; // 👈 Helper za slike iz storage-a

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const { user, loading: authLoading } = useAuth();
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    async function fetchUserCourses() {
      if (!user) return;
      
      try {
        setFetching(true);
        // Vučemo kurseve preko relacije u tabeli enrollments
        const { data, error } = await supabase
          .from("enrollments")
          .select(`
            course_id,
            courses (
              id,
              title,
              slug,
              image_url,
              description
            )
          `)
          .eq("user_id", user.id);

        if (error) throw error;

        // Čistimo podatke da dobijemo niz objekata kurseva
        const userCourses = data.map((item) => item.courses).filter(Boolean);
        setCourses(userCourses);
      } catch (err) {
        console.error("Greška pri dohvatu kurseva:", err.message);
      } finally {
        setFetching(false);
      }
    }

    fetchUserCourses();
  }, [user]);

  if (authLoading || fetching) return <LoadingSpinner className="h-screen" />;
  if (!user) return <p className="text-text">Pristup dozvoljen samo prijavljenim korisnicima.</p>;

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold text-text">Moji kursevi</h2>

      {courses.length === 0 ? (
        <p className="text-muted">Nema kupljenih kurseva.</p>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <Link
              to={`/course/${course.slug || course.id}`}
              key={course.id}
              className="flex items-start gap-4 rounded-lg border border-borderSoft bg-surface p-4 transition hover:shadow-lg"
            >
              <img
                // Koristimo helper za ispravan URL slike
                src={getStorageUrl(course.image_url)}
                alt={course.title}
                className="h-24 w-40 rounded object-cover"
              />
              <div className="flex-1">
                <h3 className="mb-1 text-lg font-semibold text-text">{course.title}</h3>
                <p className="line-clamp-3 text-sm text-muted">{course.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}