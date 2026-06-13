import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import GL from '@/utils/gl'
import { useThemeStore } from '@/store/theme'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

let render: GL

export default defineComponent({
  name: 'RandomTheme',
  setup() {
    const themeStore = useThemeStore()
    const canvasRef = ref<HTMLCanvasElement | null>(null)

    const hue = computed(() => themeStore.getThemeInput('hue')?.value as number || 0)
    const brightness = computed(() => themeStore.getThemeInput('brightness')?.value as number || 0)
    const invert = computed(() => themeStore.getThemeInput('invert')?.value as boolean || false)
    const animationSpeed = computed(() => themeStore.getThemeInput('animation-speed')?.value as number || 45)
    const symmetry = computed(() => themeStore.getThemeInput('symmetry')?.value as number || 64)
    const thickness = computed(() => themeStore.getThemeInput('thickness')?.value as number || 64)
    const pxratio = computed(() => themeStore.getThemeInput('pxratio')?.value as number || 0.8)

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
            if (!gl.programInfo.uniforms.symmetry) {
              gl.programInfo.uniforms.symmetry = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'symmetry')
              gl.programInfo.uniforms.thickness = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'thickness')
            }
            gl.pxratio = pxratio.value
            gl.time += animationSpeed.value / 500
            gl.ctx.uniform1f(gl.programInfo.uniforms.symmetry, symmetry.value)
            gl.ctx.uniform1f(gl.programInfo.uniforms.thickness, thickness.value)
            gl.ctx.uniform1f(gl.programInfo.uniforms.time, gl.time + (gl.time * animationSpeed.value / 10))
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
