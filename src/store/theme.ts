import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { AppTheme, AppSettings, AppInputTheme, AppInputThemeValue } from '@/models/app'

import { randomizeSettingsTheme as buildRandomThemeSettings } from '@/utils/theme-inputs'
import { setCSSVariable } from '@/utils/dom'
import { AppThemes, defaultTheme } from '@/utils/constant'

// Snapshot of default input values captured before any mutations
const _defaults = new Map<string, Record<string, AppInputThemeValue>>(
  AppThemes.map((theme) => [
    theme.name,
    Object.fromEntries((theme.settings || []).map((input) => [input.name, input.value]))
  ])
)

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref('')
  const themes = ref(AppThemes as AppTheme[])

  const activeTheme = computed((): AppTheme =>
    themes.value.find(({ name }) => name === currentTheme.value) || defaultTheme)

  const getThemeByName = (theme: string) => themes.value.find(({ name }) => name === theme)

  const getThemeInput = (name: string, theme?: AppTheme) => {
    const active = themes.value.find((t) => t.name === currentTheme.value) || defaultTheme
    return (theme || active).settings?.find((input) => input.name === name)
  }

  function randomizeSettingsTheme() {
    const theme = activeTheme.value
    theme.settings = buildRandomThemeSettings(theme)
  }

  function resetTheme() {
    const defaults = _defaults.get(currentTheme.value)
    if (!defaults) return
    const target = themes.value.find(({ name }) => name === currentTheme.value)
    if (!target?.settings) return
    target.settings = target.settings.map((input) => ({
      ...input,
      value: defaults[input.name] ?? input.value
    }))
  }

  async function changeTheme(themeName: string, themeSettings?: AppTheme['settings']) {
    const isExistTheme = getThemeByName(themeName)
    const finalTheme = isExistTheme ? themeName : themes.value[0]!.name

    currentTheme.value = finalTheme

    if (isExistTheme && themeSettings) {
      changeSettingsTheme({ theme: finalTheme, settings: themeSettings })
    }
  }

  function changeSettingsTheme({ theme, settings }: { theme: string; settings: AppTheme['settings'] }) {
    const target = themes.value.find(({ name }) => name === theme)
    if (target) target.settings = settings
  }

  function changeThemeInput({ input, value }: { input: AppInputTheme; value: AppInputThemeValue }) {
    input.value = value
  }

  function changeSettingsThemeInput({ key, value }: { key: string; value: AppInputThemeValue }) {
    const input = activeTheme.value.settings?.find((i) => i.name === key)
    if (input) input.value = value
  }

  function syncThemeColor() {
    const { color } = activeTheme.value
    setCSSVariable('--color-bg', color.background)
  }

  function syncThemeWithStore(settings: AppSettings) {
    const themeName = settings.currentTheme

    const syncTheme = themes.value.reduce((acc: AppTheme[], theme) => {
      const cachedTheme = settings.themes.find(({ name }) => name === theme.name)
      const isActiveTheme = theme.name === themeName
      const hasCachedTheme = cachedTheme && cachedTheme.settings

      if (hasCachedTheme) {
        theme.settings = theme.settings?.map((input) => {
          const cachedInput = getThemeInput(input.name, cachedTheme)
          const value = cachedInput?.value ?? input.value
          return { ...input, value }
        })
      }

      acc.push(theme)
      if (isActiveTheme) currentTheme.value = themeName

      return acc
    }, [])

    themes.value = syncTheme
  }

  return {
    currentTheme,
    themes,
    activeTheme,
    getThemeByName,
    getThemeInput,
    randomizeSettingsTheme,
    resetTheme,
    changeTheme,
    changeSettingsTheme,
    changeThemeInput,
    changeSettingsThemeInput,
    syncThemeColor,
    syncThemeWithStore
  }
})
