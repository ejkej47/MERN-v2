import Link from 'next/link';
import { FaInstagram, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-soft)] text-[var(--text-main)] pt-16 pb-8 border-t border-[var(--accent-soft)]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* 1. CTA Sekcija */}
        <div className="flex flex-col items-center text-center pb-16 border-b border-[var(--accent-soft)] mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Spremni za promenu?</h2>
          <p className="font-medium mb-8 max-w-2xl text-lg opacity-80">
            Započnite rad na sebi već danas. Pridružite se programu i dobijte pristup alatima za emocionalnu transformaciju.
          </p>
          <Link 
            href="/kursevi" 
            className="bg-[var(--primary)] text-white px-8 py-3 rounded-full font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-sm"
          >
            Pogledajte programe
          </Link>
        </div>

        {/* 2. Glavni deo - Navigacija, Kontakt i mreže */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Brend i kratak opis */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-xl md:text-2xl font-extrabold tracking-tight">
              Emocionalna <span className="text-[var(--primary)]">Pismenost.</span>
            </Link>
            <p className="text-sm font-medium opacity-80 max-w-xs leading-relaxed">
              Strukturisan pristup radu na sebi i boljoj emocionalnoj regulaciji kroz duboko razumevanje sopstvenih mehanizama.
            </p>
          </div>

          {/* Brzi linkovi */}
          <div className="flex flex-col gap-4 md:items-center">
            <div className="flex flex-col gap-4 w-fit">
              <h3 className="font-bold tracking-widest uppercase mb-2 text-sm opacity-50">Navigacija</h3>
              <nav className="flex flex-col gap-3 font-medium">
                <Link href="/kursevi" className="hover:text-[var(--primary)] transition-colors w-fit">Kursevi</Link>
                <Link href="/o-nama" className="hover:text-[var(--primary)] transition-colors w-fit">O nama</Link>
                <Link href="/login" className="hover:text-[var(--primary)] transition-colors w-fit">Prijava / Moj nalog</Link>
              </nav>
            </div>
          </div>

          {/* Kontakt i Mreže */}
          <div className="flex flex-col gap-4 md:items-end text-left md:text-right">
            <h3 className="font-bold tracking-widest uppercase mb-2 text-sm opacity-50">Kontakt</h3>
            <a href="mailto:kontakt@emocionalnapismenost.com" className="flex items-center md:justify-end gap-3 hover:text-[var(--primary)] transition-colors font-medium mb-4">
              <FaEnvelope size={18} />
              <span>kontakt@emocionalnapismenost.com</span>
            </a>
            <div className="flex gap-4 md:justify-end">
              <Link href="https://instagram.com/" aria-label="Instagram" className="bg-[var(--accent-soft)] p-3 rounded-full hover:bg-[var(--primary)] hover:text-white transition-all">
                <FaInstagram size={20} />
              </Link>
            </div>
          </div>
          
        </div>

        {/* Disclaimer / Napomena */}
        <div className="pb-8 mb-8 border-b border-[var(--accent-soft)]">
          <p className="text-xs md:text-sm font-medium opacity-60 text-center max-w-4xl mx-auto leading-relaxed">
            Napomena: Materijali i kursevi na ovoj platformi su isključivo edukativnog karaktera i služe za lični razvoj. 
            Oni ne predstavljaju medicinski savet, dijagnozu i nisu u potpunosti zamena za stručnu individualnu psihoterapiju ili psihijatrijsko lečenje.
          </p>
        </div>

        {/* 3. Donji deo (Copyright i pravni linkovi) */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center text-xs font-medium gap-4 md:gap-0 opacity-80">
          <p>© {new Date().getFullYear()} Emocionalna Pismenost. Sva prava zadržana.</p>
          <div className="flex gap-6">
            <Link href="/politika-privatnosti" className="hover:text-[var(--primary)] transition-colors">Politika privatnosti</Link>
            <Link href="/uslovi-koriscenja" className="hover:text-[var(--primary)] transition-colors">Uslovi korišćenja</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}