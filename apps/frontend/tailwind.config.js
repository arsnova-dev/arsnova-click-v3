/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        arsnova: {
          primary: '#6366f1',   // Indigo
          secondary: '#8b5cf6', // Violet
          accent: '#06b6d4',    // Cyan
        },
      },
    },
  },
  plugins: [],
};
