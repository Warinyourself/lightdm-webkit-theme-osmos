import { AppModule } from '@/store/app'
import { Component, Vue } from 'vue-property-decorator'
import AppIcon from './AppIcon.vue'
import timer from '@/utils/time'
import BatteryIcon from '../base/BatteryIcon'
import BrightIcon from '../base/BrightIcon'

@Component({
  components: { AppIcon, BatteryIcon, BrightIcon }
})
export default class AppBar extends Vue {
  get showBattery() {
    return AppModule.battery
  }

  get showBright() {
    return !!AppModule.brightness
  }

  get currentTime() {
    return timer.longTime
  }

  render() {
    return <div class="app-bar">
      <div class="app-bar__time"> { timer.longTime } </div>
      <div class="app-bar__info">
        { this.showBattery && <BatteryIcon /> }
        { this.showBright && <BrightIcon /> }
      </div>
    </div>
  }
}
