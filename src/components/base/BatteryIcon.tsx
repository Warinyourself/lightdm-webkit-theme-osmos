import AppIcon from '@/components/app/AppIcon.vue'
import { defineComponent } from 'vue'
import { useAppStore } from '@/store/app'

export default defineComponent({
  name: 'BatteryIcon',
  setup() {
    const appStore = useAppStore()
    return () => (
      <div class="app-bar-battery">
        <div class="app-bar-battery-icon">
          <div
            class={`app-bar-battery-icon__fill ${appStore.isCharging ? 'charging' : ''}`}
            style={{ width: `${appStore.batteryLevel}%` }}
          />
          {appStore.isCharging && <AppIcon name="charge" class="app-bar-battery-icon__charge" />}
        </div>
        <span class="app-bar-battery__percent">{appStore.batteryLevel}%</span>
      </div>
    )
  }
})
