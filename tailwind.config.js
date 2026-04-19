/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'scm-blue': '#0a192f', // Elegant Deep Navy
        'scm-accent': '#d99b38', // Sweet Honey Amber
        'scm-red': '#e05a5a', // Soft Coral Red
        'scm-gold': '#f0bf4c', // Warm Soft Gold
        'scm-cream': '#faf9f6', // Clean Alabaster White
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['Outfit', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in': { 
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-up': {
          '0%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        'fade-in-fast': {
          '0%': { opacity: '0', transform: 'translateY(-5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(-3%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'scale-up': 'scale-up 0.3s ease-out forwards',
        'fade-in-fast': 'fade-in-fast 0.2s ease-out forwards',
        'bounce-slow': 'bounce-slow 3s infinite',
      }
    },
  },
  plugins: [],
}
