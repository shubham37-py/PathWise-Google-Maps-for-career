import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{js,ts,jsx,tsx,mdx,css}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          app: "var(--bg-app)",
        },
        surface: {
          base: "var(--surface-base)",
          subtle: "var(--surface-subtle)",
          muted: "var(--surface-muted)",
        },
        border: {
          DEFAULT: "var(--border-default)",
          subtle: "var(--border-subtle)",
          strong: "var(--border-strong)",
        },
        ink: {
          primary: "var(--ink-primary)",
          secondary: "var(--ink-secondary)",
          muted: "var(--ink-muted)",
          faint: "var(--ink-faint)",
          inverse: "var(--ink-inverse)",
        },
        gray: {
          50: "var(--gray-50)",
          100: "var(--gray-100)",
          200: "var(--gray-200)",
          300: "var(--gray-300)",
          400: "var(--gray-400)",
          500: "var(--gray-500)",
          600: "var(--gray-600)",
          700: "var(--gray-700)",
          800: "var(--gray-800)",
          900: "var(--gray-900)",
          950: "var(--gray-950)",
        },
        accent: {
          DEFAULT: "var(--accent-base)",
          hover: "var(--accent-hover)",
          active: "var(--accent-active)",
          subtle: "var(--accent-subtle)",
          border: "var(--accent-border)",
          contrast: "var(--accent-contrast)",
        },
        semantic: {
          green: {
            text: "var(--semantic-green-text)",
            surface: "var(--semantic-green-surface)",
            border: "var(--semantic-green-border)",
            solid: "var(--semantic-green-solid)",
          },
          amber: {
            text: "var(--semantic-amber-text)",
            surface: "var(--semantic-amber-surface)",
            border: "var(--semantic-amber-border)",
            solid: "var(--semantic-amber-solid)",
          },
          red: {
            text: "var(--semantic-red-text)",
            surface: "var(--semantic-red-surface)",
            border: "var(--semantic-red-border)",
            solid: "var(--semantic-red-solid)",
          },
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        overlay: "var(--shadow-overlay)",
        modal: "var(--shadow-modal)",
        none: "none",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["var(--font-newsreader)", "Georgia", "serif"],
      },
      fontSize: {
        "12": ["var(--font-size-12)", { lineHeight: "1.4" }],
        "14": ["var(--font-size-14)", { lineHeight: "1.45" }],
        "16": ["var(--font-size-16)", { lineHeight: "1.55" }],
        "20": ["var(--font-size-20)", { lineHeight: "1.35", letterSpacing: "-0.01em" }],
        "24": ["var(--font-size-24)", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "32": ["var(--font-size-32)", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        "48": ["var(--font-size-48)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
      },
      maxWidth: {
        content: "var(--max-content-width)",
        prose: "var(--max-prose-width)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "200ms",
        slow: "250ms",
      },
    },
  },
  plugins: [],
};

export default config;
