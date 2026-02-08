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
          neon: '#00ffcc',
          red: '#ff3333',
          dark: '#050505',
          border: 'rgba(0, 255, 204, 0.3)',
          green: '#00ff88',
          greenDim: 'rgba(0, 255, 136, 0.3)',
          surface: 'rgba(5, 5, 5, 0.8)',
          dim: '#666666'
        }
      },
      fontFamily: {
        'tech': ['Orbitron', 'monospace'],
        'terminal': ['Rajdhani', 'monospace']
      },
      animation: {
        'ping-fast': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse-fast': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slide-up 0.25s ease-out forwards'
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 255, 136, 0.8)' }
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
