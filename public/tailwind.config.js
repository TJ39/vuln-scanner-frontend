/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",   // scans all React files for Tailwind classes
  ],
  theme: {
    extend: {
      colors: {
        neonGreen: "#39FF14",   // glowing green like your landing page idea
        darkBg: "#0a0f1c",      // deep dark background
      },
      boxShadow: {
        neon: "0 0 10px #39FF14, 0 0 20px #39FF14, 0 0 30px #39FF14",
      },
    },
  },
  plugins: [],
}
