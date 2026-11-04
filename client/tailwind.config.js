/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forest-green': '#174C35',
        'fresh-green': '#65A66B',
        'light-sage': '#DCEBDD',
        'soft-cream': '#F5F7EF',
        'deep-charcoal': '#26352D',
        'muted-green': '#78857B',
        'border-green': '#E4EAE2',
        'warning-amber': '#D99B37',
        'error-red': '#C65D52',
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(23, 76, 53, 0.06), 0 2px 6px -1px rgba(23, 76, 53, 0.04)',
        'card-hover': '0 10px 25px -3px rgba(23, 76, 53, 0.1), 0 4px 10px -2px rgba(23, 76, 53, 0.06)',
      }
    },
  },
  plugins: [],
}
