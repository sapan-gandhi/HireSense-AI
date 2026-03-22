/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B1020',
        surface: '#12182B',
        surface2: '#141E35',
        surface3: '#1A2540',
        primary: '#6D5DF6',
        accent: '#38BDF8',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
