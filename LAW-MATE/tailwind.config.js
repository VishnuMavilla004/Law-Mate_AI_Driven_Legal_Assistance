/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AI‑powered palette
        primary: {
          DEFAULT: '#1E3A8A',
          light: '#4A60B2',
          dark: '#102c5e',
        },
        secondary: {
          DEFAULT: '#06B6D4',
          light: '#4ddce6',
          dark: '#0498ad',
        },
        accent: {
          DEFAULT: '#7C3AED',
          light: '#a16cff',
          dark: '#5826b2',
        },
        neutral: colors.slate,
        // retain a warning palette for alerts
        warning: colors.amber,
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Playfair Display', 'serif'], // Serif fonts add a legal/formal touch
      }
    },
  },
  plugins: [],
}