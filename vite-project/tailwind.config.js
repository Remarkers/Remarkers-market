/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: [
    "./index.html",
    "./src/App.jsx",
    "./src/Create.jsx",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
});
