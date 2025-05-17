import type { Metadata, Viewport } from 'next';

const siteConfig = {
  title: 'Clarylisk',
  description:
    'Clarylisk is a platform for creating and managing creator profiles on the Ethereum blockchain.',
  keywords:
    'Clarylisk, Ethereum, Blockchain, Creator Profiles, Donations, Transactions',
  author: 'Clarylisk',
} as const;

export const viewport: Viewport = {
  themeColor: '#f2f2f7',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
} as const;

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      {
        url: '/img/logo.png', // Path relatif dari folder public
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    // Tambahkan juga ukuran lain untuk kompatibilitas yang lebih baik
    apple: [
      {
        url: '/img/logo.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcut: '/img/logo.png',
    // Tambahkan favicon klasik 16x16 dan 32x32 juga
    other: [
      {
        url: '/favicon.ico',
        sizes: '16x16',
        type: 'image/x-icon',
      },
      {
        url: '/img/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
  },
  openGraph: {
    type: 'website',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: '/img/logo.png', // Path relatif dari folder public
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: ['/img/logo.png'], // Path relatif dari folder public
  },
} as const;