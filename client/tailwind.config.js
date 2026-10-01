/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F2F6F3",
        surface: "#FFFFFF",
        ink: "#17231F",
        line: "#D8E2DC",
        muted: "#607168",
        accent: {
          DEFAULT: "#18705D",
          soft: "#E2F1EA",
          dark: "#105744",
        },
        priority: {
          high: "#C25543",
          medium: "#B47A24",
          low: "#438269",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
