import type { AppInputButton, AppInputThemeGeneral, AppInputThemePalette, AppInputThemeSlider, AppTheme } from '@/models/app'
import type { AppInputThemeOptionsSlider } from '@/models/app'
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

export const randomButton: AppInputButton = {
  name: 'button',
  value: 'button',
  label: 'input.random',
  type: 'button',
  icon: 'random',
  callback() {
    void import('@/store/theme').then(({ useThemeStore }) => useThemeStore().randomizeSettingsTheme())
  }
}

export const resetButton: AppInputButton = {
  name: 'button',
  value: 'button',
  label: 'input.reset',
  type: 'button',
  callback() {
    void import('@/store/theme').then(({ useThemeStore }) => useThemeStore().resetTheme())
  }
}

export function buildInputSlider(options?: Partial<AppInputThemeOptionsSlider & AppInputThemeSlider>): AppInputThemeSlider {
  const {
    name = 'animation-speed',
    value = 5,
    min = 1,
    max = 10,
    step = 0.01,
    icon = 'time',
    changeOnUpdate = true
  } = options || {}

  return { name, label: `input.${name}`, value, icon, type: 'slider', options: { changeOnUpdate, max, step, min } }
}

export function buildInputColor({ name = 'active-color', value = '#00CC99', ...options } = {}): AppInputThemeGeneral {
  return { name, value, label: `input.${name}`, type: 'color', ...options }
}

export const pxratio = (options: Partial<AppInputThemeOptionsSlider> = {}) => buildInputSlider({ name: 'pxratio', icon: 'pxratio', min: 0.01, max: 1, value: 0.8, ...options })

export const hueSlider = () => buildInputSlider({ name: 'hue', min: 1, max: 360, step: 1, value: 0 })

export const brightnessSlider = () => buildInputSlider({ name: 'brightness', min: 0, max: 1, step: 0.01, value: 1 })

export const buildInvertCheckbox = (): AppInputThemeGeneral => ({
  name: 'invert',
  label: 'input.invert',
  type: 'checkbox',
  value: false
})

export const buildCheckbox = (name: string, value = false): AppInputThemeGeneral => ({
  name,
  label: `input.${name}`,
  type: 'checkbox' as const,
  value
})
