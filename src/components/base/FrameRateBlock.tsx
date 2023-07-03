import { defineComponent, ref, computed, onMounted } from 'vue'
import { useAppStore } from '@/store/app'

let elapsedTime = 0
let frameCount = 0
let lastTime = new Date().getTime()

export default defineComponent({
  name: 'FrameRateBlock',
  setup() {
    const appStore = useAppStore()
    const FPS = ref(0)
    const isShow = computed(() => appStore.showFrameRate)

    const drawScene = () => {
      const now = new Date().getTime()
      frameCount++
      elapsedTime += now - lastTime
      lastTime = now

      if (elapsedTime >= 1000) {
        FPS.value = frameCount
        frameCount = 0
        elapsedTime -= 1000
      }

      if (isShow.value) {
        requestAnimationFrame(drawScene)
      }
    }

    onMounted(() => {
      FPS.value = 0
      drawScene()
      lastTime = new Date().getTime()
    })

    return () => <div class="frame-rate-block">FPS: {FPS.value}</div>
  }
})
