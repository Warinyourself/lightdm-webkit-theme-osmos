const DEBUG_PASSWORD = 'password'

if (window.lightdm === undefined) {
  window.lightdm = {
    is_authenticated: false,
    authentication_user: undefined,
    default_session: 'gnome-shell',
    can_suspend: true,
    can_restart: true,
    can_hibernate: true,
    can_shutdown: true,
    can_access_battery: true,
    can_access_brightness: true,

    battery_data: { name: 'BAT0', level: 78, status: 'Discharging', ac_status: false, capacity: 100, time: '1:30', watt: 10 },
    brightness: 70,

    layouts: [
      { name: 'us', description: 'English (US)', short_description: 'en' },
      { name: 'ru', description: 'Russian', short_description: 'ru' },
    ],
    layout: { name: 'us', description: 'English (US)', short_description: 'en' },

    authentication_complete: { connect: () => {} },
    show_message: { connect: () => {} },
    show_prompt: { connect: () => {} },
    battery_update: { connect: () => {} },
    brightness_update: { connect: () => {} },

    sessions: [
      { name: 'GNOME', key: 'gnome-shell' },
      { name: 'KDE', key: 'plasma-shell' },
      { name: 'XFCE', key: 'xfce' },
      { name: 'Cinnamon', key: 'cinnamon' },
      { name: 'i3', key: 'i3' },
      { name: 'Openbox', key: 'openbox' },
    ],
    users: [
      {
        display_name: 'Warinyourself',
        username: 'Warinyourself',
        image: 'https://avatars.githubusercontent.com/u/83131232?s=200&u=26fbedfe561a2b37225c78c10b1c5d67d6fe1832&v=4'
      },
      { display_name: 'Bob', username: 'Bob' }
    ],
    languages: [
      { name: 'Русский', code: 'ru_RU.utf8' },
      { name: 'American English', code: 'en_US.utf8' }
    ],
    language: { code: 'en_US', name: 'American English' },

    authenticate: (username: string) => {
      if (window.lightdm) (window.lightdm as any).authentication_user = username
      const inputNode = document.getElementById('password') as HTMLInputElement
      window.lightdm?.respond(inputNode?.value || '')
    },
    cancel_authentication: () => { console.log('Auth cancelled') },
    start_session: (session: string) => { alert(`Start session: ${session}`) },
    respond: (password: string) => {
      ;(window.lightdm as any).is_authenticated = password === DEBUG_PASSWORD
      window.authentication_complete?.()
    },
    shutdown: () => { alert('(DEBUG: shutdown)') },
    hibernate: () => { alert('(DEBUG: hibernate)') },
    suspend: () => { alert('(DEBUG: suspend)') },
    restart: () => { alert('(DEBUG: restart)') },
  } as any
}
