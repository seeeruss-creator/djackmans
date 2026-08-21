/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0B0906',
          cream: '#F7F1E4',
          gold: '#C9A15A',
          bronze: '#8C5A2B',
          'bronze-light': '#B97A3C',
          ink: '#1A1613',
        },
        admin: {
          primary: '#9A7040',
          'primary-dark': '#7A5630',
          'primary-light': '#C9A15A',
          soft: '#F3EBDD',
          bg: '#F4F0E8',
          border: '#E5DCCE',
          text: '#1A1613',
          muted: '#7A7166',
          sidebar: '#12100E',
          'sidebar-hover': '#1C1916',
          panel: '#FFFCF7',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'bronze-gradient': 'linear-gradient(135deg, #8C5A2B 0%, #B97A3C 50%, #C9A15A 100%)',
        'gold-gradient': 'linear-gradient(135deg, #C9A15A 0%, #E8C47A 100%)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        'fade-in-up': 'fadeInUp 0.8s ease forwards',
        'fade-in-up-delay': 'fadeInUp 0.8s ease 0.2s forwards',
        'fade-in-up-delay2': 'fadeInUp 0.8s ease 0.4s forwards',
      },
      boxShadow: {
        admin: '0 1px 2px rgba(26, 22, 19, 0.04), 0 8px 24px rgba(26, 22, 19, 0.06)',
        'admin-lg': '0 4px 6px rgba(26, 22, 19, 0.04), 0 16px 40px rgba(26, 22, 19, 0.08)',
      },
      borderRadius: {
        admin: '1rem',
      },
    },
  },
  plugins: [],
};
