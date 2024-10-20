/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a', // Deep blue
        accent: '#00ffb3', // Neon green
        futuristicBlue: '#00BFFF', // New futuristic blue color
        neonBlue: '#0ff',
        neonGreen: '#0f0',
        neonPurple: '#a00fff',
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        heading: ['Orbitron', 'sans-serif', 'Press Start 2P', 'Arial'], // Sci-fi inspired font for headings
      },
    },
  },
  plugins: [],
};
