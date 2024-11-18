/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        darkGrey: '#242424',
        semiBlack: '#101010',
        cursedBlack: '#131313',
        semiYellow: '#EFE65C',
        yellow: '#C1C957',
        red: '#ED3939',
        neutralGray: '#C3C3C3',
        lightGreen: '#73984F',
        gray13: '#212121',
        green: '#608C4D'

      },
      backgroundImage: {
        'background': "url('/images/bg.png')"
      }
    },
  },
  plugins: [],
};
