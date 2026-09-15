import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "hsl(var(--ink))",
        paper: "hsl(var(--paper))",
        muted: "hsl(var(--muted))",
        line: "hsl(var(--line))",
        lime: "hsl(var(--lime))",
        coral: "hsl(var(--coral))",
      },
      fontFamily: { sans: ["var(--font-manrope)", "sans-serif"], display: ["var(--font-space-grotesk)", "sans-serif"] },
      boxShadow: { soft: "0 18px 50px rgba(28, 35, 29, 0.08)" },
    },
  },
  plugins: [],
};

export default config;