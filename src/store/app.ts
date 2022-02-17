import {
  Module,
  VuexModule,
  getModule,
  Mutation,
  Action
} from 'vuex-module-decorators'
import { Route } from 'vue-router'
import router from '../router'
import store from '@/store/index'

import {
  AppInputTheme,
  AppInputThemeGeneral,
  AppInputThemeSlider,
  AppInputThemeValue,
  AppSettings,
  AppTheme,
  AppThemes,
  defaultTheme
} from '@/models/app'
import { appWindow, LightdmSession, LightdmUsers } from '@/models/lightdm'
import { generateRandomColor, generateRandomSliderValue, parseQueryValue, randomize } from '@/utils/helper'

export interface AppState extends AppSettings {
  themes: AppTheme[];
  getMainSettings: AppSettings;
  activeTheme: AppTheme;
  username: string;
  desktops: LightdmSession[];
  users: LightdmUsers[];
}

@Module({ dynamic: true, store, name: 'app' })
class App extends VuexModule implements AppState {
  version = '2.0.0'
  currentTheme = ''
  currentOs = 'arch-linux'
  desktop = appWindow?.lightdm?.sessions[0].key || 'i3'
  username = appWindow?.lightdm?.users[0].username || 'User name'
  password = ''
  defaultColor = '#6BBBED'

  users = appWindow?.lightdm?.users || []
  desktops = appWindow?.lightdm?.sessions || []

  themes = AppThemes

  bodyClass: Record<string, boolean> = {
    blur: false,
    'no-transition': false,
    'show-frame-rate': false,
    'only-graphic': false
  }

  // TODO: replace this on localStorageSettings
  get getMainSettings(): AppSettings {
    const {
      themes,
      desktop,
      username,
      bodyClass,
      currentOs,
      currentTheme,
      defaultColor
    } = this

    return {
      themes,
      desktop,
      username,
      bodyClass,
      currentOs,
      currentTheme,
      defaultColor
    }
  }

  get showFrameRate() {
    return this.bodyClass['show-frame-rate']
  }

  get activeTheme() {
    return this.themes.find(({ name }) => name === this.currentTheme) || defaultTheme
  }

  get currentUser() {
    return this.users.find(({ username }) => username === this.username)
  }

  get currentDesktop() {
    return this.desktops.find(({ key }) => key === this.desktop)
  }

  get getThemeByName() {
    return (theme: string) => this.themes.find(({ name }) => name === theme)
  }

  get getThemeInput() {
    return (name: string, theme?: AppTheme) => {
      return (theme || this.activeTheme as AppTheme).settings?.find(input => input.name === name)
    }
  }

  get viewThemeOnly() {
    return this.bodyClass['only-graphic']
  }

  get isGithubMode() {
    return process.env.VUE_APP_VIEW === 'github'
  }

  get personalInfo() {
    const { username, currentTheme, currentOs, desktop, version, defaultColor } = this

    return { username, currentTheme, currentOs, desktop, version, defaultColor }
  }

  get localStorageSettings() {
    const { personalInfo, bodyClass, themes } = this

    return { personalInfo, bodyClass, themes }
  }

  @Mutation
  SET_STATE_APP<S extends this, K extends keyof this>({ key, value }: { key: K; value: S[K] }) {
    this[key] = value
  }

  @Mutation
  SAVE_STATE_APP<S extends this, K extends keyof this>({ key, value }: { key: K; value: S[K] }) {
    this[key] = value

    // TODO: write sync function this.syncLocalStorageWithStore()
    const settings = JSON.parse(localStorage.getItem('settings') || '')
    settings[key] = value
    localStorage.setItem('settings', JSON.stringify(settings))
  }

  @Mutation
  CHANGE_BODY_CLASS({ key, value }: { key: string; value: boolean }) {
    this.bodyClass[key] = value
    // TODO: write sync function this.syncLocalStorageWithStore()
  }

  @Mutation
  CHANGE_THEME_INPUT({ input, value }: { input: AppInputTheme; value: AppInputThemeValue }) {
    input.value = value
  }

  @Mutation
  CHANGE_SETTINGS_THEME({ theme, settings }: { theme: string; settings: AppTheme['settings'] }) {
    const currentTheme = this.themes.find(({ name }) => name === theme)

    if (currentTheme) {
      currentTheme.settings = settings
    }
  }

  @Action
  randomizeSettingsTheme() {
    const theme = this.activeTheme
    const generateValueObject: Record<string, (input: AppInputThemeSlider) => AppInputThemeValue> = {
      slider: (input: AppInputThemeSlider) => generateRandomSliderValue(input),
      checkbox: () => Math.random() > 0.5,
      color: () => generateRandomColor(),
      palette: (input: AppInputThemeGeneral) => Math.floor(randomize(0, (input.values?.length || 2) - 1))
    }

    theme.settings = theme.settings?.map(input => {
      const changeValueFunction = generateValueObject[input.type]

      if (changeValueFunction) {
        input.value = changeValueFunction(input as AppInputThemeSlider)
      }

      return input
    })

    this.syncSettingsWithCache()
    this.syncStoreWithQuery()
  }

