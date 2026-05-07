import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:      "#F4F6FF",
        surface: "#FFFFFF",
        border:  "#E8ECF4",
        text1:   "#1E1B2E",
        text2:   "#64748B",
        text3:   "#94A3B8",
        yellow:  "#FFB921",
        orange:  "#FF8C00",
        blue:    "#3D8EFF",
        purple:  "#9B4DFF",
        pink:    "#FF3CAC",
      },
      fontFamily: {
        "bs-title": ['"Fredoka One"', '"Lilita One"', "cursive"],
        "bs-ui":    ['"Lilita One"', "sans-serif"],
        "bs-body":  ['"Noto Sans JP"', "sans-serif"],
      },
      borderRadius: {
        "3xl": "24px",
        "4xl": "32px",
      },
      boxShadow: {
        card:    "0 2px 16px rgba(0,0,0,0.06)",
        "card-hover": "0 12px 44px rgba(0,0,0,0.12)",
        "glow-yellow": "0 4px 20px rgba(255,185,33,0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
