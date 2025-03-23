/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://curly-octo-rotary-phone.onrender.com/:path*',
        },
      ];
    },
  };
  
  export default nextConfig;