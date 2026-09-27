import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/player/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#080713",
        deepPurple: "#160A2B",
        neonPink: "#FF2DAA",
        hotMagenta: "#FF3DCE",
        electricCyan: "#27E5FF",
        sunsetOrange: "#FF7849",
        sunsetGold: "#FFB347",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        "neon-pink": "0 0 18px rgba(255, 45, 170, 0.35), 0 0 4px rgba(255, 45, 170, 0.6)",
        "neon-cyan": "0 0 18px rgba(39, 229, 255, 0.35), 0 0 4px rgba(39, 229, 255, 0.6)",
        "chrome-inset": "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.7)",
        "smoked-glass": "inset 0 2px 14px rgba(0,0,0,0.85), 0 1px 0 rgba(255,255,255,0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
