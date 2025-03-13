/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
      colors: {
        primary: '#169544',
      },
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

