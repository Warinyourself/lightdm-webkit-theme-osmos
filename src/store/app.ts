import { defineStore } from 'pinia'
import { computed, reactive, ref, type Ref } from 'vue'

import type { AppTheme, AppSettings, AppInputTheme, AppInputThemeValue } from '@/models/app'
import type { LightdmSession, LightdmUsers } from '@/models/lightdm'

import { randomizeSettingsTheme as buildRandomThemeSettings, setCSSVariable } from '@/utils/helper'
import { AppThemes, defaultTheme } from '@/utils/constant'
import { LightdmHandler } from '@/utils/lightdm'
import { version as appVersion } from '../../package.json'

export const useAppStore = defineStore('app', () => {
  const version = appVersion as string
  const isGithubMode = import.meta.env.VITE_APP_VIEW === 'github'

  const currentTheme = ref('')
  const desktop = ref(LightdmHandler.defaultSession)
  const username = ref(LightdmHandler.username)
  const password = ref('')
  const defaultColor = ref('#6BBBED')
  const zoom = ref(1)
  const users = ref(LightdmHandler.users as LightdmUsers[])
  const desktops = ref(LightdmHandler.sessions as LightdmSession[])
  const showPassword = ref(false)
  const themes = ref(AppThemes as AppTheme[])
  const bodyClass = reactive<Record<string, boolean>>({
    blur: true,
    'no-transition': false,
    'show-framerate': false,
    'only-ui': false
  })

  const showFrameRate = computed(() => bodyClass['show-framerate'])
  const viewThemeOnly = computed(() => bodyClass['only-ui'])

  const activeTheme = computed((): AppTheme =>
    themes.value.find(({ name }) => name === currentTheme.value) || defaultTheme)

  const currentUser = computed(() => users.value.find((user) => user.username === username.value))
  const currentDesktop = computed(() => desktops.value.find(({ key }) => key === desktop.value))

  const getThemeByName = (theme: string) => themes.value.find(({ name }) => name === theme)

  const getThemeInput = (name: string, theme?: AppTheme) => {
    const active = themes.value.find((t) => t.name === currentTheme.value) || defaultTheme
    return (theme || active).settings?.find((input) => input.name === name)
  }

  const getMainSettings = computed((): AppSettings => ({
    zoom: zoom.value,
    themes: themes.value,
    desktop: desktop.value,
    username: username.value,
    bodyClass,
    currentTheme: currentTheme.value,
    defaultColor: defaultColor.value
  }))

  const personalInfo = computed(() => ({
    username: username.value,
    currentTheme: currentTheme.value,
    desktop: desktop.value,
    version,
    defaultColor: defaultColor.value
  }))

  const settableRefs: Record<string, Ref<any>> = { desktop, username, password, defaultColor, zoom, currentTheme }

  function randomizeSettingsTheme() {
    const theme = activeTheme.value
    theme.settings = buildRandomThemeSettings(theme)
  }

  async function changeTheme(themeName: string, themeSettings?: AppTheme['settings']) {
    const isExistTheme = getThemeByName(themeName)
    const finalTheme = isExistTheme ? themeName : themes.value[0]!.name

    currentTheme.value = finalTheme

    if (isExistTheme && themeSettings) {
      changeSettingsTheme({ theme: finalTheme, settings: themeSettings })
    }
  }

  function login() {
    LightdmHandler.login(username.value, password.value, currentDesktop.value?.key)
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

  function toggleShowPassword() {
    showPassword.value = !showPassword.value
  }

  function changeBodyClass({ key, value }: { key: string; value: boolean }) {
    bodyClass[key] = value
  }

  function saveStateApp({ key, value }: { key: string; value: string }) {
    if (key in settableRefs) settableRefs[key]!.value = value
    localStorage.setItem(key, value)
  }

  function syncSettingsWithCache() {
    localStorage.setItem('settings', JSON.stringify(getMainSettings.value))
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

  function setUpSettings() {
    try {
      const settings: AppSettings = JSON.parse(localStorage.getItem('settings') || '{}')

      if (settings.themes) syncThemeWithStore(settings)

      const isExistDE = window.lightdm?.sessions.find(({ key }) => key === settings.desktop)
      if (!isExistDE) settings.desktop = window.lightdm?.sessions[0]?.key || 'openbox'

      const isExistUser = window.lightdm?.users.find(({ username: name }) => name === settings.username)
      if (!isExistUser) settings.username = window.lightdm?.users[0]?.username || 'Warinyourself'

      desktop.value = settings.desktop
      username.value = settings.username
      zoom.value = settings.zoom || 1
    } catch {
      setUpSettings()
    }
  }

  return {
    version,
    isGithubMode,
    currentTheme,
    desktop,
    username,
    password,
    defaultColor,
    zoom,
    users,
    desktops,
    showPassword,
    themes,
    bodyClass,
    showFrameRate,
    viewThemeOnly,
    activeTheme,
    currentUser,
    currentDesktop,
    getThemeByName,
    getThemeInput,
    getMainSettings,
    personalInfo,
    randomizeSettingsTheme,
    changeTheme,
    login,
    changeSettingsTheme,
    changeThemeInput,
    changeSettingsThemeInput,
    toggleShowPassword,
    changeBodyClass,
    saveStateApp,
    syncSettingsWithCache,
    syncThemeColor,
    syncThemeWithStore,
    setUpSettings
  }
})
