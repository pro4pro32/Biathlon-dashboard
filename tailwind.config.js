module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050814',
        surface: '#0B1120',
        border: '#1E293B',
        primary: '#E63946',
        yellow: '#F4D03F',
        iceBlue: '#00E5FF',
        textPrimary: '#F8FAFC',
        textMuted: '#94A3B8',
      },
      fontFamily: {
        display: ['Barlow Condensed', 'sans-serif'],
        body: ['IBM Plex Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}