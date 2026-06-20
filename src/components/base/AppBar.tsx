import { defineComponent, computed } from 'vue'
import { Power, Sun, Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning } from '@lucide/vue'
import { useLightdm } from '@/composables/useLightdm'
import { useSystemInfo } from '@/composables/useSystemInfo'
import { useAppStore } from '@/store/app'
import { usePageStore } from '@/store/page'
import { getDesktopIcon, systemActionsObject } from '@/utils/helper'
import AppIcon from '@/components/app/AppIcon.vue'
import timeRef, { timePresets, type TimePreset } from '@/utils/time'

export default defineComponent({
  name: 'AppBar',
  setup() {
    const session = useLightdm()
    const sys = useSystemInfo()
    const appStore = useAppStore()
    const pageStore = usePageStore()

    const formattedTime = computed(() => {
      const preset = (appStore.timeFormat as TimePreset) || 'HH:mm'
      const options = timePresets[preset] ?? timePresets['HH:mm']
      return new Intl.DateTimeFormat(pageStore.locale, options).format(timeRef.time)
    })

    const BatteryIcon = computed(() => {
      if (!sys.battery.value) return Battery
      const { level, ac_status } = sys.battery.value
      if (ac_status) return BatteryCharging
      if (level > 80) return BatteryFull
      if (level > 50) return BatteryMedium
      if (level > 20) return BatteryLow
      return BatteryWarning
    })

    return () => {
      const desktop = session.currentDesktop.value
      const layout = sys.currentLayout.value
      const bat = sys.battery.value

      return (
        <div class="app-bar">
          {appStore.showTime && (
            <div class="app-bar__item">
              <span class="app-bar__time">{formattedTime.value}</span>
            </div>
          )}

          {desktop && (
            <div class="app-bar__item">
              <AppIcon name={getDesktopIcon(desktop.key)} />
              <span>{desktop.name}</span>
            </div>
          )}

          {layout && (
            <div class="app-bar__item app-bar__item--clickable" onClick={sys.cycleLayout}>
              <span class="app-bar__layout">{layout.short_description.toUpperCase()}</span>
            </div>
          )}

          {sys.canAccessBattery.value && bat && (
            <div class="app-bar__item">
              <BatteryIcon.value />
              <span>{Math.round(bat.level)}%</span>
            </div>
          )}

          {sys.canAccessBrightness.value && (
            <div class="app-bar__item">
              <Sun />
              <span>{Math.round(sys.brightness.value)}%</span>
            </div>
          )}

          <div class="app-bar__item app-bar__item--clickable" onClick={systemActionsObject.shutdown}>
            <Power />
          </div>
        </div>
      )
    }
  }
})
