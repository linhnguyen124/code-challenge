const {
  default: flattenColorPalette
} = require('tailwindcss/lib/util/flattenColorPalette');

module.exports = {
  content: ['./src/**/*.{html,css,js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      truncate: {
        lines: {
          1: '1',
          2: '2',
          3: '3',
          5: '5',
          8: '8'
        }
      }
    },
    zIndex: {
      '-1': -1,
      0: 0,
      10: 10,
      20: 20,
      30: 30,
      40: 40,
      50: 50,
      75: 75,
      100: 100,
      1000: 1000,
      1001: 1001,
      1002: 1002,
      auto: 'auto'
    }
  },
  variants: {
    backgroundColor: ['group-active'],
    extend: {
      opacity: ['disabled']
    }
  },
  plugins: [
    addVariablesForColors,
    require('tailwindcss-animate')
    // require('tailwindcss-debug-screens')
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/line-clamp')
  ]
};

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme('colors'));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ':root': newVars
  });
}
