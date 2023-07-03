import { defineStore } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'
import router from '@/router'

import type { AppTheme, AppSettings, AppInputTheme, AppInputThemeValue, AppInputThemeGeneral } from '@/models/app'
import type { LightdmSession, LightdmUsers } from '@/models/lightdm'
import type { LightDMBattery } from 'nody-greeter-types'

import { isDifferentRoute, parseQueryValue, randomize, randomizeSettingsTheme, setCSSVariable } from '@/utils/helper'
import { AppThemes, defaultTheme } from '@/utils/constant'
import { LightdmHandler } from '@/utils/lightdm'
import { version } from '../../package.json'

export const useAppStore = defineStore('app', {
  state: () => ({
    version: version as string,
    currentTheme: '',
    currentOs: 'arch-linux',
    desktop: LightdmHandler.defaultSession,
    username: LightdmHandler.username,
    password: '',
    defaultColor: '#6BBBED',
    battery: null as LightDMBattery | null,
    brightness: 0,
    zoom: 1,
    users: LightdmHandler.users as LightdmUsers[],
    desktops: LightdmHandler.sessions as LightdmSession[],
    showPassword: false,
    generateRandomThemes: false,
    themes: AppThemes as AppTheme[],
    bodyClass: {
      blur: false,
      'no-transition': false,
      'show-framerate': false,
      'only-ui': false
    } as Record<string, boolean>
  }),

  getters: {
    isCharging: (state) => state.battery?.status === 'Charging',
    batteryLevel: (state) => state.battery?.level || 0,
    isSupportFullApi: () => LightdmHandler.isSupportFullApi,
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
      currentOs: state.currentOs,
      currentTheme: state.currentTheme,
      defaultColor: state.defaultColor,
      generateRandomThemes: state.generateRandomThemes
    }),

    personalInfo: (state) => ({
      username: state.username,
      currentTheme: state.currentTheme,
      currentOs: state.currentOs,
      desktop: state.desktop,
      version: state.version,
      defaultColor: state.defaultColor
    })
  },

  actions: {
    randomizeSettingsTheme() {
      const theme = this.activeTheme
      theme.settings = randomizeSettingsTheme(theme as AppTheme)
      this.syncStoreWithQuery()
    },

    async changeTheme(themeName: string, themeSettings?: AppTheme['settings']) {
      const isExistTheme = this.getThemeByName(themeName)
      const finalTheme = isExistTheme ? themeName : this.themes[0]!.name

      this.currentTheme = finalTheme

      if (isExistTheme && themeSettings) {
        this.changeSettingsTheme({ theme: finalTheme, settings: themeSettings })
      }

      this.syncThemeColor()
      this.syncStoreWithQuery()
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
      this.syncBodyClassWithStore({ settings: this.getMainSettings, query: router.currentRoute.value.query })
    },

    saveStateApp({ key, value }: { key: string; value: string }) {
      (this as any)[key] = value
      localStorage.setItem(key, value)
      this.syncStoreWithQuery()
    },

    syncSettingsWithCache() {
      localStorage.setItem('settings', JSON.stringify(this.getMainSettings))
    },

    syncThemeColor() {
      const { color } = this.activeTheme
      let activeColor = color.active

      if (this.activeTheme.settings) {
        const colorInput = this.activeTheme.settings.find(({ name }) => name === 'activeColor') as AppInputThemeGeneral
        if (colorInput) activeColor = colorInput.value + ''
      }

      setCSSVariable('--color-active', activeColor)
      setCSSVariable('--color-bg', color.background)
    },

    syncStoreWithQuery() {
      const route = router.currentRoute.value

      const inputQuery = this.activeTheme.settings?.reduce<Record<string, string>>((query, input) => {
        query[input.name] = input.value + ''
        return query
      }, {})

      const bodyClassQuery = Object.entries(this.bodyClass).reduce<Record<string, string>>((query, [key, value]) => {
        query[key] = value + ''
        return query
      }, {})

      const query = { ...inputQuery, ...bodyClassQuery, themeName: this.currentTheme }
      const routeTo = { name: route.name || '/', query }

      if (isDifferentRoute(routeTo)) {
        router.replace(routeTo)
      }
    },

    syncThemeWithStore({ settings, query }: { settings: AppSettings; query: RouteLocationNormalized['query'] }) {
      let themeName = (query.themeName as string) || settings.currentTheme
      const { generateRandomThemes } = settings
      const indexTheme = Math.floor(randomize(0, this.themes.length - 1))

      const syncTheme = this.themes.reduce((themes: AppTheme[], theme, index) => {
        const cachedTheme = settings.themes.find(({ name }) => name === theme.name)
        const isActiveTheme = generateRandomThemes ? indexTheme === index : theme.name === themeName
        const hasCachedTheme = cachedTheme && cachedTheme.settings

        if (hasCachedTheme) {
          if (isActiveTheme && generateRandomThemes) {
            themeName = theme.name
            theme.settings = randomizeSettingsTheme(theme)
          } else {
            theme.settings = theme.settings?.map((input) => {
              const cachedInput = this.getThemeInput(input.name, cachedTheme)
              let value = cachedInput?.value ?? input.value

              if (isActiveTheme) {
                const queryInput = input.name in query ? parseQueryValue(query[input.name] as string) : null
                value = queryInput ?? value
              }

              return { ...input, value }
            })
          }
        }

        themes.push(theme)
        if (isActiveTheme) this.currentTheme = themeName

        return themes
      }, [])

      this.themes = syncTheme
    },

    syncBodyClassWithStore({ settings, query }: { settings: AppSettings; query: RouteLocationNormalized['query'] }) {
      const bodyClassKeys = Object.keys(this.bodyClass)
      const queryBodyClass = bodyClassKeys.reduce<Record<string, boolean>>((bodyClass, key) => {
        if (key in query) bodyClass[key] = query[key] === 'true'
        return bodyClass
      }, {})

      this.bodyClass = { ...settings.bodyClass, ...queryBodyClass }
    },

    setUpSettings() {
      const query = router.currentRoute.value.query

      try {
        const settings: AppSettings = JSON.parse(localStorage.getItem('settings') || '{}')
        this.generateRandomThemes = settings.generateRandomThemes || false

        if (settings.themes) this.syncThemeWithStore({ settings, query })
        if (settings.bodyClass) this.syncBodyClassWithStore({ settings, query })

        const isExistDE = window.lightdm?.sessions.find(({ key }) => key === settings.desktop)
        if (!isExistDE) settings.desktop = window.lightdm?.sessions[0]?.key || 'openbox'

        const isExistUser = window.lightdm?.users.find(({ username }) => username === settings.username)
        if (!isExistUser) settings.username = window.lightdm?.users[0]?.username || 'Warinyourself'

        this.currentOs = settings.currentOs || 'arch-linux'
        this.desktop = settings.desktop
        this.username = settings.username
        this.zoom = settings.zoom || 1
      } catch {
        this.setUpSettings()
      }
    }
  }
})
