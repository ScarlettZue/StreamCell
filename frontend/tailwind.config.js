/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          // Azul Primario (Seguridad & Confianza)
          blue: '#3b82f6',
          'blue-hover': '#2563eb',
          'blue-light': '#60a5fa',
          // Morado Primario (Streaming & Entretenimiento)
          purple: '#8b5cf6',
          'purple-hover': '#7c3aed',
          'purple-light': '#a78bfa',
          // Acento Cian & Estado
          cyan: '#06b6d4',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b',
        },
        dark: {
          bg: '#090d16',
          card: '#111827',
          surface: '#1f2937',
          border: '#374151',
          hover: '#2d3748',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        glow: '0 0 25px rgba(139, 92, 246, 0.35)',
        'glow-blue': '0 0 25px rgba(59, 130, 246, 0.35)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        'brand-gradient-hover': 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
      },
    },
  },
  plugins: [],
};
