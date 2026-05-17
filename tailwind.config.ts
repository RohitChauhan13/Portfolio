import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        field: "rgb(var(--field) / <alpha-value>)",
        "field-foreground": "rgb(var(--field-foreground) / <alpha-value>)",
        "field-muted": "rgb(var(--field-muted) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        "danger-surface": "rgb(var(--danger-surface) / <alpha-value>)",
        "button-text": "rgb(var(--button-text) / <alpha-value>)"
      },
      boxShadow: {
        panel: "0 18px 60px rgba(22, 32, 45, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
