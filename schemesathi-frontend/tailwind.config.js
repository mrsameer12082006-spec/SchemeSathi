/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: "#F9F8F6",
        ink: "#1C1B1A",
        charcoal: "#1C1B1A",
        muted: "#6B6B6B",
        brand: {
          DEFAULT: "#166534",
          hover: "#14532D",
          light: "#DCFCE7",
        },
        forest: {
          DEFAULT: "#166534",
          dark: "#14532D",
          light: "#1F4E3D",
          soft: "#F0F7F4",
        },
        stone: {
          50: "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
        },
        // Mapped legacy tokens for seamless backward compatibility
        paper: "#F9F8F6",
        line: "#E7E5E4",
        saffron: "#166534",
        leaf: "#166534",
        night: "#F9F8F6",
        nightcard: "#FFFFFF",
        nightline: "#E7E5E4",
        mist: "#1C1B1A",
      },
      fontFamily: {
        serif: ["'Newsreader'", "Georgia", "serif"],
        heading: ["'Newsreader'", "Georgia", "serif"],
        sans: ["'Inter'", "'Noto Sans Devanagari'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'lift': '0 12px 30px -4px rgba(0, 0, 0, 0.08)',
        'chat': '0 8px 30px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      borderRadius: {
        '2xl': '1rem',
        'xl': '0.75rem',
      }
    },
  },
  plugins: [],
};
