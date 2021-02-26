import redirectSSL from 'redirect-ssl'
import redirects from './utils/redirects.js'

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'server',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Moovle | search the marvel universe',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'Moovle | search the marvel universe',
      },
      {
        hid: 'description',
        name: 'description',
        content:
          'Learn about Marvel characters by searching and exploring with Moovle.',
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content:
          'Learn about Marvel characters by searching and exploring with Moovle.',
      },
    ],
    link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['@/assets/css/main.scss'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/filter/stripHtml.js',
    '~/plugins/filter/truncate.js',
    '~/plugins/mixin/generateHash.js',
    '~/plugins/vue-observe-visibility.client.js',
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
            wght: [900],
          },
        },
        display: 'swap',
        preload: false,
        useStylesheet: true,
      },
    ],
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxt/http',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://github.com/nuxt-community/redirect-module
    '@nuxtjs/redirect-module',
    // https://www.npmjs.com/package/nuxt-helmet
    'nuxt-helmet',
    // https://auth.nuxtjs.org/
    '@nuxtjs/auth',
    '@nuxtjs/axios', // auth needs this
    // https://github.com/nuxt-community/community-modules/tree/master/packages/toast
    // https://github.com/shakee93/vue-toasted
    '@nuxtjs/toast',
  ],

  toast: {
    singleton: true,
    duration: 3000,
  },

  /**
   * Configure nuxt-auth
   * https://auth.nuxtjs.org/
   */
  auth: {
    cookie: {
      options: {
        secure: process.env.NODE_ENV == 'production',
        sameSite: true,
        httpOnly: true,
      },
    },
    scope: true,
    scopeKey: 'user.scope',
    strategies: {
      // local is the default, credentials/token based scheme for flows like JWT.
      local: {
        endpoints: {
          login: {
            url: `/api/auth/login`,
            method: 'post',
            propertyName: 'token',
            headers: {
              // prevent stale data due to apicache middleware
              'x-apicache-bypass': true,
            },
          },
          logout: {
            url: '/api/auth/logout',
            method: 'post',
            headers: {
              // prevent stale data due to apicache middleware
              'x-apicache-bypass': true,
            },
          },
          user: {
            url: '/api/auth/user',
            method: 'get',
            propertyName: false,
            headers: {
              // prevent stale data due to apicache middleware
              'x-apicache-bypass': true,
            },
          },
        },
      },
    },
    redirect: {
      logout: '/',
      callback: '/login',
      home: '/',
    },
    middleware: [
      // manage scope specific access
      { src: '~/middleware/scope.js' },
      // deny access to these pages if already logged in
      { src: '~/middleware/isLoggedIn.js' },
    ],
  },

  // configure redirect-module
  redirect: {
    rules: redirects,
    statusCode: 301,
  },

  helmet: {
    xssFilter: false,
  },

  // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-render#csp
  render: {
    csp: {
      hashAlgorithm: 'sha256',
      policies: {
        'default-src': ["'self'"],
        'img-src': ['https:'],
        'style-src': ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
        'font-src': ["'self'", "'unsafe-inline'", 'fonts.gstatic.com'],
      },
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},

  env: {},

  publicRuntimeConfig: {
    baseURL: process.env.MARVEL_API_URL,
    isDev: process.env.NODE_ENV !== 'production',
  },

  privateRuntimeConfig: {
    marvelPuk: process.env.MARVEL_PUK,
    marvelPrk: process.env.MARVEL_PRK,
  },

  generate: {
    fallback: true,
  },

  http: {
    clientTimeout: 5000,
    https: process.env.NODE_ENV == 'production',
  },

  serverMiddleware: [
    {
      path: '/api',
      handler: '~/api',
    },
    redirectSSL.create({
      enabled: process.env.NODE_ENV === 'production',
    }),
  ],

  watch: ['~/api/**/*.js', '**/*.ts'],
}
