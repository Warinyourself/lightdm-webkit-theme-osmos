import { reactive } from 'vue'

export const timePresets = {
  'HH:mm': { hour: 'numeric', minute: 'numeric', hour12: false },
  'HH:mm:ss': { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false },
  'short': { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric', hour12: false },
  'long': { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric', hour12: false },
} as const satisfies Record<string, Intl.DateTimeFormatOptions>

export type TimePreset = keyof typeof timePresets

const timeRef = reactive({ time: new Date() })

export const initTimer = () => {
  timeRef.time = new Date()
  setInterval(() => { timeRef.time = new Date() }, 1000)
}

export default timeRef
