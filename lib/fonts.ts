// lib/fonts.ts
import localFont from 'next/font/local';

export const geistSans = localFont({
  src: [
    {
      path: '../public/fonts/Geist/Geist-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/fonts/Geist/Geist-UltraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../public/fonts/Geist/Geist-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/Geist/Geist-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Geist/Geist-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Geist/Geist-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/Geist/Geist-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/Geist/Geist-Black.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/Geist/Geist-UltraBlack.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-geist-sans',
});

export const calSans = localFont({
  src: '../public/fonts/CalSans-SemiBold.ttf',
  variable: '--font-calsans',
  weight: '600',
  style: 'normal',
});