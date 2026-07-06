export default function Avatar({ name }) {
  // Uzimamo prvo slovo imena, ili 'U' (User) kao fallback
  const initial = name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-sm">
      {initial}
    </div>
  );
}