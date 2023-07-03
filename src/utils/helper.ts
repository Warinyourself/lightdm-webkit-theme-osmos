import type { AppInputButton, AppInputThemeGeneral, AppInputThemePalette, AppInputThemeSlider, AppTheme } from '@/models/app'
import { debounce, type DebounceSettings } from 'lodash'
import type { RouteLocationRaw } from 'vue-router'
import router from '@/router'
import { LightdmHandler } from '@/utils/lightdm'

// Stores are imported statically but only CALLED inside functions/callbacks
// This is safe thanks to ES module live bindings (no circular dep issue at runtime)
import { useAppStore } from '@/store/app'
import { usePageStore } from '@/store/page'

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

export function createDebounce<T extends (...args: any[]) => any>(fn: T, time = 500, options?: DebounceSettings) {
  return debounce(fn, time, options) as unknown as T
}

export function parseQueryValue(value: string) {
  const isBoolean = ['false', 'true'].includes(value)
  if (isBoolean) return value === 'true'

  const isNumber = !isNaN(parseFloat(value))
  if (isNumber) return +value

  return value
}

export function randomize(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export function generateRandomSliderValue(input: AppInputThemeSlider) {
  const ignoreSliders = ['pxratio', 'brightness']
  if (ignoreSliders.includes(input.name)) return input.value

  const { min, max } = input.options
  const decimalPlaces = ((input.options.step + '').split('.')[1] || '').length
  return +(randomize(min, max).toFixed(decimalPlaces))
}

export function generateRandomColor() {
  return '#' + Math.floor(Math.random() * 2 ** 24 - 1).toString(16)
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
  return useAppStore().desktops.map((desktop) => ({
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
        { title: 'text.yes', callback: LightdmHandler[callbackName] },
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

export function randomizeSettingsTheme(theme: AppTheme) {
  const generateValue: Record<string, (input: any) => any> = {
    slider: (input: AppInputThemeSlider) => generateRandomSliderValue(input),
    checkbox: () => Math.random() > 0.5,
    color: () => generateRandomColor(),
    palette: (input: AppInputThemePalette) => Math.floor(randomize(0, (input.values?.length || 2) - 1))
  }

  return theme.settings?.map((input) => {
    const fn = generateValue[input.type]
    if (fn) input.value = fn(input)
    return input
  })
}

export function setCSSVariable(property: string, value: string) {
  document.documentElement.style.setProperty(property, value)
}

export const randomButton: AppInputButton = {
  name: 'button',
  value: 'button',
  label: 'input.random',
  type: 'button',
  icon: 'random',
  callback() {
    useAppStore().randomizeSettingsTheme()
  }
}

export function buildInputSlider({
  name = 'animation-speed',
  value = 5,
  min = 1,
  max = 10,
  step = 0.01,
  icon = 'time',
  changeOnUpdate = true
} = {}): AppInputThemeSlider {
  return { name, label: `input.${name}`, value, icon, type: 'slider', options: { changeOnUpdate, max, step, min } }
}

export function buildInputColor({ name = 'active-color', value = '#00CC99', ...options } = {}): AppInputThemeGeneral {
  return { name, value, label: `input.${name}`, type: 'color', ...options }
}

export const pxratio = () => buildInputSlider({ name: 'pxratio', icon: 'pxratio', min: 0.01, max: 1, value: 0.8 })
export const hueSlider = () => buildInputSlider({ name: 'hue', min: 1, max: 360, step: 1, value: 0 })
export const brightnessSlider = () => buildInputSlider({ name: 'brightness', min: 0, max: 1, step: 0.01, value: 1 })
export const buildInvertCheckbox = (): AppInputThemeGeneral => ({
  name: 'invert',
  label: 'input.invert',
  type: 'checkbox',
  value: false
})
