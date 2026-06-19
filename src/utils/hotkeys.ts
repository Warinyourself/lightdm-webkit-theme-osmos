import { usePageStore } from '@/store/page'
import { useAppStore } from '@/store/app'
import { useThemeStore } from '@/store/theme'
import { systemActionsObject, modKey } from '@/utils/helper'

const prefixTitle = 'settings.keyboard.'

export const hotkeys = [
  {
    keys: [modKey, 't'],
    title: `${prefixTitle}open-themes`,
    callback: () => {
      const pageStore = usePageStore()
      pageStore.openTab({ type: 'themes' })
      pageStore.openBlock({ id: 'settings' })
    }
  },
  {
    keys: [modKey, 'f'],
    title: `${prefixTitle}full-screen`,
    callback: () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
      } else {
        document.exitFullscreen?.()
      }
    }
  },
  {
    keys: [modKey, 'c'],
    title: `${prefixTitle}open-custom`,
    callback: () => {
      const pageStore = usePageStore()
      pageStore.openTab({ type: 'custom' })
      pageStore.openBlock({ id: 'settings' })
    }
  },
  {
    keys: [modKey, 's'],
    title: `${prefixTitle}open-settings`,
    callback: () => {
      const pageStore = usePageStore()
      pageStore.openTab({ type: 'settings' })
      pageStore.openBlock({ id: 'settings' })
    }
  },
  {
    keys: [modKey, 'h'],
    title: `${prefixTitle}hide-windows`,
    callback: () => usePageStore().closeAllBlocks()
  },
  {
    keys: [modKey, 'r'],
    title: `${prefixTitle}randomize-theme`,
    callback: () => useThemeStore().randomizeSettingsTheme()
  },
  {
    keys: [modKey, 'i'],
    title: `${prefixTitle}show-password`,
    callback: () => useAppStore().toggleShowPassword()
  },
  {
    keys: [modKey, 'P'],
    title: `${prefixTitle}poweroff`,
    callback: systemActionsObject?.shutdown
  },
  {
    keys: [modKey, 'R'],
    title: `${prefixTitle}restart`,
    callback: systemActionsObject?.restart
  },
  {
    keys: [modKey, 'S'],
    title: `${prefixTitle}suspend`,
    callback: systemActionsObject?.suspend
  }
]

export type hotkeysType = (typeof hotkeys)[number]

// Converts a display key list (e.g. ['ctrl', 'P']) into a useMagicKeys combo
// (e.g. 'ctrl+shift+p'), since an uppercase letter implies the Shift modifier
export function toMagicKeyCombo(keys: string[]): string {
  return keys
    .flatMap((key) => (key.length === 1 && key !== key.toLowerCase() ? ['shift', key.toLowerCase()] : [key.toLowerCase()]))
    .join('+')
}
