import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import GL from '@/utils/gl'
import { useAppStore } from '@/store/app'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

let render: GL

export default defineComponent({
  name: 'RingsTheme',
  setup() {
    const appStore = useAppStore()
    const canvasRef = ref<HTMLCanvasElement | null>(null)

    const hue = computed(() => appStore.getThemeInput('hue')?.value as number || 0)
    const animationSpeed = computed(() => appStore.getThemeInput('animation-speed')?.value as number || 45)
    const zoom = computed(() => appStore.getThemeInput('zoom')?.value as number || 32)
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
            if (!gl.programInfo.uniforms.hue) {
              gl.programInfo.uniforms.hue = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'hue')
              gl.programInfo.uniforms.zoom = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'zoom')
            }
            gl.time += animationSpeed.value / 500
            gl.pxratio = pxratio.value
            gl.ctx.uniform1f(gl.programInfo.uniforms.time, gl.time)
            gl.ctx.uniform1f(gl.programInfo.uniforms.hue, hue.value)
            gl.ctx.uniform1f(gl.programInfo.uniforms.zoom, zoom.value)
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
