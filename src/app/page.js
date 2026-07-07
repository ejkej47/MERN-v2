import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server'; 

export default async function Home() {
  const supabase = await createClient();

  const { data: modules, error } = await supabase
    .from('modules')
    .select(`
      *,
      courses (
        slug
      )
    `)
    .order('order', { ascending: true });

  if (error) {
    console.error("Greška pri povlačenju modula:", error);
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wslshkalwiruolpvsdgu.supabase.co';

  return (
    <>
      {/* HERO SEKCIJA */}
      <section className="relative pt-16 pb-24 md:pt-32 md:pb-32 overflow-hidden min-h-[80vh] flex items-center">
        <Image 
          src="/hero-slika-v2.jpg" 
          alt="Psihoterapija i rad na sebi"
          fill
          priority
          className="object-cover -z-20 opacity-80"
        />
        <div className="absolute inset-0 bg-[var(--bg-soft)]/40 -z-10 backdrop-blur-[2px]"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          {/* Tekst ima svoju bež pozadinu */}
          <div className="w-full xl:w-fit max-w-full bg-[var(--bg-soft)] p-8 md:p-12 rounded-3xl shadow-sm border border-[var(--accent-soft)]">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter leading-[1.1] mb-6 flex flex-col text-[var(--text-main)]">
              <span className="md:whitespace-nowrap">Razumite sebe.</span>
              <span className="font-medium md:whitespace-nowrap">Transformišite svoj život.</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-main)] max-w-2xl leading-relaxed mb-10 font-medium">
              Strukturisan pristup radu na sebi kroz duboko razumevanje sopstvenih mehanizama. Krenite na putovanje ka boljoj emocionalnoj regulaciji.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/kursevi" className="bg-[var(--primary)] text-white px-8 py-4 text-sm font-bold flex justify-center items-center gap-2 rounded-full hover:bg-[var(--primary-hover)] transition-colors w-full sm:w-auto">
                Započni program
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEKCIJA KURSA I MODULA */}
      <section className="border-t border-[var(--accent-soft)] pt-16 pb-8 bg-[var(--bg-soft)]">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <h2 className="text-sm font-bold tracking-widest uppercase text-[var(--text-main)] mb-2">
            Kompletan program
          </h2>
          <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--text-main)] mb-6">
            Program emocionalne transformacije
          </h3>
          <p className="text-lg text-[var(--text-main)] font-medium max-w-3xl leading-relaxed">
            Ovaj sveobuhvatni kurs podeljen je u pažljivo strukturisane module. 
            Svaki modul se nadovezuje na prethodni, pružajući vam alate za dubinsku promenu.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {modules && modules.map((module, index) => {
            const courseSlug = module.courses?.slug || 'kurs';
            const imageUrl = module.image_url 
              ? `${SUPABASE_URL}/storage/v1/object/public/Course-assets/${module.image_url}`
              : "/landing-usluge-v2.jpg";

            return (
              <Link 
                key={module.id} 
                href={`/course/${courseSlug}/module/${module.slug}`}
                className="group block px-6 py-12 md:py-16 border-b border-[var(--accent-soft)] hover:bg-[var(--accent-soft)]/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12">
                  <div className="flex items-start md:items-center gap-8 md:gap-16">
                    <span className="text-[var(--text-main)] font-mono font-light text-2xl md:text-4xl">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h2 className="text-2xl md:text-4xl font-extrabold text-[var(--text-main)] tracking-tight mb-2 transition-all duration-300">
                        {module.title}
                      </h2>
                      <p className="text-[var(--text-main)] font-normal transition-all duration-300 delay-75">
                        {module.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Strelica dobija ljubičastu boju (var(--primary)) pri hoveru */}
                  <div className="hidden md:block opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-[var(--text-main)] group-hover:text-[var(--primary)]">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
                
                <div className="w-full aspect-video md:aspect-[21/9] bg-[var(--accent-soft)] rounded-3xl relative flex items-center justify-center overflow-hidden transition-all duration-500">
                  <Image 
                    src={imageUrl} 
                    alt={module.title} 
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* RECENZIJE SEKCIJA */}
      <section className="py-24 border-b border-[var(--accent-soft)] bg-[var(--bg-soft)]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--text-main)] mb-16 text-center">
            Iskustva klijenata
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl border border-[var(--accent-soft)] bg-[var(--bg-accent-green)]">
              <p className="text-[var(--text-main)] font-medium mb-6 leading-relaxed">
                "Ovaj program mi je pomogao da napokon razumem svoje reakcije. Materijali su jasni i lako primenljivi u svakodnevici."
              </p>
              <p className="text-[var(--text-main)] font-bold">— Ana M.</p>
            </div>
            <div className="p-8 rounded-3xl border border-[var(--accent-soft)] bg-[var(--bg-accent-green)]">
              <p className="text-[var(--text-main)] font-medium mb-6 leading-relaxed">
                "Struktura kurseva je odlična. Tačno te vodi korak po korak bez osećaja preplavljenosti informacijama."
              </p>
              <p className="text-[var(--text-main)] font-bold">— Marko S.</p>
            </div>
            <div className="p-8 rounded-3xl border border-[var(--accent-soft)] bg-[var(--bg-accent-green)]">
              <p className="text-[var(--text-main)] font-medium mb-6 leading-relaxed">
                "Topla preporuka za svakoga ko želi da radi na sebi na jedan strukturisan i profesionalan način."
              </p>
              <p className="text-[var(--text-main)] font-bold">— Jelena T.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SEKCIJA */}
      <section className="py-24 bg-[var(--bg-soft)]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--text-main)]">
              Česta pitanja
            </h2>
          </div>

          <div className="border-t-2 border-[var(--text-main)]">
            <details className="group [&_summary::-webkit-details-marker]:hidden border-b border-[var(--accent-soft)] hover:bg-[var(--accent-soft)]/30 transition-colors cursor-pointer">
              <summary className="flex items-center justify-between p-6">
                <h3 className="text-lg md:text-xl font-bold tracking-tight text-[var(--text-main)] pr-4">Koliko traje pristup materijalima?</h3>
                <span className="relative flex-shrink-0 ml-1.5 w-5 h-5 text-[var(--text-main)]">
                  <svg className="absolute inset-0 w-5 h-5 opacity-100 group-open:opacity-0 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="square" strokeLinejoin="miter" d="M12 4v16m8-8H4"/></svg>
                  <svg className="absolute inset-0 w-5 h-5 opacity-0 group-open:opacity-100 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="square" strokeLinejoin="miter" d="M20 12H4"/></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-[var(--text-main)] font-normal text-sm md:text-base leading-relaxed whitespace-pre-line">
                Nakon kupovine, imate doživotan pristup svim materijalima iz odabranog programa.
              </div>
            </details>
            <details className="group [&_summary::-webkit-details-marker]:hidden border-b border-[var(--accent-soft)] hover:bg-[var(--accent-soft)]/30 transition-colors cursor-pointer">
              <summary className="flex items-center justify-between p-6">
                <h3 className="text-lg md:text-xl font-bold tracking-tight text-[var(--text-main)] pr-4">Da li je program zamena za psihoterapiju?</h3>
                <span className="relative flex-shrink-0 ml-1.5 w-5 h-5 text-[var(--text-main)]">
                  <svg className="absolute inset-0 w-5 h-5 opacity-100 group-open:opacity-0 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="square" strokeLinejoin="miter" d="M12 4v16m8-8H4"/></svg>
                  <svg className="absolute inset-0 w-5 h-5 opacity-0 group-open:opacity-100 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="square" strokeLinejoin="miter" d="M20 12H4"/></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-[var(--text-main)] font-normal text-sm md:text-base leading-relaxed whitespace-pre-line">
                Program nudi strukturisane alate i edukaciju, ali ne može u potpunosti zameniti individualni rad sa terapeutom ukoliko se suočavate sa ozbiljnijim mentalnim izazovima.
              </div>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}