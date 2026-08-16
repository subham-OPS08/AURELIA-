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
        background: "#FAF9F6",
        foreground: "#1A1A1A",
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F5F3EF",
          subtle: "#EDE9E1",
          dark: "#121212",
          "dark-subtle": "#1A1A1A",
        },
        charcoal: {
          50: "#707070",
          100: "#555555",
          200: "#3D3D3D",
          DEFAULT: "#1A1A1A",
          900: "#0D0D0D",
        },
        sand: {
          50: "#FAF7F2",
          100: "#F4EFEA",
          200: "#E6DEC3",
          300: "#D3C8B4",
          400: "#B3A490",
          DEFAULT: "#8B7D6B",
          600: "#736655",
          700: "#5B5143",
          800: "#443C32",
        },
        gold: {
          muted: "#C5A880",
          light: "#EADCC9",
        },
        border: {
          DEFAULT: "#E6E3DC",
          light: "#F0EDE6",
          dark: "#2A2A28",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Helvetica Neue", "Arial", "sans-serif"],
      },
      letterSpacing: {
        luxury: "0.2em",
        "luxury-wide": "0.3em",
        "luxury-ultrawide": "0.4em",
      },
      borderRadius: {
        none: "0px",
        xs: "1px",
        sm: "2px",
        DEFAULT: "3px",
        md: "4px",
        lg: "6px",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        floatSlow: "floatSlow 3s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
