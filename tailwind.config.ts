import type { Config } from 'tailwindcss'

// Colors are driven by CSS variables (see app/assets/css/main.css) so themes can
// be swapped at runtime. Each variable holds space-separated RGB channels, which
// lets Tailwind's opacity modifiers (e.g. bg-accent/20) keep working.
const withVar = (name: string) => `rgb(var(${name}) / <alpha-value>)`

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        ink: {
          950: withVar('--ink-950'),
          900: withVar('--ink-900'),
          850: withVar('--ink-850'),
          800: withVar('--ink-800'),
          700: withVar('--ink-700'),
          600: withVar('--ink-600'),
          500: withVar('--ink-500'),
        },
        accent: {
          DEFAULT: withVar('--accent'),
          soft: withVar('--accent-soft'),
        },
      },
      fontFamily: {
        sans: ['"Montserrat Variable"', 'Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Anonymous Pro"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
}
