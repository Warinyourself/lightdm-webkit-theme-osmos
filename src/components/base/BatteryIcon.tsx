import { AppModule } from '@/store/app'
import { Component, Vue } from 'vue-property-decorator'
import AppIcon from '@/components/app/AppIcon.vue'

@Component({
  components: { AppIcon }
})
export default class BatteryIcon extends Vue {
  get batteryLevel() {
    return AppModule.batteryLevel
  }

  get isCharging() {
    return AppModule.isCharging
  }

  render() {
    return <div class="app-bar-battery">
      <div class="app-bar-battery-icon">
        <div
          class={`app-bar-battery-icon__fill ${this.isCharging ? 'charging' : ''}`}
          style={{ width: `${this.batteryLevel}%` }}
        />
        { this.isCharging && <AppIcon name="charge" class="app-bar-battery-icon__charge"/>}
      </div>
      <span class="app-bar-battery__percent"> { this.batteryLevel }% </span>
    </div>
  }
}
