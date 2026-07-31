import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#07080A',
        panel: '#12151C',
        panel2: '#1B1F28',
        cream: '#FAF7F1',
        muted: '#C8CAD1',
        gold: '#EED08A',
        gold2: '#C4A055',
        violet: '#A58CF0',
        line: 'rgba(255,255,255,0.14)',
        success: '#86DDAA',
        warning: '#F5C57A',
        danger: '#F08A8A',
      },
      boxShadow: {
        glow: '0 0 40px rgba(141, 109, 232, 0.15)',
      },
    },
  },
  plugins: [],
} satisfies Config;
