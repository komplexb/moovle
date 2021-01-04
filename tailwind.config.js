const tailwindForms = require('@tailwindcss/forms')
const tailwindTypography = require('@tailwindcss/typography')

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          500: 'var(--color-primary-500)',
          alt: 'var(--color-primary-alt)'
        },
        secondary: 'var(--color-secondary)',
        'secondary-alt': 'var(--color-secondary-alt)'
      },
      screens: {
        'xs-down': { max: '413px' },
        xs: { min: '414px', max: '639px' },
        'tablet-portrait': { min: '768px', max: '1023px' }
      }
    }
  },
  plugins: [tailwindForms, tailwindTypography]
}
