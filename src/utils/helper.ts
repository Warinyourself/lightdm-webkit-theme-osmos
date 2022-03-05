import { AppInputThemeSlider } from '@/models/app'
import { appWindow } from '@/models/lightdm'
import { AppModule } from '@/store/app'
import { PageModule } from '@/store/page'
import { debounce, DebounceSettings } from 'lodash'

const isFinalBuild = process.env.VUE_APP_VIEW === 'build'
export const modKey = 'ctrl'
export const languageMap: Record<string, string> = {
  ru: 'Русский',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español'
}

export function Debounce(time = 500, options?: DebounceSettings): MethodDecorator {
  const map = new Map<number, any>()

  return function(_target, _propertyKey, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = function(...args: any[]) {
      const _uid = (this as Vue & { _uid: number})._uid
      const callback = map.get(_uid)

      if (callback) {
        // eslint-disable-next-line standard/no-callback-literal
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
        callback: appWindow.lightdm[callbackName]
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

export function preventDefault(event: Event, callback?: Function) {
  event.preventDefault()
  callback && callback()
}

export function focusInputPassword() {
  const inputPassword = document.querySelector('#password') as HTMLInputElement

  if (inputPassword) {
    inputPassword.focus()
  }
}

export function stopPropagation(event: Event, callback?: Function) {
  event.stopPropagation()
  callback && callback()
}

export function hasSomeParentClass(element: HTMLElement, tag: string): boolean {
  return !!element.closest(tag)
}
