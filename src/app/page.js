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
      <section className="border-t border-[var(--accent-soft)] pt-16 pb-16 bg-[var(--bg-soft)]">
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

        {/* Ovde menjamo grid/listu kartica */}
        <div className="max-w-7xl mx-auto px-6 space-y-6 md:space-y-8">
          {modules && modules.map((module, index) => {
            const courseSlug = module.courses?.slug || 'kurs';
            const imageUrl = module.image_url 
              ? `${SUPABASE_URL}/storage/v1/object/public/Course-assets/${module.image_url}`
              : "/landing-usluge-v2.jpg";

            return (
              <Link 
                key={module.id} 
                href={`/course/${courseSlug}/module/${module.slug}`}
                // Primenjene klase iz Hero sekcije modula uz dodatak hover efekata
                className="group block bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[var(--accent-soft)] hover:border-[var(--primary)] hover:shadow-md transition-all flex flex-col md:flex-row gap-8 lg:gap-12 items-center"
              >
                {/* 1. SLIKA (Isti format kao u Hero sekciji) */}
                <div className="w-full md:w-2/5 max-w-md aspect-[4/3] bg-[var(--accent-soft)] rounded-2xl overflow-hidden flex-shrink-0 relative shadow-inner">
                  <Image 
                    src={imageUrl} 
                    alt={module.title} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                
                {/* 2. SADRŽAJ (Desna strana) */}
                <div className="flex-1 w-full flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-[var(--bg-soft)] text-[var(--text-main)] font-mono font-bold text-sm md:text-base px-3 py-1 rounded-lg border border-[var(--accent-soft)]">
                      Modul {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-main)] group-hover:text-[var(--primary)] tracking-tight mb-4 transition-colors duration-300">
                    {module.title}
                  </h2>
                  
                  <p className="text-[var(--text-main)] font-medium opacity-80 mb-8 line-clamp-3 leading-relaxed">
                    {module.description}
                  </p>
                  
                  <div className="inline-flex items-center gap-2 text-[var(--text-main)] group-hover:text-[var(--primary)] font-bold text-sm uppercase tracking-widest transition-colors">
                    Saznaj više 
                    <svg className="transform group-hover:translate-x-2 transition-transform duration-300" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* O NAŠIM PREDAVAČIMA */}
      <section className="py-24 border-b border-[var(--accent-soft)] bg-white relative overflow-hidden">
        {/* Blagi pozadinski ukrasni krug */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-[var(--bg-soft)] rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest uppercase text-[var(--primary)] mb-3 bg-[var(--bg-soft)] border border-[var(--accent-soft)] inline-block px-4 py-1.5 rounded-full shadow-sm">
              Stručnost i empatija
            </h2>
            <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--text-main)] mb-6">
              Upoznajte naše predavače
            </h3>
            <p className="text-lg text-[var(--text-main)] font-medium opacity-80 leading-relaxed">
              Naš tim čine sertifikovani stručnjaci sa višegodišnjim iskustvom. Spajamo naučnu ozbiljnost sa nežnim i podržavajućim pristupom svakom polazniku.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* PREDAVAČ 1 */}
            <div className="bg-[var(--bg-soft)] rounded-3xl p-8 md:p-10 border border-[var(--accent-soft)] shadow-sm hover:shadow-md hover:border-[var(--primary)]/30 transition-all duration-300 flex flex-col sm:flex-row gap-8 items-start relative overflow-hidden group">
              {/* Citat ikonica u pozadini */}
              <svg className="absolute right-8 top-8 text-white opacity-60 pointer-events-none group-hover:scale-110 transition-transform duration-500" width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>

              {/* Slika */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-white flex-shrink-0 relative border-4 border-white shadow-sm z-10">
                {/* Ostavljeno kao placeholder, zameni sa pravom <Image /> komponentom kada budeš imao slike */}
                <div className="w-full h-full flex items-center justify-center text-[var(--primary)] opacity-40 bg-[var(--accent-soft)]">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 w-full z-10 flex flex-col h-full">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white text-[var(--text-main)] border border-[var(--accent-soft)] px-3 py-1 rounded-md shadow-sm">KBT Pristup</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white text-[var(--text-main)] border border-[var(--accent-soft)] px-3 py-1 rounded-md shadow-sm">Emocije</span>
                </div>
                <h4 className="text-2xl md:text-3xl font-extrabold text-[var(--text-main)] mb-1 tracking-tight">Marija Jovanović</h4>
                <p className="text-sm text-[var(--primary)] font-bold uppercase tracking-wider mb-4">Sertifikovani Psihoterapeut</p>
                <p className="text-[var(--text-main)] font-medium opacity-80 leading-relaxed mb-6">
                  Specijalizovana za rad na emocionalnoj regulaciji i prevazilaženju anksioznosti sa preko 10 godina iskustva u kliničkoj praksi.
                </p>
                
                <div className="border-t border-[var(--accent-soft)] pt-4 mt-auto">
                  <div className="flex items-center gap-3 text-sm font-bold opacity-70 text-[var(--text-main)]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                    <span>Master Psihologije (Univerzitet u BG)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PREDAVAČ 2 */}
            <div className="bg-[var(--bg-soft)] rounded-3xl p-8 md:p-10 border border-[var(--accent-soft)] shadow-sm hover:shadow-md hover:border-[var(--primary)]/30 transition-all duration-300 flex flex-col sm:flex-row gap-8 items-start relative overflow-hidden group">
              {/* Citat ikonica u pozadini */}
              <svg className="absolute right-8 top-8 text-white opacity-60 pointer-events-none group-hover:scale-110 transition-transform duration-500" width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>

              {/* Slika */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-white flex-shrink-0 relative border-4 border-white shadow-sm z-10">
                <div className="w-full h-full flex items-center justify-center text-[var(--primary)] opacity-40 bg-[var(--accent-soft)]">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 w-full z-10 flex flex-col h-full">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white text-[var(--text-main)] border border-[var(--accent-soft)] px-3 py-1 rounded-md shadow-sm">Komunikacija</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white text-[var(--text-main)] border border-[var(--accent-soft)] px-3 py-1 rounded-md shadow-sm">Asertivnost</span>
                </div>
                <h4 className="text-2xl md:text-3xl font-extrabold text-[var(--text-main)] mb-1 tracking-tight">Nikola Petrović</h4>
                <p className="text-sm text-[var(--primary)] font-bold uppercase tracking-wider mb-4">Edukator & Coach</p>
                <p className="text-[var(--text-main)] font-medium opacity-80 leading-relaxed mb-6">
                  Pomaže polaznicima da prepoznaju nesvesne obrasce ponašanja i izgrade stabilno samopouzdanje u odnosima.
                </p>
                
                <div className="border-t border-[var(--accent-soft)] pt-4 mt-auto">
                  <div className="flex items-center gap-3 text-sm font-bold opacity-70 text-[var(--text-main)]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                    <span>Sertifikovani NLP Master</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* RECENZIJE SEKCIJA */}
      <section className="py-24 border-b border-[var(--accent-soft)] bg-[var(--bg-soft)]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--text-main)] mb-16 text-center">
            Iskustva klijenata
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl border border-[var(--primary)] bg-[var(--bg-accent-green)]">
              <p className="text-[var(--text-main)] font-medium mb-6 leading-relaxed">
                "Ovaj program mi je pomogao da napokon razumem svoje reakcije. Materijali su jasni i lako primenljivi u svakodnevici."
              </p>
              <p className="text-[var(--text-main)] font-bold">— Ana M.</p>
            </div>
            <div className="p-8 rounded-3xl border border-[var(--primary)] bg-[var(--bg-accent-green)]">
              <p className="text-[var(--text-main)] font-medium mb-6 leading-relaxed">
                "Struktura kurseva je odlična. Tačno te vodi korak po korak bez osećaja preplavljenosti informacijama."
              </p>
              <p className="text-[var(--text-main)] font-bold">— Marko S.</p>
            </div>
            <div className="p-8 rounded-3xl border border-[var(--primary)] bg-[var(--bg-accent-green)]">
              <p className="text-[var(--text-main)] font-medium mb-6 leading-relaxed">
                "Topla preporuka za svakoga ko želi da radi na sebi na jedan strukturisan i profesionalan način."
              </p>
              <p className="text-[var(--text-main)] font-bold">— Jelena T.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SEKCIJA */}
      <section className="py-24 bg-white">
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