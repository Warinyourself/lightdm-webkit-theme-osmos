/// <reference types="vite/client" />
/// <reference types="nody-greeter-types" />

declare module '*.svg' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    AppIcon: typeof import('./src/components/app/AppIcon.vue')['default']
  }
}

export {}
