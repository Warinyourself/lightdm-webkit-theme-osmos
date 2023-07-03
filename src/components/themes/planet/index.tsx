import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import GL from '@/utils/gl'
import { useAppStore } from '@/store/app'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

let render: GL

export default defineComponent({
  name: 'PlanetTheme',
  setup() {
    const appStore = useAppStore()
    const canvasRef = ref<HTMLCanvasElement | null>(null)

    const animationSpeed = computed(() => appStore.getThemeInput('animation-speed')?.value as number || 45)
    const position = computed(() => appStore.getThemeInput('position')?.value as number || 2.14)
    const pxratio = computed(() => appStore.getThemeInput('pxratio')?.value as number || 0.8)

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
            if (!gl.programInfo.uniforms.position) {
              gl.programInfo.uniforms.position = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'camR')
            }
            gl.pxratio = pxratio.value
            gl.time += animationSpeed.value / 500
            gl.ctx.uniform1f(gl.programInfo.uniforms.time, gl.time + (gl.time * animationSpeed.value / 10))
            gl.ctx.uniform1f(gl.programInfo.uniforms.position, position.value)
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
