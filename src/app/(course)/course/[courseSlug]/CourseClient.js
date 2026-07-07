"use client";

import Link from 'next/link';
import Image from 'next/image';
import MockCheckoutButton from '@/components/course/MockCheckoutButton';

export default function CourseClient({ course, modules, lessonsByModule, userId }) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wslshkalwiruolpvsdgu.supabase.co';
  
  const courseImageUrl = course.image_url 
    ? `${SUPABASE_URL}/storage/v1/object/public/Course-assets/${course.image_url}`
    : null;

  return (
    <div className="bg-[var(--bg-soft)] min-h-screen">
      
      {/* 1. Hero Sekcija Kursa */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <Link href="/courses" className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-bold text-sm mb-8 inline-block transition-colors uppercase tracking-widest">
          &larr; Nazad na sve kurseve
        </Link>

        <div className="flex flex-col lg:flex-row gap-12 items-center mb-8">
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-[var(--text-main)]">
              {course.title}
            </h1>
            <p className="opacity-80 text-lg md:text-xl mb-10 leading-relaxed font-medium">
              {course.description}
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-white p-6 rounded-3xl border border-[var(--accent-soft)] shadow-sm">
              <div>
                <div className="text-xs font-bold opacity-50 uppercase tracking-widest mb-1">Cena celog kursa</div>
                <div className="text-3xl font-extrabold text-[var(--text-main)]">
                  {course.price === 0 ? 'Besplatno' : `${course.price} RSD`}
                </div>
              </div>
              <div className="sm:ml-auto w-full sm:w-auto">
                <MockCheckoutButton 
                  userId={userId} 
                  courseId={course.id} 
                  buttonText={course.price === 0 ? "Započni kurs" : "Kupi ceo program"} 
                />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 aspect-video lg:aspect-[4/3] bg-[var(--accent-soft)] rounded-[2.5rem] overflow-hidden relative">
            {courseImageUrl ? (
              <Image src={courseImageUrl} alt={course.title} fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-medium opacity-50">Bez slike</div>
            )}
          </div>
        </div>
      </section>

      {/* 2. SEKCIJA KURSA I MODULA (Tvoj dizajn) */}
      <section className="border-t border-[var(--accent-soft)] pt-16 pb-24 bg-[var(--bg-soft)]">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <h2 className="text-sm font-bold tracking-widest uppercase text-[var(--primary)] mb-3">
            Kompletan program
          </h2>
          <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--text-main)] mb-6">
            Program emocionalne transformacije
          </h3>
          <p className="text-lg text-[var(--text-main)] font-medium max-w-3xl leading-relaxed opacity-80">
            Ovaj sveobuhvatni kurs podeljen je u pažljivo strukturisane module. 
            Svaki modul se nadovezuje na prethodni, pružajući vam alate za dubinsku promenu.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {modules && modules.map((module, index) => {
            const moduleUrl = `/course/${course.slug}/module/${module.slug}`;
            const imageUrl = module.image_url 
              ? `${SUPABASE_URL}/storage/v1/object/public/Course-assets/${module.image_url}`
              : "/landing-usluge-v2.jpg";
              
            const moduleLessons = lessonsByModule[module.id] || [];

            return (
              <div 
                key={module.id} 
                className="group block py-12 md:py-16 border-b border-[var(--accent-soft)] transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 md:mb-12 gap-8">
                  
                  {/* Levi deo: Broj, Naslov, Opis, Lekcije */}
                  <div className="flex items-start md:items-start gap-6 md:gap-12 flex-1">
                    <span className="text-[var(--text-main)] font-mono font-light text-3xl md:text-5xl opacity-40 mt-1">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <Link href={moduleUrl} className="inline-block group-hover:text-[var(--primary)] transition-colors duration-300">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-main)] tracking-tight mb-4 inline-flex items-center gap-4">
                          {module.title}
                          <svg className="opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300 w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </h2>
                      </Link>
                      
                      <p className="text-[var(--text-main)] font-medium text-lg opacity-80 mb-8 max-w-2xl leading-relaxed">
                        {module.description}
                      </p>

                      {/* Lista lekcija unutar modula */}
                      {moduleLessons.length > 0 && (
                        <div className="bg-white/50 rounded-2xl p-6 border border-[var(--accent-soft)] max-w-2xl mb-8">
                          <h4 className="font-bold mb-4 text-xs uppercase tracking-widest opacity-50">Sadržaj modula</h4>
                          <ul className="space-y-3">
                            {moduleLessons.map((lesson, lIdx) => (
                              <li key={lesson.id} className="flex items-center gap-3 text-sm font-medium">
                                <span className="opacity-40">{lIdx + 1}.</span>
                                <Link href={`/course/${course.slug}/module/${module.slug}/lesson/${lesson.slug}`} className="hover:text-[var(--primary)] transition-colors truncate">
                                  {lesson.title}
                                </Link>
                                {lesson.is_free && (
                                  <span className="text-[10px] uppercase tracking-widest text-[var(--success)] font-extrabold bg-[var(--bg-accent-green)] px-2 py-0.5 rounded-sm ml-auto">Besplatno</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Dugme za kupovinu i cena */}
                      <div className="flex items-center gap-6">
                        <MockCheckoutButton 
                          userId={userId} 
                          courseId={course.id} 
                          moduleId={module.id}
                          buttonText="Kupi modul" 
                        />
                        <div className="font-extrabold text-xl">
                          {module.price === 0 ? 'Besplatno' : `${module.price} RSD`}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
                
                {/* Slika modula na dnu */}
                <Link href={moduleUrl} className="block w-full aspect-video md:aspect-[21/9] bg-[var(--accent-soft)] rounded-[2rem] relative flex items-center justify-center overflow-hidden transition-all duration-500 hover:opacity-90">
                  <Image 
                    src={imageUrl} 
                    alt={module.title} 
                    fill
                    className="object-cover"
                  />
                </Link>
              </div>
            );
          })}
          
          {(!modules || modules.length === 0) && (
            <div className="text-center py-20 opacity-50 font-medium text-lg">
              Trenutno nema unetih modula za ovaj kurs.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}