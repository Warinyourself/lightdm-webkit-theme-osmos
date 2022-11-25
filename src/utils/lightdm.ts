import { AppState } from '@/store/app'

/**
 * INFO: To avoid recoursive requires modules (lightdm and AppModule)
 * @returns AppState
 */
async function getAppModule(): Promise<AppState> {
  const module = await import('@/store/app') as any
  return module.AppModule
}

const DEBUG_PASSWORD = 'password'
const lightdmDebug = window.lightdm === undefined

function setIsAuthenticated(value: boolean) {
  (window.lightdm as any).is_authenticated = value
}

if (lightdmDebug) {
  window.lightdm = {
    is_authenticated: false,
    authentication_user: undefined,
    default_session: 'plasma-shell',
    can_access_battery: true,
    can_access_brightness: true,
    can_suspend: true,
    can_restart: true,
    can_hibernate: true,
    can_shutdown: true,

    battery_data: {
      level: Math.ceil(Math.random() * 99 + 1),
      ac_status: true
    },
    brightness: Math.ceil(Math.random() * 99 + 1),

    battery_update: {
      _callbacks: [],
      _emit: () => {
        window.lightdm?.battery_update._callbacks.forEach((cb) => cb())
      },
      connect: (callback: () => void) => {
        window.lightdm?.battery_update._callbacks.push(callback)
      }
    },
    authentication_complete: {
      _callbacks: [],
      _emit: () => {
        console.log(window.lightdm?.authentication_complete._callbacks)
        window.lightdm?.authentication_complete._callbacks.forEach((cb) => cb())
      },
      connect: (callback: () => void) => {
        window.lightdm?.authentication_complete._callbacks.push(callback)
      }
    },
    brightness_update: {
      _callbacks: [],
      _emit: () => {
        window.lightdm?.brightness_update._callbacks.forEach((cb) => cb())
      },
      connect: (callback: () => void) => {
        window.lightdm?.brightness_update._callbacks.push(callback)
      }
    },

    sessions: [
      {
        name: 'i3wm',
        key: 'i3'
      },
      {
        name: 'KDE 5',
        key: 'plasma-shell'
      },
      {
        name: 'Kodi',
        key: 'kodi'
      },
      {
        name: 'Gnome 3',
        key: 'gnome-shell'
      },
      {
        name: 'XFCE 4',
        key: 'xfce'
      },
      {
        name: 'Openbox',
        key: 'openbox'
      },
      {
        name: 'Cinnamon',
        key: 'cinnamon'
      },
      {
        name: 'xmonad',
        key: 'xmonad'
      }
    ],
    users: [
      {
        display_name: 'Warinyourself',
        username: 'Warinyourself',
        image: 'https://avatars.githubusercontent.com/u/83131232?s=200&u=26fbedfe561a2b37225c78c10b1c5d67d6fe1832&v=4'
      },
      {
        display_name: 'Bob',
        username: 'Bob'
      }
    ],
    languages: [
      {
        name: 'Русский',
        code: 'ru_RU.utf8'
      },
      {
        name: 'American English',
        code: 'en_US.utf8'
      }
    ],
    language: { code: 'en_US', name: 'American English' },

    start_authentication: (username: string) => {
      console.log(`Starting authenticating here: '${username}'`)
      const inputNode = document.getElementById('password') as HTMLInputElement

      window.lightdm?.respond(inputNode?.value || '')
    },
    authenticate: (username: string) => {
      const inputNode = document.getElementById('password') as HTMLInputElement
      console.log(`Starting authenticating user: '${username}'`)

      if (window.lightdm) {
        (window.lightdm as any).authentication_user = username
      }

      window.lightdm?.respond(inputNode?.value || '')
    },
    cancel_authentication: () => {
      console.log('Auth cancelled')
    },
    start_session(session: string) {
      alert(`Start session: ${session}`)
    },
    respond: (password: string) => {
      console.log(`Password provided : '${password}'`)

      if (password === DEBUG_PASSWORD) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
      window.lightdm?.authentication_complete._emit()
    },
    shutdown() {
      alert('(DEBUG: System is shutting down)')
    },
    hibernate() {
      alert('(DEBUG: System is shutting down)')
    },
    suspend: () => {
      alert('(DEBUG: System is suspending)')
    },
    restart: () => {
      alert('(DEBUG: System is rebooting)')
    }
  } as any
}

