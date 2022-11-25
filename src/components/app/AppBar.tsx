import { AppModule } from '@/store/app'
import { Component, Vue } from 'vue-property-decorator'
import AppIcon from './AppIcon.vue'
import timer from '@/utils/time'
import BatteryIcon from '../base/BatteryIcon'

@Component({
  components: { AppIcon, BatteryIcon }
})
export default class AppSelector extends Vue {
  get batteryLevel() {
    return AppModule.batteryLevel
  }

  get brightLevel() {
    return AppModule.brightness
  }

  get currentTime() {
    return timer.longTime
  }

  render() {
    return <div class="app-bar">
      <div class="app-bar__time"> { timer.longTime } </div>
      <div class="app-bar__info">
        <BatteryIcon />
        <div class="app-bar__bright">
          <AppIcon name="brightness" class="brightness-icon"/>
          { this.brightLevel }
        </div>
      </div>
    </div>
  }
}
