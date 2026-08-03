/** Central site configuration and constants. */
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Tiny Treasure Competitions',
  shortName: 'Tiny Treasure',
  description:
    'Win premium baby and family prizes for a fraction of their retail value. Trusted UK baby competitions with guaranteed draws and published winners.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  locale: 'en_GB',
  contactEmail: 'hello@tinytreasure.co.uk',
  social: {
    instagram: 'https://instagram.com/tinytreasurecomps',
    facebook: 'https://facebook.com/tinytreasurecomps',
    tiktok: 'https://tiktok.com/@tinytreasurecomps',
  },
  nav: [
    { label: 'Competitions', href: '/competitions' },
    { label: 'Winners', href: '/winners' },
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Blog', href: '/blog' },
    { label: 'FAQ', href: '/faq' },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
