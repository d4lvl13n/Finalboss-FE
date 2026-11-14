/** @type {import('tailwindcss').Config} */

// FinalBoss brand palette. The stock Tailwind greys and yellows are REMAPPED to
// the brand's indigo and gold, so every existing `bg-gray-900`, `text-gray-400`,
// `text-yellow-400`… across the site picks up the redesign without touching
// each component. Change the brand here, not in individual files.
const night = {
  50: '#f4eddf',
  100: '#ece4d8',
  200: '#d9d1e6',
  300: '#c3bbd8',
  400: '#aaa1c6',
  500: '#8279a6',
  600: '#5a4f85',
  700: '#3a2f5e',
  750: '#30264f',
  800: '#241b40',
  900: '#17112b',
  950: '#0e0a1c',
};
const gold = {
  50: '#fffbea',
  100: '#fff3c2',
  200: '#ffe98a',
  300: '#ffdf57',
  400: '#ffcf24',
  500: '#f2bc00',
  600: '#c99a00',
  700: '#9a7600',
  800: '#6f5500',
  900: '#463600',
};

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a',
        accent: '#00ffb3',
        futuristicBlue: '#00BFFF',
        neonBlue: '#0ff',
        neonGreen: '#0f0',
        neonPurple: '#a00fff',
        gray: night,
        slate: night,
        zinc: night,
        neutral: night,
        yellow: gold,
        amber: gold,
        // The old site gave each section its own accent (purple guides, cyan
        // tech, pink highlights…). The brand has ONE accent: gold. Folding those
        // palettes into gold keeps every page on-brand without editing them.
        orange: gold,
        purple: gold,
        violet: gold,
        fuchsia: gold,
        pink: gold,
        indigo: gold,
        blue: gold,
        sky: gold,
        cyan: gold,
        teal: gold,
        boss: {
          night: '#17112b',
          pit: '#0e0a1c',
          stone: '#241b40',
          line: '#3a2f5e',
          bone: '#f4eddf',
          fog: '#aaa1c6',
          red: '#ff3d2e',
          gold: '#ffcf24',
          win: '#43e08a',
          ink: '#150f24',
        },
      },
      // Square, pixel-cut shapes are part of the identity: soft rounded cards
      // read as the old site. `rounded-full` (avatars, dots) is left alone.
      borderRadius: {
        sm: '0',
        DEFAULT: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        '3xl': '0',
      },
      fontFamily: {
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
