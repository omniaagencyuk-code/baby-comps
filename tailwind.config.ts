import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        // "Premium Nursery" brand — Soft Chestnut, built into a light,
        // premium beige/chestnut scale. 600 is the primary brand colour.
        brand: {
          50: '#f5eee6', // very light chestnut tint (hover backgrounds)
          100: '#ede2d4', // Oatmeal — badges, progress track, icon chips
          200: '#d7c3ae', // Teddy Beige — soft borders
          300: '#c7af97',
          400: '#b4927e', // Clay — secondary brown, focus rings
          500: '#a17e68',
          600: '#916c58', // Soft Chestnut — PRIMARY brand colour
          700: '#785845', // darker chestnut — hover, links, badge text
          800: '#5c4335',
          900: '#46372f',
        },
        // Muted Olive — used very sparingly for small accents/decoration only.
        accent: {
          50: '#f3f3ec',
          100: '#e8e8dc',
          200: '#d5d4c1',
          300: '#c2c0a6',
          400: '#aaa88b', // Muted Olive
          500: '#94926f',
          600: '#7c7a5a',
          700: '#63613f',
        },
        // Neutral surfaces — light & premium.
        cream: '#fbf8f3', // Milk — dominant page background
        sand: '#ede2d4', // Oatmeal — section separation
        'surface-variant': '#d7c3ae', // Teddy Beige — subtle card/section borders
        'outline-warm': '#b4927e', // Clay — input borders (used at reduced opacity)
        secondaryink: '#3a302b', // Dark Cocoa — headings
        muted: '#6e5e52', // soft cocoa — secondary text
        ink: '#3a302b', // Dark Cocoa — primary text / dark contrast
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1.5rem', // 24px cards to match the design
        '3xl': '1.75rem',
      },
      boxShadow: {
        card: '0 4px 20px -6px rgba(145, 108, 88, 0.12)',
        'card-hover': '0 12px 34px -10px rgba(145, 108, 88, 0.20)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
