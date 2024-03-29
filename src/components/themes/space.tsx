import { AppModule } from '@/store/app'
import { Component, Vue } from 'vue-property-decorator'
import Parallax from 'parallax-js'

@Component
export default class SpaceTheme extends Vue {
  parallax: null | Parallax = null

  render() {
    return <div class="space" ref="scene" data-hover-only="true" data-friction-x="0.1" data-friction-y="0.1" data-scalar-x="25" data-scalar-y="15">
      <li class="prllx-block" data-depth="0.0">
        <div class="main-planet position-center"></div>
      </li>
      <li class="prllx-block" data-depth="0.2">
        <div class="ufo"></div>
      </li>
      <li class="prllx-block" data-depth="0.1">
        <div class="meteor"></div>
      </li>
      <li class="prllx-block" data-depth="0.07">
        <div class="hole"></div>
      </li>
      <li class="prllx-block" data-depth="0.02">
        <div class="another-planet"></div>
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
