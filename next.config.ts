import createNextIntlPlugin from 'next-intl/plugin';



const withNextIntl = createNextIntlPlugin();
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'my-page-negiupp.s3.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'pandorai.s3.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'contents.mediadecathlon.com',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'img.daisyui.com',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);