export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'shadcn-nuxt'
  ],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001'
    }
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  typescript: {
    typeCheck: false
  },
  nitro: {
    preset: 'node-server'
  }
})