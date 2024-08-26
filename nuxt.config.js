export default defineNuxtConfig({
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
    '@/assets/main.css',
    '@/assets/fonts.css'
  ],
  components: true,
  buildModules: [],
  modules: [],
  build: {},
})
