/* eslint-disable @typescript-eslint/camelcase */
import { appWindow } from '@/models/lightdm'

const DEBUG_PASSWORD = 'password'

const lightdmDebug = appWindow.lightdm === undefined

if (lightdmDebug) {
  // window.greeter_config = {
  // branding: {
  //   background_images: 'no where this is live test'
  // }
  // }

  appWindow.lightdm = {
    is_authenticated: false,
    authentication_user: undefined,
    default_session: 'plasma-shell',
    can_suspend: true,
    can_restart: true,
    can_hibernate: true,
    can_shutdown: true,
    // sessions: [
    //   {
    //     name: 'i3wm',
    //     key: 'i3'
    //   },
    //   {
    //     name: 'KDE 5',
    //     key: 'plasma-shell'
    //   },
    //   {
    //     name: 'Kodi',
    //     key: 'kodi'
    //   },
    //   {
    //     name: 'Gnome 3',
    //     key: 'gnome-shell'
    //   },
    //   {
    //     name: 'XFCE 4',
    //     key: 'xfce'
    //   },
    //   {
    //     name: 'Openbox',
    //     key: 'openbox'
    //   },
    //   {
    //     name: 'Cinnamon',
    //     key: 'cinnamon'
    //   },
    //   {
    //     name: 'xmonad',
    //     key: 'xmonad'
    //   }
    // ],
    sessions: [
      {
        name: 'GNOME',
        key: 'gnome',
        comment: 'This session logs you into GNOME'
      },
      {
        name: 'GNOME',
        key: 'gnome',
        comment: 'This session logs you into GNOME'
      },
      {
        name: 'GNOME on Xorg',
        key: 'gnome-xorg',
        comment: 'This session logs you into GNOME'
      },
      {
        name: 'Openbox',
        key: 'openbox',
        comment: 'Log in using the Openbox window manager (without a session manager)'
      },
      {
        name: 'awesome',
        key: 'awesome',
        comment: 'Highly configurable framework window manager'
      },
      {
        name: 'i3',
        key: 'i3',
        comment: 'improved dynamic tiling window manager'
      },
      {
        name: 'i3 (with debug log)',
        key: 'i3-with-shmlog',
        comment: 'improved dynamic tiling window manager'
      }
    ],
    users: [
      {
        display_name: 'Tyler Durden',
        username: 'Tyler Durden',
        image: 'https://ychef.files.bbci.co.uk/976x549/p07h2zhs.jpg'
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
      console.log(`Starting authenticating : '${username}'`)

      if (appWindow?.lightdm !== undefined) {
        appWindow.lightdm.authentication_user = username
      }

      appWindow.show_prompt('Password: ')
    },
    cancel_authentication: () => {
      console.log('Auth cancelled')
    },
    respond: (password) => {
      console.log(`Password provided : '${password}'`)

      if (password === DEBUG_PASSWORD && appWindow?.lightdm !== undefined) {
        appWindow.lightdm.is_authenticated = true
      } else {
        const now = new Date().getTime()
        while (new Date().getTime() < now + 2000);
      }

      appWindow.authentication_complete()
    },
    login: (user, session) => {
      alert(`Logged with '${user}' (Session: '${session}') !`)
    },
    shutdown: () => {
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

let password: string
let globalErrorCallback: undefined | Function
let completeCallback: undefined | Function

appWindow.lightdm_login = (username, pass, callback, errorCallback) => {
  completeCallback = callback
  globalErrorCallback = errorCallback
  password = pass
  console.log(`lightdm_login ${username}, ${pass}`)

  if (appWindow.lightdm) {
    appWindow.lightdm.start_authentication(username)
  }
}

appWindow.lightdm_start = desktop => {
  if (appWindow.lightdm) {
    appWindow.lightdm.login(appWindow.lightdm.authentication_user || '', desktop)
  }
}

appWindow.show_prompt = (text, _type) => {
  if (text === 'Password: ') {
    if (appWindow.lightdm) {
      appWindow.lightdm.respond(password)
    }
  }
}

appWindow.authentication_complete = () => {
  if (appWindow?.lightdm?.is_authenticated && completeCallback) {
    completeCallback()
  } else if (appWindow?.lightdm && globalErrorCallback) {
    appWindow.lightdm.cancel_authentication()
    globalErrorCallback('Invalid username/password')
  } else {
    alert('SOMETHING WRONG')
  }
}

appWindow.show_message = (text, type) => {
  if (globalErrorCallback) {
    globalErrorCallback(text)
  } else {
    alert('SOMETHING WRONG with show_message')
  }
}
