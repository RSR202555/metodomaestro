import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-container": "#201f1f",
        "error": "#ffb4ab",
        "primary-fixed-dim": "#e9c349",
        "tertiary": "#d0cdcd",
        "on-error-container": "#ffdad6",
        "outline-variant": "#4d4635",
        "on-secondary-container": "#b4b5b5",
        "on-secondary": "#2f3131",
        "on-primary-fixed": "#241a00",
        "on-error": "#690005",
        "secondary-fixed": "#e2e2e2",
        "on-secondary-fixed": "#1a1c1c",
        "tertiary-fixed-dim": "#c8c6c5",
        "primary": "#f2ca50",
        "inverse-on-surface": "#313030",
        "inverse-surface": "#e5e2e1",
        "tertiary-fixed": "#e5e2e1",
        "surface-container-low": "#1c1b1b",
        "surface-bright": "#3a3939",
        "primary-container": "#d4af37",
        "on-tertiary": "#313030",
        "surface-dim": "#131313",
        "surface-container-highest": "#353534",
        "on-surface": "#e5e2e1",
        "on-primary-container": "#554300",
        "surface-tint": "#e9c349",
        "surface": "#131313",
        "background": "#131313",
        "secondary-container": "#454747",
        "secondary": "#c6c6c7",
        "on-tertiary-fixed-variant": "#474746",
        "outline": "#99907c",
        "on-primary-fixed-variant": "#574500",
        "on-tertiary-container": "#454544",
        "primary-fixed": "#ffe088",
        "surface-variant": "#353534",
        "secondary-fixed-dim": "#c6c6c7",
        "surface-container-high": "#2a2a2a",
        "tertiary-container": "#b4b2b2",
        "on-secondary-fixed-variant": "#454747",
        "on-surface-variant": "#d0c5af",
        "on-primary": "#3c2f00",
        "error-container": "#93000a",
        "on-background": "#e5e2e1",
        "surface-container-lowest": "#0e0e0e",
        "on-tertiary-fixed": "#1c1b1b",
        "inverse-primary": "#735c00"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "xs": "4px",
        "xl": "80px",
        "lg": "48px",
        "container-max": "1200px",
        "gutter": "24px",
        "md": "24px",
        "base": "8px",
        "sm": "12px"
      },
      fontFamily: {
        geist: ["Inter", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
};

export default config;
