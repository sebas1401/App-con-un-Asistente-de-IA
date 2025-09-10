/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(0,0,0,.08)',
        'glass': '0 10px 40px rgba(0,0,0,.12)',
      }
    }
  },
  plugins: [],
};
