import './globals.css'; // OVO JE KLJUČNO!
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Platforma za rad na sebi',
  description: 'Vaš put ka boljoj emocionalnoj regulaciji',
}

export default function RootLayout({ children }) {
  return (
    <html lang="sr">
      {/* Dodajemo antialiased za lepši font i globalnu boju pozadine i teksta */}
      <body className="bg-[#F9F8F6] text-black antialiased min-h-screen flex flex-col">
        <Navbar />
        {/* flex-grow osigurava da footer uvek bude na dnu ekrana čak i ako ima malo sadržaja */}
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}