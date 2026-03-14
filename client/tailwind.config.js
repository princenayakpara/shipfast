/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ship: {
          dark: '#0d1117',
          darker: '#010409',
          card: '#161b22',
          'card-hover': '#1c2129',
          border: '#30363d',
          muted: '#8b949e',
          accent: '#58a6ff',
          'accent-bright': '#79c0ff',
          success: '#3fb950',
          'success-bright': '#56d364',
          warning: '#d29922',
          error: '#f85149',
          purple: '#bc8cff',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in-up': 'fadeInUp .6s ease-out both',
        'fade-in': 'fadeIn .5s ease-out both',
        'slide-left': 'slideInLeft .5s ease-out both',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(88,166,255,.15)',
        'glow-md': '0 0 30px rgba(88,166,255,.2)',
        'glow-lg': '0 0 50px rgba(88,166,255,.25)',
        'card': '0 4px 24px rgba(0,0,0,.2)',
      },
    },
  },
  plugins: [],
}
