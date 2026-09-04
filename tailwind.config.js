/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Revolut-inspired deep dark palette
        background: '#080D19',
        surface: '#0F1629',
        surfaceElevated: '#182038',
        surfaceBorder: '#1E2A45',
        surfaceHover: '#223354',
        // Glassmorphism surface
        glass: 'rgba(15, 22, 41, 0.65)',
        glassBorder: 'rgba(255, 255, 255, 0.08)',
        // Text hierarchy
        ink: '#F8FAFC',
        inkMuted: '#94A3B8',
        inkSubtle: '#64748B',
        inkDark: '#080D19',
        // Brand accent — electric cyan
        brand: '#00F2FE',
        brandDark: '#0284C7',
        brandMuted: 'rgba(0, 242, 254, 0.12)',
        // Semantic colors
        leaf: '#10B981',
        leafMuted: 'rgba(16, 185, 129, 0.12)',
        leafDark: '#059669',
        danger: '#EF4444',
        dangerMuted: 'rgba(239, 68, 68, 0.12)',
        dangerDark: '#DC2626',
        amber: '#F59E0B',
        amberMuted: 'rgba(245, 158, 11, 0.12)',
        amberDark: '#D97706',
        // Accent aliases
        sky: '#00F2FE',
        coral: '#EF4444',
        mint: '#10B981',
        peach: '#F59E0B',
        periwinkle: '#818CF8',
      },
    },
  },
  plugins: [],
};