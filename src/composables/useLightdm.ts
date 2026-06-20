import { computed, ref } from 'vue'
import type { LightdmSession, LightdmUsers } from '@/models/lightdm'

const username = ref('')
const password = ref('')
const desktop = ref('')
const showPassword = ref(false)
const users = ref<LightdmUsers[]>([])
const desktops = ref<LightdmSession[]>([])
const canShutdown = ref(false)
const canRestart = ref(false)
const canSuspend = ref(false)
const canHibernate = ref(false)

const currentUser = computed(() => users.value.find((u) => u.username === username.value))
const currentDesktop = computed(() => desktops.value.find(({ key }) => key === desktop.value))

let _errorTimer: ReturnType<typeof setTimeout> | null = null

function _setInputError() {
  const el = document.getElementById('password')
  if (!el) return
  el.classList.add('password-input--error')
  if (_errorTimer) clearTimeout(_errorTimer)
  _errorTimer = setTimeout(() => {
    el.classList.remove('password-input--error')
    _errorTimer = null
  }, 10000)
}

function _setupSignals() {
  window.lightdm?.show_message?.connect((text: string, type: any) => {
    console.log({ text, type })
  })

  window.lightdm?.show_prompt?.connect((_message: string, type: number) => {
    if (!window.lightdm) return
    if (type === 0) {
      window.lightdm.respond(username.value)
    } else if (type === 1 && (window.lightdm as any).in_authentication) {
      window.lightdm.respond(password.value)
    }
  })

  window.lightdm?.authentication_complete?.connect(() => {
    if (window.lightdm?.is_authenticated) {
      window.lightdm.start_session(desktop.value || window.lightdm.default_session)
    } else {
      window.lightdm?.cancel_authentication()
      _setInputError()
    }
  })

  window.lightdm_cancel_login = () => window.lightdm?.cancel_authentication()
  window.lightdm_start = (d: string) => window.lightdm?.start_session(d)

  window.show_prompt = (text: string) => {
    if (text === 'Password: ') window.lightdm?.respond(password.value)
  }

  window.authentication_complete = () => {
    if (window.lightdm?.is_authenticated) {
      window.lightdm_start(desktop.value)
    } else if (document.head.dataset.wintype === 'primary') {
      window.lightdm?.cancel_authentication()
    }
  }
}

export function initLightdm() {
  users.value = (window.lightdm?.users || []) as LightdmUsers[]
  desktops.value = (window.lightdm?.sessions || []) as LightdmSession[]
  username.value = users.value[0]?.username || ''
  desktop.value = window.lightdm?.default_session || desktops.value[0]?.key || ''
  canShutdown.value = !!window.lightdm?.can_shutdown
  canRestart.value = !!window.lightdm?.can_restart
  canSuspend.value = !!window.lightdm?.can_suspend
  canHibernate.value = !!window.lightdm?.can_hibernate
  _setupSignals()
}

function login() {
  window.lightdm?.authenticate(username.value)
}

function toggleShowPassword() {
  showPassword.value = !showPassword.value
}

function shutdown() { window.lightdm?.shutdown() }
function hibernate() { window.lightdm?.hibernate() }
function suspend() { window.lightdm?.suspend() }
function restart() { window.lightdm?.restart() }

export function useLightdm() {
  return {
    username,
    password,
    desktop,
    showPassword,
    users,
    desktops,
    currentUser,
    currentDesktop,
    canShutdown,
    canRestart,
    canSuspend,
    canHibernate,
    login,
    toggleShowPassword,
    shutdown,
    hibernate,
    suspend,
    restart,
  }
}
