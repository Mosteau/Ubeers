/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",  // Si tu as un fichier HTML à la racine
    "./src/**/*.{js,ts,jsx,tsx,vue}"  // Si tu utilises Vue, React, ou d'autres fichiers JS/TS
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
