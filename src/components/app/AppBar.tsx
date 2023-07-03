import { defineComponent } from 'vue'
import { useAppStore } from '@/store/app'
import timer from '@/utils/time'
import BatteryIcon from '@/components/base/BatteryIcon'
import BrightIcon from '@/components/base/BrightIcon'

export default defineComponent({
  name: 'AppBar',

  setup() {
    const appStore = useAppStore()

    return () => (
      <div class="app-bar active-interface">
        <div class="app-bar__time">{timer.longTime}</div>
        <div class="app-bar__info">
          {appStore.battery && <BatteryIcon />}
          {!!appStore.brightness && <BrightIcon />}
        </div>
      </div>
    )
  }
})
