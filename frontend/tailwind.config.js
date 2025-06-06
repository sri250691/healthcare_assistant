/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // EY Brand Colors
        ey: {
          yellow: '#FFE600',
          black: '#2E2E2E',
          darkgray: '#1A1A1A',
          lightgray: '#F5F5F5',
          white: '#FFFFFF',
        },
        primary: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#FFE600',
          600: '#d97706',
          700: '#b45309',
        },
        healthcare: {
          primary: '#0078d4',
          secondary: '#2E2E2E',
          accent: '#1A1A1A',
          purple: '#5c2d91',
          light: '#e6f3ff',
          dark: '#004e8c'
        }
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#000000',
            a: {
              color: '#0078d4',
              '&:hover': {
                color: '#004e8c',
              },
            },
          },
        },
        invert: {
          css: {
            color: '#FFFFFF',
            a: {
              color: '#3b82f6',
              '&:hover': {
                color: '#60a5fa',
              },
            },
            strong: {
              color: '#FFFFFF',
            },
            h1: {
              color: '#FFFFFF',
            },
            h2: {
              color: '#FFFFFF',
            },
            h3: {
              color: '#FFFFFF',
            },
            code: {
              color: '#FFFFFF',
            },
            pre: {
              color: '#FFFFFF',
              backgroundColor: '#374151',
            },
          },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-soft': 'bounceSoft 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-3px)' },
          '60%': { transform: 'translateY(-2px)' },
        }
      }
    },
  },
  plugins: [],
}