/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'inegzzkuttzsznxfbsmp.supabase.co',
      'images.unsplash.com',
      'picsum.photos'
    ],
  },
}

export default nextConfig;
