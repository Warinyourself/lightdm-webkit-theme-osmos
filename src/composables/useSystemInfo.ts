import { ref } from 'vue'

export interface BatteryData {
  level: number
  status: string
  ac_status: boolean
}

export interface LayoutData {
  name: string
  short_description: string
  description: string
}

const canAccessBattery = ref(false)
const canAccessBrightness = ref(false)
const battery = ref<BatteryData | null>(null)
const brightness = ref(0)
const layouts = ref<LayoutData[]>([])
const currentLayout = ref<LayoutData | null>(null)

function _readBattery() {
  const b = (window.lightdm as any)?.battery_data
  if (b) battery.value = { level: b.level, status: b.status, ac_status: b.ac_status }
}

export function initSystemInfo() {
  canAccessBattery.value = !!(window.lightdm as any)?.can_access_battery
  canAccessBrightness.value = !!(window.lightdm as any)?.can_access_brightness

  if (canAccessBattery.value) {
    _readBattery()
    ;(window.lightdm as any)?.battery_update?.connect(_readBattery)
  }

  if (canAccessBrightness.value) {
    brightness.value = (window.lightdm as any)?.brightness ?? 0
    ;(window.lightdm as any)?.brightness_update?.connect(() => {
      brightness.value = (window.lightdm as any)?.brightness ?? 0
    })
  }

  const ldmLayouts: any[] = (window.lightdm as any)?.layouts || []
  layouts.value = ldmLayouts.map((l) => ({
    name: l.name,
    short_description: l.short_description,
    description: l.description,
  }))

  const ldmLayout = (window.lightdm as any)?.layout
  if (ldmLayout) {
    currentLayout.value = {
      name: ldmLayout.name,
      short_description: ldmLayout.short_description,
      description: ldmLayout.description,
    }
  }
}

function cycleLayout() {
  if (!layouts.value.length) return
  const idx = layouts.value.findIndex((l) => l.name === currentLayout.value?.name)
  const next = layouts.value[(idx + 1) % layouts.value.length]!
  currentLayout.value = next
  ;(window.lightdm as any).layout = next
}

function setBrightness(value: number) {
  brightness.value = Math.max(0, Math.min(100, Math.round(value)))
  ;(window.lightdm as any)?.brightness_set?.(brightness.value)
}

export function useSystemInfo() {
  return {
    canAccessBattery,
    canAccessBrightness,
    battery,
    brightness,
    layouts,
    currentLayout,
    cycleLayout,
    setBrightness,
  }
}
