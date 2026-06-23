import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

import type { AppSettings } from '@/models/app'

import { useThemeStore } from '@/store/theme'
import { useLightdm } from '@/composables/useLightdm'
import { useSettingsStorage } from '@/composables/useSettingsStorage'
import { version as appVersion } from '../../package.json'

export const useAppStore = defineStore('app', () => {
  const themeStore = useThemeStore()
  const session = useLightdm()

  const version = appVersion as string
  const isGithubMode = import.meta.env.VITE_APP_VIEW === 'github'
  const isDebugMode = import.meta.env.VITE_DEBUG === 'true'

  const defaultColor = ref('#6BBBED')
  const zoom = ref(1)
  const hotkeysEnabled = ref(false)
  const showTime = ref(true)
  const timeFormat = ref('short')
  const bodyClass = reactive<Record<string, boolean>>({
    blur: true,
    'no-transition': false,
    'show-framerate': false,
  })

  const showFrameRate = computed(() => bodyClass['show-framerate'])

  const getMainSettings = computed((): AppSettings => ({
    zoom: zoom.value,
    themes: themeStore.themes,
    desktop: session.desktop.value,
    username: session.username.value,
    bodyClass,
    currentTheme: themeStore.currentTheme,
    defaultColor: defaultColor.value,
    hotkeysEnabled: hotkeysEnabled.value,
    showTime: showTime.value,
    timeFormat: timeFormat.value,
  }))

  function changeBodyClass({ key, value }: { key: string; value: boolean }) {
    bodyClass[key] = value
  }

  function saveStateApp({ key, value }: { key: string; value: string }) {
    if (key === 'desktop') session.desktop.value = value
    else if (key === 'username') session.username.value = value
    else if (key === 'defaultColor') defaultColor.value = value
    else if (key === 'zoom') zoom.value = parseFloat(value)

    localStorage.setItem(key, value)
  }

  const storage = useSettingsStorage()

  function setUpSettings() {
    const settings = storage.load()
    if (!settings) return

    if (settings.themes) themeStore.syncThemeWithStore(settings)

    const validDesktop = window.lightdm?.sessions.find(({ key }) => key === settings.desktop)?.key
    session.desktop.value = validDesktop || window.lightdm?.sessions[0]?.key || 'openbox'

    const validUser = window.lightdm?.users.find(({ username }) => username === settings.username)?.username
    session.username.value = validUser || window.lightdm?.users[0]?.username || ''

    zoom.value = settings.zoom || 1
    hotkeysEnabled.value = settings.hotkeysEnabled ?? false
    showTime.value = settings.showTime ?? true
    timeFormat.value = settings.timeFormat ?? 'short'
  }

  return {
    version,
    isGithubMode,
    isDebugMode,
    defaultColor,
    zoom,
    hotkeysEnabled,
    showTime,
    timeFormat,
    bodyClass,
    showFrameRate,
    getMainSettings,
    changeBodyClass,
    saveStateApp,
    setUpSettings,
  }
})
