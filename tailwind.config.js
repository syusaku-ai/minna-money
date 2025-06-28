// tailwind.config.js
module.exports = {
  // ← darkMode 行を削除、または以下のように media に戻す
  darkMode: 'media',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
