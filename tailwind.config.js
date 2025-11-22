// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e5eff',
        'text-primary': '#121212',
        'text-secondary': '#5a607f',
        'text-muted': '#a1a7c4',
        'border-light': '#e6e9f4',
        'border-medium': '#d9e1ec',
        'bg-light': '#f5f6fa',
      },
      fontFamily: {
        // Thiết lập Manrope làm font mặc định (sans) cho toàn bộ ứng dụng
        sans: ['Manrope', 'sans-serif'],
      }
    },
  },
  plugins: [],
}