import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#080C14',
        teal: {
          DEFAULT: '#00FFD1',
          dim: 'rgba(0,255,209,0.08)',
          border: 'rgba(0,255,209,0.3)',
        },
        gold: {
          DEFAULT: '#F5C842',
          dim: 'rgba(245,200,66,0.08)',
        },
        violet: {
          DEFAULT: '#8A5AFF',
        },
        danger: '#FF3B5C',
        glass: {
          DEFAULT: 'rgba(255,255,255,0.03)',
          hover: 'rgba(255,255,255,0.06)',
          border: 'rgba(255,255,255,0.07)',
        },
      },
      fontFamily: {
        syne: ['Sora', '"Space Grotesk"', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      keyframes: {
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0px rgba(255,59,92,0)' },
          '50%': { opacity: '1', boxShadow: '0 0 18px rgba(255,59,92,0.28)' },
        },
        float: {
          '0%': { transform: 'translateY(-4px)' },
          '100%': { transform: 'translateY(4px)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        bob: 'bob 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2.8s ease-in-out infinite',
        float: 'float 4.5s ease-in-out infinite alternate',
        'spin-slow': 'spin-slow 14s linear infinite',
        shimmer: 'shimmer 2.4s ease-in-out infinite',
      },
      boxShadow: {
        'teal-glow': '0 0 22px rgba(0,255,209,0.1)',
        'gold-glow': '0 0 22px rgba(245,200,66,0.1)',
        'glass-inner': 'inset 0 0 0 1px rgba(255,255,255,0.07)',
      },
      backdropBlur: {
        glass: '14px',
      },
    },
  },
  plugins: [],
}

export default config
