export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      ]
    }
  },
  head: {
    title: 'lopomodoro',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '@/assets/css/custom-bootstrap.css',
    '@/assets/css/main.css',
    '@/assets/css/fonts.css',
  ],
  plugins: [
    { src: '~/plugins/bootstrap.js', mode: 'client' }
  ],
  components: true,
  buildModules: [],
  modules: [],
  build: {
    transpile: ['bootstrap']
  },
})
