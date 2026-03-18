/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: "#10B981",
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        amber: {
          DEFAULT: "#F59E0B",
          400: "#FBBF24",
          500: "#F59E0B",
        },
        dark: {
          DEFAULT: "#060E0B",
          50: "#1F3329",
          100: "#172820",
          200: "#0F1A15",
          300: "#060E0B",
        },
      },
      fontFamily: {
        heading: ["SpaceGrotesk-Bold"],
        "heading-medium": ["SpaceGrotesk-Medium"],
        body: ["Inter-Regular"],
        "body-medium": ["Inter-Medium"],
        "body-semibold": ["Inter-SemiBold"],
        "body-bold": ["Inter-Bold"],
      },
    },
  },
  plugins: [],
};
