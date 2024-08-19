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
                'neon-green': '#00FFAF', // Custom neon green color
                'futuristic-blue': '#00BFFF', // New futuristic blue color
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        heading: ['Orbitron', 'sans-serif'], // Sci-fi inspired font for headings
      },
    },
  },
  plugins: [],
};
