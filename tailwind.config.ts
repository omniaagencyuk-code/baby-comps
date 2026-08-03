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
        // Warm caramel/cream "premium baby" brand (from the approved design).
        brand: {
          50: '#fbf6ef',
          100: '#f6e5d7',
          200: '#f0d3b8',
          300: '#e6b98c',
          400: '#d59a5c',
          500: '#a9772f',
          600: '#825621', // primary
          700: '#6f4612',
          800: '#5a3810',
          900: '#4b2b00',
        },
        // Soft peach used for gentle background washes/accents.
        accent: {
          50: '#fff1e7',
          100: '#ffe6d2',
          200: '#feddbe',
          300: '#efcfb0',
          400: '#e6b98c',
          500: '#d59a5c',
          600: '#a9772f',
          700: '#6f4612',
        },
        // Material-style warm surfaces to match the design tokens.
        cream: '#fff8f4',
        sand: '#fbebde', // surface-container
        'surface-variant': '#f2dfcf',
        'outline-warm': '#c0afa0',
        secondaryink: '#735b42', // secondary text/headings
        muted: '#6a5d50', // on-surface-variant
        ink: '#3b3026', // on-surface
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
        card: '0 4px 20px -6px rgba(130, 86, 33, 0.12)',
        'card-hover': '0 12px 34px -10px rgba(130, 86, 33, 0.22)',
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
