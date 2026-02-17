export const getStorageUrl = (path) => {
  if (!path) return null;

  // 1. Ako putanja VEĆ sadrži "supabase.co", to znači da je link potpun
  // Ne dodaj bazu ponovo, samo vrati taj path
  if (path.includes('wslshkalwiruolpvsdgu.supabase.co')) {
    return path;
  }

  // 2. Ako je običan Google link, takođe ga ne diraj
  if (path.startsWith('http')) {
    return path;
  }

  const baseUrl = "https://wslshkalwiruolpvsdgu.supabase.co/storage/v1/object/public/Course-assets";
  
  // 3. Spoji samo ako je u bazi samo naziv fajla (npr. "asertivna-prava.png")
  return `${baseUrl}/${path}`;
};