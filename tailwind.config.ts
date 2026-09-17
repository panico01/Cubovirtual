import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--color-background)',
        ink: 'var(--color-foreground)',
        card: 'var(--color-card)',
        muted: 'var(--color-muted)',
        subtle: 'var(--color-muted-foreground)',
        line: 'var(--color-border)',
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
      },
      boxShadow: {
        brutal: '6px 6px 0 var(--color-foreground)',
        'brutal-sm': '3px 3px 0 var(--color-foreground)',
      },
    },
  },
  plugins: [],
}
export default config
