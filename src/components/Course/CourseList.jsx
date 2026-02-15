import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient'; // 👈 Proveri putanju do klijenta
import SkeletonBox from '../QoL/SkeletonBox';
import { getStorageUrl } from '../../utils/helpers'; // 👈 Helper za slike
import React from "react";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        // Direktno povlačenje iz Supabase tabele 'courses'
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCourses(data || []);
      } catch (err) {
        console.error('Greška pri dohvatu kurseva:', err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 border rounded w-full">
            <SkeletonBox className="w-full h-[150px] rounded mb-2" />
            <SkeletonBox className="w-3/4 h-5 mb-1 rounded" />
            <SkeletonBox className="w-full h-4 mb-1 rounded" />
            <SkeletonBox className="w-5/6 h-4 mb-1 rounded" />
            <SkeletonBox className="w-1/3 h-4 mt-2 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <Link 
          to={`/course/${course.slug}`} 
          key={course.id} 
          className="p-4 border rounded text-dark no-underline hover:shadow transition w-full"
        >
          <img 
            // Koristimo helper za ispravan URL slike iz storage-a
            src={getStorageUrl(course.image_url)} 
            alt={course.title} 
            className="w-full h-[150px] object-cover rounded mb-2"
          />
          <h3 className="font-semibold">{course.title}</h3>
          <p className="text-sm text-gray-600 mb-1">
            {course.description?.substring(0, 80)}...
          </p>
          <p className="text-sm text-gray-700">
            Broj lekcija: {course.lesson_count ?? 'N/A'}
          </p>
          <p className="text-sm font-bold mt-1">Cena: ${course.price}</p>
        </Link>
      ))}
    </div>
  );
}

export default CourseList;