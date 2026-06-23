import type { App } from 'vue'
import AppIcon from '@/components/app/AppIcon'

export function registerComponents(app: App) {
  app.component('AppIcon', AppIcon)
}
