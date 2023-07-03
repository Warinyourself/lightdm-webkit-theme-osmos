import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import GL from '@/utils/gl'
import { useAppStore } from '@/store/app'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

let render: GL

export default defineComponent({
  name: 'DestructionTheme',
  setup() {
    const appStore = useAppStore()
    const canvasRef = ref<HTMLCanvasElement | null>(null)

    const perspective = computed(() => appStore.getThemeInput('perspective')?.value as number || 0.2)
    const position = computed(() => appStore.getThemeInput('position')?.value as number || 0.2)
    const animationSpeed = computed(() => appStore.getThemeInput('animation-speed')?.value as number || 45)
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
              gl.programInfo.uniforms.position = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'position')
              gl.programInfo.uniforms.perspective = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'perspective')
            }
            gl.pxratio = pxratio.value
            gl.time += animationSpeed.value / 500
            gl.ctx.uniform1f(gl.programInfo.uniforms.time, gl.time)
            gl.ctx.uniform1f(gl.programInfo.uniforms.position, position.value)
            gl.ctx.uniform1f(gl.programInfo.uniforms.perspective, perspective.value)
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