  @Action
  async changeTheme(themeName: string, themeSettings?: AppTheme['settings']) {
    const isExistTheme = this.getThemeByName(themeName)
    const finalTheme = isExistTheme ? themeName : this.themes[0].name

    this.SET_STATE_APP({ key: 'currentTheme', value: finalTheme })

    const needToChangeTheme = isExistTheme && themeSettings
    if (needToChangeTheme) {
      this.CHANGE_SETTINGS_THEME({ theme: finalTheme, settings: themeSettings })
    }

    this.syncThemeColor()
    this.syncStoreWithQuery()
    this.syncSettingsWithCache()
  }

  @Action
  login() {
    appWindow.lightdmLogin(this.username, this.password, () => {
      appWindow.lightdmStart(this.currentDesktop?.key || appWindow?.lightdm?.sessions[0].key || 'i3')
    })
  }

  @Action
  changeSettingsThemeInput({ key, value }: { key: string; value: AppInputThemeValue }) {
    const inputs = (this.activeTheme as AppTheme).settings || []
    const input = inputs?.find(input => input.name === key)

    if (input) {
      this.CHANGE_THEME_INPUT({ input, value })

      this.syncSettingsWithCache()
    }
  }

  @Action
  syncSettingsWithCache() {
    localStorage.setItem('settings', JSON.stringify(this.getMainSettings))
  }

  @Action
  syncThemeColor() {
    const { color } = this.activeTheme
    let activeColor = color.active

    if (this.activeTheme.settings) {
      const activeColorInput = this.activeTheme.settings.find(({ name }) => name === 'activeColor') as AppInputThemeGeneral
      if (activeColorInput) {
        activeColor = activeColorInput.value + ''
      }
    }

    document.documentElement.style.setProperty('--color-active', activeColor)
    document.documentElement.style.setProperty('--color-bg', color.background)
  }

  @Action
  syncStoreWithQuery() {
    const { app: { $route, $router } } = router

    const inputQuery = this.activeTheme.settings?.reduce<Record<string, string>>((query, input) => {
      query[input.name] = input.value + ''
      return query
    }, {})
    const bodyClassQuery = Object.entries(this.bodyClass).reduce<Record<string, string>>((query, [key, value]) => {
      query[key] = value + ''
      return query
    }, {})

    $router.push({ name: $route.name || '/', query: { ...inputQuery, ...bodyClassQuery, themeName: this.currentTheme } })
  }

  @Action
  syncThemeWithStore({ settings, query }: { settings: AppSettings; query: Route['query'] }) {
    const themeName = query.themeName as string || settings.currentTheme

    const syncTheme = this.themes.reduce((themes: AppTheme[], theme) => {
      const cachedTheme = settings.themes.find(({ name }) => name === theme.name)
      const isActiveTheme = theme.name === themeName

      if (cachedTheme && cachedTheme?.settings) {
        theme.settings = theme.settings?.map(input => {
          const cachedThemeInput = this.getThemeInput(input.name, cachedTheme)
          let value = cachedThemeInput?.value ?? input.value

          if (isActiveTheme) {
            const queryThemeInput = input.name in query ? parseQueryValue(query[input.name] as string) : null
            value = queryThemeInput ?? value
          }

          return Object.assign(input, { value })
        })
      }

      themes.push(theme)

      if (isActiveTheme) { this.SAVE_STATE_APP({ key: 'currentTheme', value: themeName }) }

      return themes
    }, [])

    this.SET_STATE_APP({ key: 'themes', value: syncTheme })
  }

  @Action
  syncBodyClassWithStore({ settings, query }: { settings: AppSettings; query: Route['query'] }) {
    const bodyClassKeys = Object.keys(this.bodyClass)
    const queryBodyClass = bodyClassKeys.reduce<Record<string, boolean>>((bodyClass, key) => {
      if (key in query) { bodyClass[key] = query[key] === 'true' }
      return bodyClass
    }, {})

    this.SET_STATE_APP({ key: 'bodyClass', value: { ...queryBodyClass, ...settings.bodyClass } })
  }

  @Action
  setUpSettings() {
    const { app: { $route } } = router
    const { query } = $route

    try {
      const settings: AppSettings = JSON.parse(localStorage.getItem('settings') || '{}')

      if (settings.themes) {
        this.syncThemeWithStore({ settings, query })
      }

      if (settings.bodyClass) {
        this.syncBodyClassWithStore({ settings, query })
      }

      const isExistDE = appWindow?.lightdm?.sessions.find(({ key }) => key === settings.desktop)
      if (isExistDE === undefined) {
        settings.desktop = appWindow?.lightdm?.sessions[0].key || 'openbox'
      }

      const isExistUser = appWindow?.lightdm?.users.find(({ username }) => username === settings.username)
      if (isExistUser === undefined) {
        settings.username = appWindow?.lightdm?.users[0].username || 'Warinyourself'
      }

      this.SET_STATE_APP({ key: 'currentOs', value: settings.currentOs || 'arch-linux' })
      this.SET_STATE_APP({ key: 'desktop', value: settings.desktop })
      this.SET_STATE_APP({ key: 'username', value: settings.username })
      this.syncSettingsWithCache()
    } catch (error) {
      this.syncSettingsWithCache()
      this.setUpSettings()
    }
  }
}

export const AppModule = getModule(App)
