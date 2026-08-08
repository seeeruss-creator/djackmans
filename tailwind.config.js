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
          primary: '#5B4DDB',
          'primary-dark': '#4A3FC7',
          'primary-light': '#7B6FE3',
          soft: '#EDEAFB',
          bg: '#F5F6FA',
          border: '#E8E9F0',
          text: '#1F2937',
          muted: '#6B7280',
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
        admin: '0 1px 3px rgba(15, 23, 42, 0.06), 0 4px 12px rgba(15, 23, 42, 0.04)',
      },
    },
  },
  plugins: [],
};
