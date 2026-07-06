/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wslshkalwiruolpvsdgu.supabase.co', // Tvoj Supabase hostname iz slike baze
        port: '',
        pathname: '/storage/v1/object/public/Course-assets/**', // Dozvoljavamo pristup samo 'course-assets' bucket-u
      },
    ],
  },
};

module.exports = nextConfig;