import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      spacing: {
        'touch-xs': '8px',
        'touch-sm': '12px',
        'touch-md': '16px',
        'touch-lg': '20px',
        'touch-xl': '24px'
      }
    },
  },
  plugins: [],
} satisfies Config
