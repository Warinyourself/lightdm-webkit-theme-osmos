import { Lightdm } from '@/models/lightdm'
import { Greeter } from 'nody-greeter-types'

const DEBUG_PASSWORD = 'password'
const lightdmDebug = window.lightdm === undefined
const localLight = window.lightdm as unknown as Lightdm

if (lightdmDebug) {
  window.lightdm = {
    is_authenticated: false,
    authentication_user: undefined,
    default_session: 'plasma-shell',
    can_suspend: true,
    can_restart: true,
    can_hibernate: true,
    can_shutdown: true,
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
        name: 'American English',
        code: 'en_US.utf8'
      },
      {
        name: 'Русский',
        code: 'ru_RU.utf8'
      }
    ],
    language: 'American English',
    start_authentication: (username: string) => {
      console.log(`Starting authenticating here: '${username}'`)
      const inputNode = document.getElementById('password') as HTMLInputElement

      localLight.respond(inputNode?.value || '')
    },
    authenticate: (username: string) => {
      console.log(`Starting authenticating user: '${username}'`)
    },
    cancel_authentication: () => {
      console.log('Auth cancelled')
    },
    respond: (password: string) => {
      console.log(`Password provided : '${password}'`)

      if (password === DEBUG_PASSWORD) {
        localLight.is_authenticated = true
      }

      window.authentication_complete()
    },
    login(user: string, session: string) {
      alert(`Logged with '${user}' (Session: '${session}') !`)
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

const isNode = 'batteryData' in (window.lightdm || {})

class LightdmWebkit {
  protected _inputErrorTimer!: null | NodeJS.Timeout

  // get session() {
  //   return ''
  // }

  get defaultSession() {
    return this.sessions[0]?.key || window.lightdm?.default_session || 'i3'
  }

  get isNode() {
    return isNode
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

class LightdmPython extends LightdmWebkit {
  private _password = ''
  private _completeCallback!: () => void

  constructor() {
    super()
    this.init()
  }

  get light() {
    return window.lightdm as unknown as Lightdm
  }

  public login(username: string, password: string, session?: string): void {
    this.lightdmLogin(username, password, () => this.lightdmStart(session || this.defaultSession))
  }

  private lightdmStart(session: string): void {
    this.light.login(this.light.authentication_user || '', session)
  }

  private lightdmLogin(username: string, password: string, callback: () => void) {
    this._completeCallback = callback
    this._password = password

    this.light.start_authentication(username)
  }

  private init() {
    window.authentication_complete = () => {
      if (window.lightdm?.is_authenticated && this._completeCallback) {
        this._completeCallback()
      } else {
        this.light.cancel_authentication()
        this._setInputError()
      }
    }

    window.show_message = (text) => {
      alert(text)
    }

    window.show_prompt = (text) => {
      if (text === 'Password: ') {
        if (window.lightdm) {
          window.lightdm.respond(this._password)
        }
      }
    }
  }
}

class LightdmNode extends LightdmWebkit {
  private _username!: string
  private _password!: string
  private _session!: undefined | string

  constructor() {
    super()
    this.init()
  }

  get light() {
    return window.lightdm as Greeter
  }

  public login(username: string, password: string, session?: string): void {
    this._username = username
    this._password = password
    this._session = session

    this.light.authenticate(null)
  }

  public setAuthenticationDone(): void {
    this.light.authentication_complete.connect(() => {
      if (this.light.is_authenticated) {
        this.light.start_session(this._session || this.light.default_session)
      } else {
        this._authenticationFailed()
      }
    })
  }

  public _authenticationFailed(): void {
    this.light.cancel_authentication()
  }

  public setSignalHandler(): void {
    this.light.show_prompt.connect((_message, type) => {
      if (!window.lightdm) return
      if (type === 0) {
        window.lightdm.respond(this._username)
      } else if (type === 1 && window.lightdm.in_authentication) {
        window.lightdm.respond(this._password)
      }
    })
  }

  public init(): void {
    this.setSignalHandler()
    this.setAuthenticationDone()
  }
}

export const LightdmHandler = isNode ? new LightdmNode() : new LightdmPython()
