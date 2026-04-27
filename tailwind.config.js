/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fb',
          400: '#36adf6',
          500: '#0c93e7',
          600: '#0074c5',
          700: '#015ca0',
          800: '#064f84',
          900: '#0b426e',
          950: '#072a49',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede8ff',
          200: '#dcd5ff',
          300: '#c3b2ff',
          400: '#a585ff',
          500: '#8b54fc',
          600: '#7c31f4',
          700: '#6d20e0',
          800: '#5b1abc',
          900: '#4c179a',
          950: '#2e0b69',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffeed4',
          200: '#ffd9a8',
          300: '#ffbd71',
          400: '#ff9638',
          500: '#fe7711',
          600: '#ef5c07',
          700: '#c64308',
          800: '#9d360f',
          900: '#7e2e10',
          950: '#441406',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        mono: ['Fira Code', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '72ch',
          },
        },
      },
    },
  },
  plugins: [],
};