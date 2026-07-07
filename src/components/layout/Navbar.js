"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInitial, setUserInitial] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const name = user.user_metadata?.full_name || user.email || 'K';
          setUserInitial(name.charAt(0).toUpperCase());
        }
      } catch (error) {
        console.error("Greška pri proveri korisnika:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-soft)] border-b border-[var(--accent-soft)]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-20">
        
        <div className="flex-shrink-0">
          <Link 
            href="/" 
            onClick={() => setIsMenuOpen(false)} 
            className="flex items-center gap-3 text-xl md:text-2xl font-extrabold tracking-tight text-[var(--text-main)]"
          >
            <Image 
              src="/icon.svg" 
              alt="Emocionalna Pismenost Logo" 
              width={32} 
              height={32} 
              className="w-8 h-8 md:w-10 md:h-10"
              priority
            />
            <span>
              Emocionalna Pismenost
            </span>
          </Link>
        </div>

        {/* Dodato apsolutno pozicioniranje za savršeno centriranje */}
        <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-10 text-sm font-bold uppercase tracking-wider text-[var(--text-main)]">
          <Link href="/kursevi" className="relative group py-2">
            <span className="block group-hover:text-[var(--primary)] transition-colors duration-300">Kursevi</span>
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--primary)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out"></span>
          </Link>
          <Link href="/o-nama" className="relative group py-2">
            <span className="block group-hover:text-[var(--primary)] transition-colors duration-300">O nama</span>
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--primary)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out"></span>
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-6">
          {!isLoading && (
            userInitial ? (
              <div className="flex items-center gap-4">
                <Link href="/my-courses" className="text-sm font-bold uppercase tracking-wider text-[var(--text-main)] hover:text-[var(--primary)] transition-colors">
                  Moji Kursevi
                </Link>
                <Link href="/profile" className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-lg hover:bg-[var(--primary-hover)] transition-colors shadow-sm">
                  {userInitial}
                </Link>
              </div>
            ) : (
              <Link href="/login" className="bg-[var(--primary)] text-white px-6 py-3 text-sm font-bold flex items-center gap-2 rounded-full hover:bg-[var(--primary-hover)] transition-colors shadow-sm">
                Prijava
              </Link>
            )
          )}
        </div>

        <button 
          className="md:hidden flex flex-col items-center justify-center gap-1.5 p-2"
          onClick={toggleMenu}
          aria-label="Otvori meni"
        >
          <span className={`block w-6 h-[2px] bg-[var(--text-main)] transition-transform duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`}></span>
          <span className={`block w-6 h-[2px] bg-[var(--text-main)] transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-[2px] bg-[var(--text-main)] transition-transform duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`}></span>
        </button>
      </div>

      {/* Mobilni meni */}
      <div 
        className={`md:hidden absolute top-20 left-0 w-full bg-[var(--bg-soft)] border-b border-[var(--accent-soft)] transition-all duration-300 ease-in-out overflow-hidden -z-10 ${isMenuOpen ? 'max-h-[500px] border-t opacity-100 shadow-xl' : 'max-h-0 opacity-0'}`}
      >
        <nav className="flex flex-col px-6 py-6 gap-4 text-lg font-medium text-[var(--text-main)]">
          <Link href="/kursevi" onClick={() => setIsMenuOpen(false)} className="border-b border-[var(--accent-soft)] pb-3 hover:text-[var(--primary)] transition-colors">Kursevi</Link>
          <Link href="/o-nama" onClick={() => setIsMenuOpen(false)} className="border-b border-[var(--accent-soft)] pb-3 hover:text-[var(--primary)] transition-colors">O nama</Link>
          
          {!isLoading && (
            userInitial ? (
              <>
                <Link href="/my-courses" onClick={() => setIsMenuOpen(false)} className="border-b border-[var(--accent-soft)] pb-3 hover:text-[var(--primary)] transition-colors">Moji Kursevi</Link>
                <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="border-b border-[var(--accent-soft)] pb-3 hover:text-[var(--primary)] transition-colors flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm">
                    {userInitial}
                  </div>
                  Podešavanja profila
                </Link>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsMenuOpen(false)} className="bg-[var(--primary)] text-white px-6 py-4 mt-2 text-sm font-bold flex justify-center items-center rounded-full hover:bg-[var(--primary-hover)] transition-colors shadow-sm">
                Prijava
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}