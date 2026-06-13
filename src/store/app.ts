import { defineStore } from 'pinia'
import { computed, reactive, ref, type Ref } from 'vue'

import type { AppSettings } from '@/models/app'
import type { LightdmSession, LightdmUsers } from '@/models/lightdm'

import { useThemeStore } from '@/store/theme'
import { LightdmHandler } from '@/utils/lightdm'
import { version as appVersion } from '../../package.json'

export const useAppStore = defineStore('app', () => {
  const themeStore = useThemeStore()

  const version = appVersion as string
  const isGithubMode = import.meta.env.VITE_APP_VIEW === 'github'

  const desktop = ref(LightdmHandler.defaultSession)
  const username = ref(LightdmHandler.username)
  const password = ref('')
  const defaultColor = ref('#6BBBED')
  const zoom = ref(1)
  const users = ref(LightdmHandler.users as LightdmUsers[])
  const desktops = ref(LightdmHandler.sessions as LightdmSession[])
  const showPassword = ref(false)
  const bodyClass = reactive<Record<string, boolean>>({
    blur: true,
    'no-transition': false,
    'show-framerate': false,
    'only-ui': false
  })

  const showFrameRate = computed(() => bodyClass['show-framerate'])
  const viewThemeOnly = computed(() => bodyClass['only-ui'])

  const currentUser = computed(() => users.value.find((user) => user.username === username.value))
  const currentDesktop = computed(() => desktops.value.find(({ key }) => key === desktop.value))

  const getMainSettings = computed((): AppSettings => ({
    zoom: zoom.value,
    themes: themeStore.themes,
    desktop: desktop.value,
    username: username.value,
    bodyClass,
    currentTheme: themeStore.currentTheme,
    defaultColor: defaultColor.value
  }))

  const personalInfo = computed(() => ({
    username: username.value,
    currentTheme: themeStore.currentTheme,
    desktop: desktop.value,
    version,
    defaultColor: defaultColor.value
  }))

  const settableRefs: Record<string, Ref<any>> = { desktop, username, password, defaultColor, zoom }

  function login() {
    LightdmHandler.login(username.value, password.value, currentDesktop.value?.key)
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

  function setUpSettings() {
    try {
      const settings: AppSettings = JSON.parse(localStorage.getItem('settings') || '{}')

      if (settings.themes) themeStore.syncThemeWithStore(settings)

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
    desktop,
    username,
    password,
    defaultColor,
    zoom,
    users,
    desktops,
    showPassword,
    bodyClass,
    showFrameRate,
    viewThemeOnly,
    currentUser,
    currentDesktop,
    getMainSettings,
    personalInfo,
    login,
    toggleShowPassword,
    changeBodyClass,
    saveStateApp,
    syncSettingsWithCache,
    setUpSettings
  }
})
