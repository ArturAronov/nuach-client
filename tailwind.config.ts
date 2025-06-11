import type { Config } from "tailwindcss";

const maxWidth = "1280px";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/globals.css", // Add this line
  ],
  theme: {
    screens: {
      tablet: "600px",
      desktop: "800px",
      hd: maxWidth,
    },
    maxWidth: {
      "desktop-max": maxWidth,
    },
  },
  plugins: [],
} satisfies Config;
