import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function LessonPage() {
  const { slug, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*, modules!inner(slug)')
        .eq('id', lessonId)
        .single();

      if (error) console.error(error);
      else setLesson(data);
    };

    if (lessonId) fetchLesson();
  }, [lessonId]);

  // UI deo ostaje isti kao u tvom LessonPage.jsx
}