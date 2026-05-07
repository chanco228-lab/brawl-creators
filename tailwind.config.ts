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
        bs: {
          "yellow-light": "#FFE35B",
          yellow: "#FFB921",
          red: "#F01919",
          brown: "#C95E40",
          blue: "#3A86FF",
          green: "#4CAF50",
          purple: "#9B59B6",
          orange: "#FF6B35",
        },
        surface: {
          primary: "#1A1A2E",
          card: "#16213E",
          hover: "#0F3460",
          elevated: "#1E2A4A",
          border: "#2A3A5A",
          dark: "#0D0D1A",
        },
      },
      fontFamily: {
        "bs-display": ['"Fredoka One"', '"Lilita One"', "cursive"],
        "bs-ui":      ['"Lilita One"', "sans-serif"],
        "bs-body":    ['"Noto Sans JP"', "sans-serif"],
      },
      borderRadius: {
        bs:    "12px",
        "bs-lg": "16px",
      },
      boxShadow: {
        "bs-btn":      "0 4px 0 #5C2D00, 0 6px 12px rgba(0,0,0,0.3)",
        "bs-btn-hover":"0 6px 0 #5C2D00, 0 8px 16px rgba(0,0,0,0.4)",
        "bs-card":     "inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.4)",
        "bs-glow":     "0 0 20px rgba(255,185,33,0.3)",
      },
      animation: {
        "bs-pop":      "bs-pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "bs-slide-up": "bs-slide-up 0.4s ease-out both",
        "bs-glow":     "bs-glow-pulse 2s ease-in-out infinite",
      },
      keyframes: {
        "bs-pop-in": {
          "0%":   { transform: "scale(0.5)", opacity: "0" },
          "70%":  { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "bs-slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "bs-glow-pulse": {
          "0%, 100%": { boxShadow: "0 3px 0 #5C2D00, 0 0 10px rgba(255,185,33,0.2)" },
          "50%":      { boxShadow: "0 3px 0 #5C2D00, 0 0 25px rgba(255,185,33,0.5)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
