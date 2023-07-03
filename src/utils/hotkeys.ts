import { usePageStore } from '@/store/page'
import { useAppStore } from '@/store/app'
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
    callback: () => useAppStore().randomizeSettingsTheme()
  },
  {
    keys: [modKey, 'i'],
    title: `${prefixTitle}show-password`,
    callback: () => useAppStore().toggleShowPassword()
  },
  {
    keys: [modKey, 'P'],
    title: `${prefixTitle}poweroff`,
    callback: systemActionsObject.shutdown
  },
  {
    keys: [modKey, 'R'],
    title: `${prefixTitle}restart`,
    callback: systemActionsObject.restart
  },
  {
    keys: [modKey, 'S'],
    title: `${prefixTitle}suspend`,
    callback: systemActionsObject.suspend
  }
]

export type hotkeysType = (typeof hotkeys)[number]
