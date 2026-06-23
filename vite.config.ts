import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import glsl from 'vite-plugin-glsl'
import svgLoader from 'vite-svg-loader'

const isGithubView = process.env.VITE_APP_VIEW === 'github'

export default defineConfig({
  base: isGithubView ? '/lightdm-webkit-theme-osmos/' : './',
  plugins: [
    vue(),
    vueJsx(),
    glsl(),
    svgLoader({
      svgoConfig: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  optimizeDeps: {
    // Rolldown (Vite 8) dep scanner fails to parse JSX syntax.
    // All deps ship ESM so pre-bundling is not needed.
    disabled: true
  },
  css: {
    preprocessorOptions: {
      stylus: {}
    }
  },
  build: {
    // Disable CSS minification: LightningCSS drops unprefixed 'backdrop-filter'
    // when it detects a WebKit-only target, breaking blur in webkit-greeter.
    cssMinify: false
  }
})
