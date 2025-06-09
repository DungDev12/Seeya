/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/react-native-paper/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      flex: {
        2: '2 2 0%',
        3: '3 3 0%',
        4: '4 4 0%',
        '1-1-50': '1 1 50%',
      },
    },
  },
  plugins: [],
};
