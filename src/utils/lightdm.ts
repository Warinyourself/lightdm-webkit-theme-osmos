/* eslint-disable camelcase */
import { appWindow } from '@/models/lightdm'

const DEBUG_PASSWORD = 'password'

const lightdmDebug = appWindow.lightdm === undefined
let password: string
let completeCallback: undefined | (() => void)

if (lightdmDebug) {
  appWindow.lightdm = {
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
    start_authentication: (username) => {
      console.log(`Starting authenticating here: '${username}'`)
      appWindow.lightdm.respond(password)
    },
    authenticate: (username) => {
      console.log(`Starting authenticating user: '${username}'`)
    },
    cancel_authentication: () => {
      console.log('Auth cancelled')
    },
    respond: (password) => {
      console.log(`Password provided : '${password}'`)

      if (password === DEBUG_PASSWORD) {
        appWindow.lightdm.is_authenticated = true
      }

      appWindow.authentication_complete()
    },
    login(user, session) {
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
  }
}

appWindow.lightdmLogin = (username, pass, callback) => {
  completeCallback = callback
  password = pass
  console.log(`lightdmLogin ${username}, ${pass}`)

  appWindow.lightdm.start_authentication(username)
}

appWindow.lightdmStart = desktop => {
  if (appWindow.lightdm) {
    appWindow.lightdm.login(appWindow.lightdm.authentication_user || '', desktop)
  }
}

let inputErrorTimer: null | any

appWindow.authentication_complete = () => {
  if (appWindow?.lightdm?.is_authenticated && completeCallback) {
    completeCallback()
  } else {
    appWindow.lightdm.cancel_authentication()

    const inputNode = document.getElementById('password')
    if (!inputNode) return

    inputNode.classList.add('password-input--error')

    if (inputErrorTimer) {
      clearTimeout(inputErrorTimer)
    }

    inputErrorTimer = setTimeout(() => {
      inputNode.classList.remove('password-input--error')
      inputErrorTimer = null
    }, 10000)
  }
}

appWindow.show_prompt = (text, _type) => {
  if (text === 'Password: ') {
    if (appWindow.lightdm) {
      appWindow.lightdm.respond(password)
    }
  }
}

appWindow.show_message = (text, type) => {
  alert(text)
}
