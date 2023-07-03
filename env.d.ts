/// <reference types="vite/client" />

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
