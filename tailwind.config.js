/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        china: {
          red: '#dc2626',
          gold: '#d97706',
          dark: '#0f172a',
          accent: '#b91c1c',
          card: '#1e293b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'mobile-nav': '0 -4px 20px rgba(0, 0, 0, 0.08)',
        'card-soft': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.06)',
        'phone-frame': '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
}
