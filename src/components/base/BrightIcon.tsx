import { AppModule } from '@/store/app'
import { Component, Vue } from 'vue-property-decorator'
import AppIcon from '@/components/app/AppIcon.vue'

@Component({
  components: { AppIcon }
})
export default class BrightIcon extends Vue {
  get brightLevel() {
    return AppModule.brightness
  }

  render() {
    return <div class="app-bar__bright">
      <AppIcon name="brightness" class="brightness-icon"/>
      { this.brightLevel }
    </div>
  }
}
