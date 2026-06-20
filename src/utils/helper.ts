import type { RouteLocationRaw } from 'vue-router'
import router from '@/router'

// Stores are imported statically but only CALLED inside functions/callbacks
// This is safe thanks to ES module live bindings (no circular dep issue at runtime)
import { usePageStore } from '@/store/page'
import { useLightdm } from '@/composables/useLightdm'

export { setCSSVariable } from '@/utils/dom'

export const modKey = 'ctrl'

export const languageMap: Record<string, string> = {
  ru: 'Русский',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español'
}

export function isDifferentRoute(to: RouteLocationRaw) {
  const resolve = router.resolve(to)
  return router.currentRoute.value.fullPath !== resolve.fullPath
}

export function parseQueryValue(value: string) {
  const isBoolean = ['false', 'true'].includes(value)
  if (isBoolean) return value === 'true'

  const isNumber = !isNaN(parseFloat(value))
  if (isNumber) return +value

  return value
}

export function getDesktopIcon(desktop = '') {
  const iconMap: Record<string, RegExp> = {
    gnome: /gnome/,
    openbox: /openbox/,
    awesome: /awesome/,
    i3: /i3/,
    elementary: /elementary/,
    cinnamon: /cinnamon/,
    plasma: /plasma/,
    mate: /mate/,
    xfce: /xfce/,
    kodi: /kodi/
  }

  const [icon] = Object.entries(iconMap).find(([, re]) => desktop.match(re)) || ['unknown']
  return icon
}

export function generateDesktopIcons() {
  return useLightdm().desktops.value.map((desktop) => ({
    text: desktop.name,
    value: desktop.key,
    icon: getDesktopIcon(desktop.key)
  }))
}

const systemActions = ['hibernate', 'restart', 'shutdown', 'suspend'] as const
type systemActionsType = (typeof systemActions)[number]

export function buildSystemDialog(callbackName: systemActionsType) {
  return () => {
    const pageStore = usePageStore()
    pageStore.openDialog({
      title: `modals.${callbackName}.title`,
      text: `modals.${callbackName}.text`,
      actions: [
        { title: 'text.yes', callback: () => useLightdm()[callbackName]() },
        { title: 'text.no', callback: () => pageStore.closeDialog() }
      ]
    })
  }
}

export const systemActionsObject = systemActions.reduce(
  (acc, action) => ({ ...acc, [action]: buildSystemDialog(action) }),
  {} as Record<systemActionsType, () => void>
)

export function preventDefault(event: Event, callback?: () => void): void {
  event.preventDefault()
  callback?.()
}

export function focusInputPassword() {
  const el = document.querySelector('#password') as HTMLInputElement | null
  el?.focus()
}

export function stopPropagation(event: Event, callback?: () => void): void {
  event.stopPropagation()
  callback?.()
}

export function hasSomeParentClass(element: HTMLElement, tag: string): boolean {
  return !!element.closest(tag)
}
