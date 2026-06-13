import { defineStore } from 'pinia'

import type { AppTheme, AppSettings, AppInputTheme, AppInputThemeValue } from '@/models/app'
import type { LightdmSession, LightdmUsers } from '@/models/lightdm'

import { randomizeSettingsTheme, setCSSVariable } from '@/utils/helper'
import { AppThemes, defaultTheme } from '@/utils/constant'
import { LightdmHandler } from '@/utils/lightdm'
import { version } from '../../package.json'

export const useAppStore = defineStore('app', {
  state: () => ({
    version: version as string,
    currentTheme: '',
    desktop: LightdmHandler.defaultSession,
    username: LightdmHandler.username,
    password: '',
    defaultColor: '#6BBBED',
    zoom: 1,
    users: LightdmHandler.users as LightdmUsers[],
    desktops: LightdmHandler.sessions as LightdmSession[],
    showPassword: false,
    themes: AppThemes as AppTheme[],
    bodyClass: {
      blur: true,
      'no-transition': false,
      'show-framerate': false,
      'only-ui': false
    } as Record<string, boolean>
  }),

  getters: {
    showFrameRate: (state) => state.bodyClass['show-framerate'],
    viewThemeOnly: (state) => state.bodyClass['only-ui'],
    isGithubMode: () => import.meta.env.VITE_APP_VIEW === 'github',

    activeTheme: (state): AppTheme =>
      state.themes.find(({ name }) => name === state.currentTheme) || defaultTheme,

    currentUser: (state) => state.users.find(({ username }) => username === state.username),
    currentDesktop: (state) => state.desktops.find(({ key }) => key === state.desktop),

    getThemeByName: (state) => (theme: string) =>
      state.themes.find(({ name }) => name === theme),

    getThemeInput: (state) => (name: string, theme?: AppTheme) => {
      const active = state.themes.find((t) => t.name === state.currentTheme) || defaultTheme
      return (theme || active).settings?.find((input) => input.name === name)
    },

    getMainSettings: (state): AppSettings => ({
      zoom: state.zoom,
      themes: state.themes,
      desktop: state.desktop,
      username: state.username,
      bodyClass: state.bodyClass,
      currentTheme: state.currentTheme,
      defaultColor: state.defaultColor,
    }),

    personalInfo: (state) => ({
      username: state.username,
      currentTheme: state.currentTheme,
      desktop: state.desktop,
      version: state.version,
      defaultColor: state.defaultColor
    })
  },

  actions: {
    randomizeSettingsTheme() {
      const theme = this.activeTheme
      theme.settings = randomizeSettingsTheme(theme as AppTheme)
    },

    async changeTheme(themeName: string, themeSettings?: AppTheme['settings']) {
      const isExistTheme = this.getThemeByName(themeName)
      const finalTheme = isExistTheme ? themeName : this.themes[0]!.name

      this.currentTheme = finalTheme

      if (isExistTheme && themeSettings) {
        this.changeSettingsTheme({ theme: finalTheme, settings: themeSettings })
      }
    },

    login() {
      LightdmHandler.login(this.username, this.password, this.currentDesktop?.key)
    },

    changeSettingsTheme({ theme, settings }: { theme: string; settings: AppTheme['settings'] }) {
      const currentTheme = this.themes.find(({ name }) => name === theme)
      if (currentTheme) currentTheme.settings = settings
    },

    changeThemeInput({ input, value }: { input: AppInputTheme; value: AppInputThemeValue }) {
      input.value = value
    },

    changeSettingsThemeInput({ key, value }: { key: string; value: AppInputThemeValue }) {
      const input = (this.activeTheme as AppTheme).settings?.find((i) => i.name === key)
      if (input) input.value = value
    },

    toggleShowPassword() {
      this.showPassword = !this.showPassword
    },

    changeBodyClass({ key, value }: { key: string; value: boolean }) {
      this.bodyClass[key] = value
    },

    saveStateApp({ key, value }: { key: string; value: string }) {
      (this as any)[key] = value
      localStorage.setItem(key, value)
    },

    syncSettingsWithCache() {
      localStorage.setItem('settings', JSON.stringify(this.getMainSettings))
    },

    syncThemeColor() {
      const { color } = this.activeTheme
      setCSSVariable('--color-bg', color.background)
    },

    syncThemeWithStore(settings: AppSettings) {
      const themeName = settings.currentTheme

      const syncTheme = this.themes.reduce((themes: AppTheme[], theme) => {
        const cachedTheme = settings.themes.find(({ name }) => name === theme.name)
        const isActiveTheme = theme.name === themeName
        const hasCachedTheme = cachedTheme && cachedTheme.settings

        if (hasCachedTheme) {
          theme.settings = theme.settings?.map((input) => {
            const cachedInput = this.getThemeInput(input.name, cachedTheme)
            const value = cachedInput?.value ?? input.value
            return { ...input, value }
          })
        }

        themes.push(theme)
        if (isActiveTheme) this.currentTheme = themeName

        return themes
      }, [])

      this.themes = syncTheme
    },

    setUpSettings() {
      try {
        const settings: AppSettings = JSON.parse(localStorage.getItem('settings') || '{}')

        if (settings.themes) this.syncThemeWithStore(settings)

        const isExistDE = window.lightdm?.sessions.find(({ key }) => key === settings.desktop)
        if (!isExistDE) settings.desktop = window.lightdm?.sessions[0]?.key || 'openbox'

        const isExistUser = window.lightdm?.users.find(({ username }) => username === settings.username)
        if (!isExistUser) settings.username = window.lightdm?.users[0]?.username || 'Warinyourself'

        this.desktop = settings.desktop
        this.username = settings.username
        this.zoom = settings.zoom || 1
      } catch {
        this.setUpSettings()
      }
    }
  }
})
