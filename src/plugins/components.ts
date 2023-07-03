import type { App } from 'vue'
import AppIcon from '@/components/app/AppIcon.vue'

export function registerComponents(app: App) {
  app.component('AppIcon', AppIcon)
}
