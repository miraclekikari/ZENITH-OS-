/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zenith: {
          neon: '#10b981',
          red: '#ef4444',
          dark: '#0a0a0a',
          border: 'rgba(255, 255, 255, 0.06)',
          green: '#10b981',
          greenDim: 'rgba(16, 185, 129, 0.15)',
          surface: 'rgba(17, 17, 17, 0.8)',
          dim: '#666666',
          bg: '#0a0a0a',
        }
      },
      fontFamily: {
        'tech': ['Orbitron', 'monospace'],
        'terminal': ['Rajdhani', 'sans-serif'],
      },
      animation: {
        'ping-fast': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse-fast': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slide-up 0.25s ease-out forwards',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)' }
        },
        'slide-up': {
          'from': { transform: 'translateY(100%)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}
