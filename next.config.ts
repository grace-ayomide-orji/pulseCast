import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.cnn.com',
      },
      {
        protocol: 'https',
        hostname: '*.cnn.com',
      },
      {
        protocol: 'https',
        hostname: 'ichef.bbci.co.uk',
      },
      {
        protocol: 'https',
        hostname: '*.bbci.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'static01.nyt.com',
      },
      {
        protocol: 'https',
        hostname: '*.nyt.com',
      },
      {
        protocol: 'https',
        hostname: 'images.wsj.net',
      },
      {
        protocol: 'https',
        hostname: '*.wsj.net',
      },
      {
        protocol: 'https',
        hostname: 'assets.bwbx.io',
      },
      {
        protocol: 'https',
        hostname: '*.bwbx.io',
      },
      {
        protocol: 'https',
        hostname: 'image.cnbcfm.com',
      },
      {
        protocol: 'https',
        hostname: '*.cnbcfm.com',
      },
      {
        protocol: 'https',
        hostname: 's.yimg.com',
      },
      {
        protocol: 'https',
        hostname: '*.yimg.com',
      },
      {
        protocol: 'https',
        hostname: 'a57.foxnews.com',
      },
      {
        protocol: 'https',
        hostname: '*.foxnews.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.cnn.com',
      },
      {
        protocol: 'https',
        hostname: 'www.aljazeera.com',
      },
      {
        protocol: 'https',
        hostname: '*.aljazeera.com',
      },
      {
        protocol: 'https',
        hostname: 'static.politico.com',
      },
      {
        protocol: 'https',
        hostname: '*.politico.com',
      },
      {
        protocol: 'https',
        hostname: 'media.wired.com',
      },
      {
        protocol: 'https',
        hostname: '*.wired.com',
      },
      {
        protocol: 'https',
        hostname: 'media.npr.org',
      },
      {
        protocol: 'https',
        hostname: '*.npr.org',
      },
      // Fallback patterns for common news sources
      {
        protocol: 'https',
        hostname: '**.com',
      },
      {
        protocol: 'https',
        hostname: '**.org',
      },
      {
        protocol: 'https',
        hostname: '**.net',
      },
      {
        protocol: 'https',
        hostname: '**.co.uk',
      },
    ],
  },
};

export default nextConfig;