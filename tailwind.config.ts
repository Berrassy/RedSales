import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#1F1F1F",
        foreground: "#FFFFFF",
        muted: {
          DEFAULT: "#C4C4C4",
          foreground: "#C4C4C4",
        },
        accent: {
          DEFAULT: "#0E3B2C",
          foreground: "#FFFFFF",
        },
        border: "#2A2A2A",
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "0px",
        md: "0px",
        sm: "0px",
      },
    },
  },
  plugins: [],
};

export default config;

