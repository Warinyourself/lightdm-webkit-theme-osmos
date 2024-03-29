import { Component, Vue } from 'vue-property-decorator'
import Parallax from 'parallax-js'
import AppIcon from '@/components/app/AppIcon.vue'

@Component({
  components: {
    AppIcon
  }
})
export default class SuprematismTheme extends Vue {
  parallax: null | Parallax = null

  render() {
    return <div class="suprematism" ref="scene" data-hover-only="true" data-friction-x="0.1" data-friction-y="0.1" data-scalar-x="25" data-scalar-y="15">
      <li class="prllx-block" data-depth="0.0">
        <div class="parralax-item-cube position-center"></div>
      </li>
      <li class="prllx-block" data-depth="0.05">
        <div class="parralax-item-bottom-left">
          <AppIcon name="suprematism-bottom-left"/>
        </div>
        <div class="parralax-item-bottom-right">
          <AppIcon name="suprematism-bottom-right"/>
        </div>
        <div class="parralax-item-top-right">
          <AppIcon name="suprematism-top-right"/>
        </div>
        <div class="parralax-item-top-left">
          <AppIcon name="suprematism-top-left"/>
        </div>
      </li>
      <li class="prllx-block" data-depth=".1">
        <div class="parralax-item-bottom-right-triangle"></div>
        <div class="parralax-item-top-left-multi"></div>
        <div class="parralax-item-bottom-left-pattern">
          <AppIcon name="suprematism-bottom-left-pattern"/>
        </div>
      </li>
      <li class="prllx-block" data-depth=".2">
        <div class="ps-parralax-item-top-right-circle"></div>
      </li>
    </div>
  }

  mounted() {
    const scene = this.$refs.scene as HTMLElement
    if (scene) { this.parallax = new Parallax(scene) }
  }

  beforeDestroy() {
    if (this.parallax) this.parallax.destroy()
  }
}
