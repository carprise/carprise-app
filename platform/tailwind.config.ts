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
        panel: '#101216',
        panel2: '#171A20',
        cream: '#F4F0E8',
        muted: '#9B9DA4',
        gold: '#E6C779',
        gold2: '#B99448',
        violet: '#8D6DE8',
        line: 'rgba(255,255,255,0.10)',
        success: '#74D39A',
        warning: '#F2BB66',
        danger: '#EE7A7A',
      },
      boxShadow: {
        glow: '0 0 40px rgba(141, 109, 232, 0.15)',
      },
    },
  },
  plugins: [],
} satisfies Config;
