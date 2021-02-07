import redirects from './utils/redirects.js'

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Moovle | search the marvel universe',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'Moovle | search the marvel universe'
      },
      {
        hid: 'description',
        name: 'description',
        content:
          'Learn about Marvel characters by searching and exploring with Moovle.'
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content:
          'Learn about Marvel characters by searching and exploring with Moovle.'
      }
    ],
    link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['@/assets/css/main.scss'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/filter/stripHtml.js',
    '~/plugins/filter/truncate.js',
    '~/plugins/mixin/generateHash.js',
    '~/plugins/vue-observe-visibility.client.js'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          'Titillium+Web': {
            wght: [900]
          }
        },
        display: 'swap',
        preload: false
      }
    ]
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxt/http',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://github.com/nuxt-community/redirect-module
    '@nuxtjs/redirect-module'
  ],

  redirect: {
    rules: redirects,
    statusCode: 301
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},

  publicRuntimeConfig: {
    baseURL: 'https://gateway.marvel.com/v1/public',
    marvelPuk: process.env.MARVEL_PUK,
    marvelPrk: process.env.MARVEL_PRK,
    isDev: process.env.NODE_ENV !== 'production'
  },

  privateRuntimeConfig: {
    marvelPuk: process.env.MARVEL_PUK,
    marvelPrk: process.env.MARVEL_PRK
  },

  generate: {
    fallback: true
  },

  http: {
    clientTimeout: 5000
  }
}
