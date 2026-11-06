/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          // Primary Brand — Civic Navy (NIC compliant, 8.9:1 on white)
          navy: '#004B87',
          navyHover: '#002D54',
          navyLight: '#E8F4FD',

          // Canvas & Surfaces
          canvas: '#F8FAFC',
          card: '#FFFFFF',
          cardHover: '#F1F5F9',
          border: '#E2E8F0',
          borderStrong: '#CBD5E1',

          // Status: 3-way deterministic (WCAG AA compliant pairs)
          greenPass: '#15803D',
          greenPassBg: '#DCFCE7',
          greenPassBorder: '#86EFAC',

          amberPrompt: '#92400E',
          amberPromptBg: '#FEF3C7',
          amberPromptBorder: '#FCD34D',

          redFail: '#991B1B',
          redFailBg: '#FEE2E2',
          redFailBorder: '#FCA5A5',

          // Kiosk / Operator mode
          kiosk: '#0F172A',
          kioskAccent: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        hindi: ['"Noto Sans Devanagari"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        // Citizen mode bumped sizes
        'citizen-body': ['1.125rem', { lineHeight: '1.7' }],    // 18px
        'citizen-h1': ['2.5rem', { lineHeight: '1.15' }],       // 40px
        'citizen-h2': ['1.75rem', { lineHeight: '1.25' }],      // 28px
        'citizen-h3': ['1.25rem', { lineHeight: '1.4' }],       // 20px
      },
      spacing: {
        '18': '4.5rem',   // 72px — navbar height
        '13': '3.25rem',  // 52px — hero CTA height
      },
      borderRadius: {
        'bento': '1.25rem',  // 20px — Bento card corners
      },
      boxShadow: {
        'bento': '0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'bento-hover': '0 4px 12px -2px rgba(0,0,0,0.08), 0 2px 6px -2px rgba(0,0,0,0.04)',
        'card': '0 1px 2px 0 rgba(0,0,0,0.03)',
        'card-hover': '0 8px 24px -4px rgba(0,0,0,0.08)',
        'cta': '0 2px 8px -2px rgba(0,75,135,0.35)',
        'cta-hover': '0 4px 16px -2px rgba(0,75,135,0.45)',
        'slip': '0 0 0 1px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.04)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'eq-bar': {
          '0%, 100%': { height: '4px' },
          '50%': { height: '16px' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        'mic-pulse': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(180,83,9,0.4)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 0 12px rgba(180,83,9,0)' },
        },
        'check-draw': {
          '0%': { strokeDashoffset: '24' },
          '100%': { strokeDashoffset: '0' },
        },
        'progress-stripe': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.35s ease-out',
        'scale-in': 'scale-in 0.25s ease-out',
        'eq-bar-1': 'eq-bar 0.6s ease-in-out infinite',
        'eq-bar-2': 'eq-bar 0.6s ease-in-out 0.2s infinite',
        'eq-bar-3': 'eq-bar 0.6s ease-in-out 0.4s infinite',
        'pulse-ring': 'pulse-ring 1.2s ease-out infinite',
        'mic-pulse': 'mic-pulse 1.4s infinite',
        'check-draw': 'check-draw 0.3s ease-out forwards',
        'progress-stripe': 'progress-stripe 1s linear infinite',
      },
      screens: {
        'xs': '420px',
      },
    },
  },
  plugins: [],
}
