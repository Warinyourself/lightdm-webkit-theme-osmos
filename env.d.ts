/// <reference types="vite/client" />

declare module '*.svg' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

declare module '*.glsl' {
  const content: string
  export default content
}

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    AppIcon: typeof import('./src/components/app/AppIcon.vue')['default']
  }
}

export {}
