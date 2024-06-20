/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  darkMode: 'class', // Enable dark mode with the 'class' strategy
  content: [
    "./index.html",
    "./src/App.jsx",
    "./src/Create.jsx",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          500: "#E6007A"
        },
      },
    },
  },
  plugins: [],
});
