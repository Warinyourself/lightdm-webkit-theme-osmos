import { AppInputButton, AppInputThemeGeneral, AppInputThemePalette, AppInputThemeSlider, AppInputThemeValue, AppTheme } from '@/models/app'
import { AppModule } from '@/store/app'
import { PageModule } from '@/store/page'
import { debounce, DebounceSettings } from 'lodash'
import { RawLocation } from 'vue-router'
import router from '../router'
import { LightdmHandler } from '@/utils/lightdm'

export const modKey = 'ctrl'
export const languageMap: Record<string, string> = {
  ru: 'Русский',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español'
}

export function isDifferentRoute(to: RawLocation) {
  const { app: { $route, $router } } = router
  const resolve = $router.resolve(to)

  return $route.fullPath !== resolve.href
}

export function Debounce(time = 500, options?: DebounceSettings): MethodDecorator {
  const map = new Map<number, any>()

  return function(_target, _propertyKey, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = function(...args: any[]) {
      const _uid = (this as Vue & { _uid: number})._uid
      const callback = map.get(_uid)

      if (callback) {
        // eslint-disable-next-line n/no-callback-literal
        return callback(...args)
      }

      const deb = debounce(method.bind(this), time, options)
      map.set(_uid, deb)
      return deb(...args)
    }
  }
}

export function parseQueryValue(value: string) {
  const isBoolean = ['false', 'true'].includes(value)
  if (isBoolean) {
    return value === 'true'
  }

  const isNumber = !isNaN(parseFloat(value))
  if (isNumber) {
    return +value
  }

  return value
}

export function randomize(min: number, max: number) {
  return (Math.random() * (max - min)) + min
}

export function generateRandomSliderValue(input: AppInputThemeSlider) {
  const ignoreSliders = ['pxratio', 'brightness']

  if (ignoreSliders.includes(input.name)) { return input.value }

  const { min, max } = input.options
  const decimalPlaces = ((input.options.step + '').split('.')[1] || '').length
  const newValue = +(randomize(min, max).toFixed(decimalPlaces))

  return newValue
}

export function generateRandomColor() {
  return '#' + (Math.floor(Math.random() * 2 ** 24 - 1)).toString(16)
}

export function getDesktopIcon(desktop = '') {
  const iconMap = {
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

  const [icon] = Object.entries(iconMap).find(([icon, regEx]) => {
    return desktop.match(regEx)
  }) || ['unknown']

  return icon
}

export function generateDesktopIcons() {
  return AppModule.desktops.map((desktop) => {
    const icon = getDesktopIcon(desktop.key)

    return {
      text: desktop.name,
      value: desktop.key,
      icon
    }
  })
}

const systemActions = ['hibernate', 'restart', 'shutdown', 'suspend'] as const
type systemActionsType = typeof systemActions[number]

export function buildSystemDialog(callbackName: systemActionsType) {
  return () => PageModule.openDialog({
    title: `modals.${callbackName}.title`,
    text: `modals.${callbackName}.text`,
    actions: [
      {
        title: 'text.yes',
        callback: LightdmHandler[callbackName]
      },
      {
        title: 'text.no',
        callback: PageModule.closeDialog
      }
    ]
  })
}

export const systemActionsObject = systemActions.reduce((acc, action) => {
  return {
    ...acc,
    [action]: buildSystemDialog(action)
  }
}, {} as Record<systemActionsType, () => void>)

export function preventDefault(event: Event, callback?: () => void): void {
  event.preventDefault()
  callback && callback()
}

export function focusInputPassword() {
  const inputPassword = document.querySelector('#password') as HTMLInputElement

  if (inputPassword) {
    inputPassword.focus()
  }
}

export function stopPropagation(event: Event, callback?: () => void): void {
  event.stopPropagation()
  callback && callback()
}

export function hasSomeParentClass(element: HTMLElement, tag: string): boolean {
  return !!element.closest(tag)
}

export function randomizeSettingsTheme(theme: AppTheme) {
  const generateValueObject: Record<string, (input: any) => any> = {
    slider: (input: AppInputThemeSlider) => generateRandomSliderValue(input),
    checkbox: () => Math.random() > 0.5,
    color: () => generateRandomColor(),
    palette: (input: AppInputThemePalette) => Math.floor(randomize(0, (input.values?.length || 2) - 1))
  }

  return theme.settings?.map(input => {
    const changeValueFunction = generateValueObject[input.type]

    if (changeValueFunction) {
      input.value = changeValueFunction(input)
    }

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
    AppModule.randomizeSettingsTheme()
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
  return {
    name,
    label: `input.${name}`,
    value,
    icon,
    type: 'slider',
    options: { changeOnUpdate, max, step, min }
  }
}

export function buildInputColor({
  name = 'active-color',
  value = '#00CC99',
  ...options
} = {}): AppInputThemeGeneral {
  return {
    name,
    value,
    label: `input.${name}`,
    type: 'color',
    ...options
  }
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
