/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#151619',
          800: '#1A1C20',
          700: '#222831',
          600: '#2A303A',
          500: '#333945',
          400: '#393E46',
          300: '#4A505A',
          200: '#5C626D',
          100: '#6E7483',
          50: '#9CA3AF',
        },
        secondary: {
          900: '#5A5349',
          800: '#6A6256',
          700: '#7A7163',
          600: '#8A8070',
          500: '#948979',
          400: '#A09788',
          300: '#AFA795',
          200: '#BFB8A7',
          100: '#CFC9BB',
          50: '#DFD0B8',
        },
        success: {
          500: '#10B981',
          400: '#34D399',
        },
        warning: {
          500: '#F59E0B',
          400: '#FBBF24',
        },
        danger: {
          500: '#EF4444',
          400: '#F87171',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};