/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#141417',
          hover: '#27272D',
          muted: '#63636E',
        },
        mercury: {
          canvas: '#FAFAFA',
          well: '#F2F2F4',
          card: '#FFFFFF',
          border: '#E4E4E7',
          subtle: '#EDEDF3',
          periwinkle: '#9CB4E8',
          lavender: '#AFB2CE',
          dark: '#171721',
        },
        emeraldSignal: {
          DEFAULT: '#059669',
          light: '#ECFDF5',
          border: '#A7F3D0',
        },
        civic: {
          navy: '#004B87',
          navyHover: '#002D54',
          navyLight: '#E8F4FD',
          canvas: '#FAFAFA',
          card: '#FFFFFF',
          border: '#E4E4E7',
          borderSubtle: 'rgba(20, 20, 23, 0.08)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        hindi: ['"Noto Sans Devanagari"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      transitionTimingFunction: {
        snappy: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '250': '250ms',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        'cta': '0 4px 14px 0 rgba(0, 75, 135, 0.3)',
        'cta-hover': '0 6px 20px 0 rgba(0, 75, 135, 0.45)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-spring': {
          '0%': { transform: 'scale(0.98)' },
          '100%': { transform: 'scale(1)' },
        },
        'eq-bar': {
          '0%, 100%': { height: '3px' },
          '50%': { height: '12px' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-spring': 'scale-spring 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'eq-bar-1': 'eq-bar 0.55s ease-in-out infinite',
        'eq-bar-2': 'eq-bar 0.55s ease-in-out 0.18s infinite',
        'eq-bar-3': 'eq-bar 0.55s ease-in-out 0.36s infinite',
      },
    },
  },
  plugins: [],
}