const isSupportFullApi = 'battery_data' in (window.lightdm || {})

class LightdmWebkit {
  protected _inputErrorTimer!: null | NodeJS.Timeout

  get defaultSession() {
    return this.sessions[0]?.key || window.lightdm?.default_session || 'i3'
  }

  get isSupportFullApi() {
    return isSupportFullApi
  }

  get sessions() {
    return window.lightdm?.sessions || []
  }

  get hasGuestAccount() {
    return window.lightdm?.has_guest_account
  }

  get users() {
    return window.lightdm?.users || []
  }

  get username() {
    return this.users[0]?.username || 'Username'
  }

  get languages() {
    return window.lightdm?.languages
  }

  get canRestart() {
    return window.lightdm?.can_restart
  }

  get canShutdown() {
    return window.lightdm?.can_shutdown
  }

  get canSuspend() {
    return window.lightdm?.can_suspend
  }

  get canHibernate() {
    return window.lightdm?.can_hibernate
  }

  shutdown() {
    return window.lightdm?.shutdown()
  }

  hibernate() {
    return window.lightdm?.hibernate()
  }

  suspend() {
    return window.lightdm?.suspend()
  }

  restart() {
    return window.lightdm?.restart()
  }

  protected _setInputError() {
    const inputNode = document.getElementById('password')
    if (!inputNode) return

    inputNode.classList.add('password-input--error')

    if (this._inputErrorTimer) {
      clearTimeout(this._inputErrorTimer)
    }

    this._inputErrorTimer = setTimeout(() => {
      inputNode.classList.remove('password-input--error')
      this._inputErrorTimer = null
    }, 10000)
  }
}

class LightdmNode extends LightdmWebkit {
  public _username!: string
  public _password!: string
  public _session!: string

  constructor() {
    super()
    this.init()
  }

  public login(username: string, password: string, session?: string): void {
    this._username = username
    this._password = password
    this._session = session || this.defaultSession

    window.lightdm?.authenticate(username)
  }

  public setAuthenticationDone(): void {
    window.lightdm?.authentication_complete?.connect(() => {
      if (window.lightdm?.is_authenticated) {
        window.lightdm?.start_session(this._session || window.lightdm?.default_session)
      } else {
        this._authenticationFailed()
      }
    })

    window.lightdm_cancel_login = () => {
      window.lightdm?.cancel_authentication()
    }
  }

  private _authenticationFailed(): void {
    this._setInputError()
    window.lightdm?.cancel_authentication()
  }

  public setSignalHandler(): void {
    window.lightdm?.show_message?.connect(function(text, type) {
      console.log({ text, type })
    })

    window.lightdm?.show_prompt?.connect((_message, type) => {
      console.log({ _message, type })
      if (!window.lightdm) return
      if (type === 0) {
        window.lightdm.respond(this._username)
      } else if (type === 1 && window.lightdm.in_authentication) {
        window.lightdm.respond(this._password)
      }
    })

    if (window.lightdm?.can_access_brightness) {
      this.updateBrightData()
      window.lightdm?.brightness_update.connect(this.updateBrightData)
    }

    if (window.lightdm?.can_access_battery) {
      this.updateBatteryData()
      window.lightdm?.battery_update.connect(this.updateBatteryData)
    }
  }

  public async updateBatteryData(): Promise<void> {
    const module = await getAppModule()
    module.SET_STATE_APP({ key: 'battery', value: window.lightdm?.battery_data })
  }

  public async updateBrightData(): Promise<void> {
    const module = await getAppModule()
    module.SET_STATE_APP({ key: 'brightness', value: window.lightdm?.brightness })
  }

  public init(): void {
    this.setSignalHandler()
    this.setAuthenticationDone()
  }
}

export const LightdmHandler = new LightdmNode()

window.lightdm_cancel_login = () => {
  window.lightdm?.cancel_authentication()
}

window.lightdm_start = (desktop: string) => {
  window.lightdm?.start_session(desktop)
}

window.show_prompt = (text, type) => {
  if (text === 'Password: ' && LightdmHandler._password !== undefined) {
    window.lightdm?.respond(LightdmHandler._password)
  }
}

window.authentication_complete = () => {
  if (window.lightdm?.is_authenticated) {
    window.lightdm_start(LightdmHandler._session)
  } else if (document.head.dataset.wintype === 'primary') {
    window.lightdm?.cancel_authentication()
  }
}
