import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import GL from '@/utils/gl'
import { useThemeStore } from '@/store/theme'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

let render: GL

export default defineComponent({
  name: 'TendernessTheme',
  setup() {
    const themeStore = useThemeStore()
    const canvasRef = ref<HTMLCanvasElement | null>(null)

    const animationSpeed = computed(() => themeStore.getThemeInput('animation-speed')?.value as number || 45)
    const pxratio = computed(() => themeStore.getThemeInput('pxratio')?.value as number || 0.8)

    onMounted(() => {
      render = new GL(
        canvasRef.value!,
        vertexShader,
        fragmentShader,
        window.innerWidth,
        window.innerHeight,
        {
          renderOptions: { externalTimeUse: true },
          renderHook() {
            const gl = this as unknown as GL
            gl.time += animationSpeed.value / 500
            gl.pxratio = pxratio.value
            gl.ctx.uniform1f(gl.programInfo.uniforms.time, gl.time)
          }
        }
      )
      render.running = true
    })

    onBeforeUnmount(() => {
      render.running = false
    })

    return () => (
      <div>
        <canvas ref={canvasRef} />
      </div>
    )
  }
})
