import { AppModule } from '@/store/app'
import { Component, Vue } from 'vue-property-decorator'

let elapsedTime = 0
let frameCount = 0
let lastTime = new Date().getTime()

@Component
export default class FrameRateBlock extends Vue {
  FPS = 0

  get isShow() {
    return AppModule.showFrameRate
  }

  mounted() {
    this.FPS = 0
    this.drawScene()
    lastTime = new Date().getTime()
  }

  drawScene() {
    const now = new Date().getTime()

    frameCount++
    elapsedTime += (now - lastTime)

    lastTime = now

    if (elapsedTime >= 1000) {
      const fps = frameCount
      frameCount = 0
      elapsedTime -= 1000

      this.FPS = fps
    }

    if (this.isShow) {
      requestAnimationFrame(this.drawScene)
    }
  }

  render() {
    return <div class="frame-rate-block"> FPS: { this.FPS } </div>
  }
}
