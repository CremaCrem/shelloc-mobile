/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#E9E8F2',
        surface: '#FFFFFF',
        surfaceMuted: '#F4F4F5',
        ink: '#111111',
        inkMuted: '#6B6B76',
        coral: '#F4A99C',
        coralMuted: 'rgba(244, 169, 156, 0.2)',
        coralDark: '#D95D48',
        periwinkle: '#ADA3E3',
        periwinkleMuted: 'rgba(173, 163, 227, 0.2)',
        periwinkleDark: '#584DB2',
        mint: '#A3D9C9',
        mintMuted: 'rgba(163, 217, 201, 0.2)',
        mintDark: '#2E8B73',
        peach: '#F4C99B',
        peachMuted: 'rgba(244, 201, 155, 0.2)',
        peachDark: '#C87A28',
        rose: '#F0A79E',
        sky: '#4F91D6',
        leaf: '#5CBB79',
        amber: '#F2B84C',
        danger: '#E76A54',
      },
    },
  },
  plugins: [],
};