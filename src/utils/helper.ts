import { AppInputThemeSlider } from '@/models/app'
import { AppModule } from '@/store/app'
import { debounce, DebounceSettings } from 'lodash'

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

export const randomize = (min: number, max: number) => (Math.random() * (max - min)) + min

export const generateRandomSliderValue = (input: AppInputThemeSlider) => {
  const ignoreSliders = ['pxratio', 'brightness']

  if (ignoreSliders.includes(input.name)) { return input.value }

  const { min, max } = input.options
  const decimalPlaces = ((input.options.step + '').split('.')[1] || '').length
  const newValue = +(randomize(min, max).toFixed(decimalPlaces))

  return newValue
}

export const generateRandomColor = () => {
  return '#' + (Math.floor(Math.random() * 2 ** 24 - 1)).toString(16)
}

export const generateDesktopIcons = () => {
  return AppModule.desktops.map((desktop) => {
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
      return desktop.key.match(regEx)
    }) || ['unknown']

    return {
      text: desktop.name,
      value: desktop.key,
      icon
    }
  })
}
