module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: theme => ({
        'static': "url('../images/static.png')",
        'vignette': 'radial-gradient(ellipse at center, rgba(75, 85, 99) 0%, #0c100d 100%)'
      }),
      animation: {
        'tv-static': 'move-bg 0.5s steps(5) infinite'
      },

      keyframes: {
        'move-bg': {
          '0%': {'background-position': '0 0'},
          '100%': {'background-position': '100% 100%'},
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
