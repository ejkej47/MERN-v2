export const getStorageUrl = (path) => {
  if (!path) return null;
  const baseUrl = "https://wslshkalwiruolpvsdgu.supabase.co/storage/v1/object/public/Course-assets";
  return `${baseUrl}/${path}`;
};