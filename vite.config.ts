import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import glsl from 'vite-plugin-glsl'
import svgLoader from 'vite-svg-loader'

const isGithubView = process.env.VITE_APP_VIEW === 'github'

export default defineConfig({
  base: isGithubView ? '/lightdm-webkit-theme-osmos/' : '/',
  plugins: [
    vue(),
    vueJsx(),
    glsl(),
    svgLoader()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      stylus: {}
    }
  }
})
