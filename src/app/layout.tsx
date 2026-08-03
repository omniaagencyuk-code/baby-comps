import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro, Manrope } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { siteConfig } from '@/lib/site';
import { getSession } from '@/lib/auth';
import { getSetting } from '@/lib/settings';

const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Win Premium Baby & Family Prizes`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ['baby competitions', 'UK prize draws', 'win baby prizes', 'family competitions'],
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: { card: 'summary_large_image', title: siteConfig.name, description: siteConfig.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#825621',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [session, announcement] = await Promise.all([
    getSession(),
    getSetting('site.announcement', 'Free UK delivery on all physical prizes · Trusted, verifiable draws'),
  ]);
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    sameAs: [siteConfig.social.instagram, siteConfig.social.facebook, siteConfig.social.tiktok],
  };
  const siteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/competitions?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
  return (
    <html lang="en-GB" className={`${beVietnam.variable} ${manrope.variable}`}>
      <head>
        {/* Material Symbols icon font. Loaded once for the whole app. */}
        {/* display=block avoids flashing the ligature text; correct for icon fonts. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([orgJsonLd, siteJsonLd]) }}
        />
        <SiteHeader session={session} announcement={announcement} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
