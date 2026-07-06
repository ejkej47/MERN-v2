import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function CoursesPage() {
  // Inicijalizacija server-side Supabase klijenta
  const supabase = await createClient()

  // Dohvatanje kurseva iz baze
  const { data: courses, error } = await supabase
    .from('courses')
    .select('id, title, description, slug, price')
    .order('created_at', { ascending: false })

  // Provera grešaka pri fetchovanju
  if (error) {
    return (
      <div>
        <h1>Greška</h1>
        <p>Došlo je do greške pri učitavanju kurseva: {error.message}</p>
      </div>
    )
  }

  // Ako je baza prazna
  if (!courses || courses.length === 0) {
    return (
      <div>
        <h1>Svi kursevi</h1>
        <p>Trenutno nema dostupnih kurseva.</p>
      </div>
    )
  }

  // Prikaz liste kurseva
  return (
    <div>
      <h1>Dostupni kursevi</h1>
      <ul>
        {courses.map((course) => (
          <li key={course.id} style={{ marginBottom: '20px' }}>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <p>
              <strong>Cena:</strong> {course.price === 0 ? 'Besplatno' : `${course.price} RSD`}
            </p>
            {/* Link ka detaljima pojedinačnog kursa */}
            <Link href={`/course/${course.slug}`}>
              Pogledaj detalje
            </Link>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  )
}