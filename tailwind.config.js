/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          bg: '#F7F9FC',
          card: '#FFFFFF',
          secondary: '#F1F5F9',
          hover: '#EAF1F8',
          border: '#D9E2EC',
          navy: '#14213D',
          muted: '#52616B',
          disabled: '#94A3B8',
          blue: '#1769E0',
          deepBlue: '#0B2E59',
          cyan: '#0EA5C6',
          green: '#16803C',
          greenPale: '#EAF7EE',
          amber: '#C97700',
          amberPale: '#FFF5DF',
          red: '#C62828',
          redPale: '#FFF0F0',
          violet: '#6D4CCB',
          violetPale: '#F2EEFF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
