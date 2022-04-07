import { PageModule } from '@/store/page'
import { AppModule } from '@/store/app'
import { systemActionsObject, modKey } from '@/utils/helper'

const prefixTitle = 'settings.keyboard.'
export const hotkeys = [
  {
    keys: [modKey, 't'],
    title: `${prefixTitle}open-themes`,
    callback: () => {
      PageModule.openTab({ type: 'themes' })
      PageModule.openBlock({ id: 'settings' })
    }
  },
  {
    keys: [modKey, 'c'],
    title: `${prefixTitle}open-custom`,
    callback: () => {
      PageModule.openTab({ type: 'custom' })
      PageModule.openBlock({ id: 'settings' })
    }
  },
  {
    keys: [modKey, 's'],
    title: `${prefixTitle}open-settings`,
    callback: () => {
      PageModule.openTab({ type: 'settings' })
      PageModule.openBlock({ id: 'settings' })
    }
  },
  {
    keys: [modKey, 'h'],
    title: `${prefixTitle}hide-windows`,
    callback: () => {
      PageModule.CLOSE_ALL_ACTIVE_BLOCK()
    }
  },
  {
    keys: [modKey, 'r'],
    title: `${prefixTitle}randomize-theme`,
    callback: () => {
      AppModule.randomizeSettingsTheme()
    }
  },
  {
    keys: [modKey, 'i'],
    title: `${prefixTitle}show-password`,
    callback: () => {
      AppModule.toggleShowPassword()
    }
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

export type hotkeysType = typeof hotkeys[number]
