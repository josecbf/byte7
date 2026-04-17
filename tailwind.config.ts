import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Paleta oficial COOPERGAC — verde profundo + sol dourado.
        brand: {
          50: "#e8f3ec",
          100: "#c7e1d0",
          200: "#9ccaae",
          300: "#6bb087",
          400: "#3f9663",
          500: "#1f7a47",
          600: "#155f37",
          700: "#0e4d2c",
          800: "#0a3d23",
          900: "#072d1a"
        },
        accent: {
          50: "#fff8e1",
          100: "#ffecb3",
          200: "#ffe082",
          300: "#ffd54f",
          400: "#ffca28",
          500: "#f5b800",
          600: "#d99e00",
          700: "#b07f00",
          800: "#8a6300",
          900: "#5e4400"
        },
        ink: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a"
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif"
        ]
      },
      boxShadow: {
        card: "0 1px 2px rgba(7,45,26,0.05), 0 1px 3px rgba(7,45,26,0.08)"
      }
    }
  },
  plugins: []
};

export default config;
