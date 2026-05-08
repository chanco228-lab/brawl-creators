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
        brand: {
          DEFAULT: "#FFB921",
          light:   "#FFF3D6",
          hover:   "#F5A800",
        },
        surface: {
          DEFAULT: "#FAFAFA",
          card:    "#FFFFFF",
          subtle:  "#F5F5F7",
        },
        "c-border": {
          DEFAULT: "#E8E8ED",
          hover:   "#D0D0D8",
        },
        "text-primary":   "#1A1A1A",
        "text-secondary": "#6B6B80",
        "text-muted":     "#9B9BB0",
        accent: {
          red:   "#FF4757",
          blue:  "#3B82F6",
          green: "#22C55E",
        },
      },
      fontFamily: {
        display: ['"Outfit"', "sans-serif"],
        body:    ['"Noto Sans JP"', "sans-serif"],
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        card:       "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        "card-hover":"0 12px 40px rgba(0,0,0,0.08)",
        btn:        "0 4px 12px rgba(255,185,33,0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
