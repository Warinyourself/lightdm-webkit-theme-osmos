import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import GL from '@/utils/gl'
import { useAppStore } from '@/store/app'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

let render: GL

export default defineComponent({
  name: 'FlowTheme',
  setup() {
    const appStore = useAppStore()
    const canvasRef = ref<HTMLCanvasElement | null>(null)

    const hue = computed(() => appStore.getThemeInput('hue')?.value as number || 0)
    const brightness = computed(() => appStore.getThemeInput('brightness')?.value as number || 0)
    const invert = computed(() => appStore.getThemeInput('invert')?.value as boolean || false)
    const animationSpeed = computed(() => appStore.getThemeInput('animation-speed')?.value as number || 45)
    const size = computed(() => appStore.getThemeInput('size')?.value as number || 0.2)
    const pxratio = computed(() => appStore.getThemeInput('pxratio')?.value as number || 0.8)

    const styleCanvas = computed(() => ({
      filter: `hue-rotate(${hue.value}deg) invert(${Number(invert.value)}) brightness(${brightness.value})`
    }))

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
            if (!gl.programInfo.uniforms.size) {
              gl.programInfo.uniforms.size = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'size')
            }
            gl.pxratio = pxratio.value
            gl.time += animationSpeed.value / 500
            gl.ctx.uniform1f(gl.programInfo.uniforms.time, gl.time)
            gl.ctx.uniform1f(gl.programInfo.uniforms.size, size.value)
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
        <canvas ref={canvasRef} style={styleCanvas.value} />
      </div>
    )
  }
})
